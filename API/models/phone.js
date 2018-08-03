const db = require('../config/dbconnection');

let Phone = {
    getAllPhones: function (userid,  pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_phone";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`phone\` p    
                    WHERE IFNULL(\`isdeleted\`,0) = 0                   
                    AND p.contact = ${userid}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            p.*
                            FROM \`phone\` p  
                            WHERE IFNULL(\`isdeleted\`,0) = 0                     
                            AND p.contact = ${userid}            
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },    
    getPhone: function (callback) {
        return db.query("SELECT * FROM \`phone\` WHERE IFNULL(\`isdeleted\`,0) = 0 ORDER BY `ID_phone` DESC", callback);
    },
    getPhoneById: function (id, callback) {
        return db.query("SELECT * FROM \`phone\` WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_phone` = ?", [id], callback);
    },
    getPhoneByContactProfileId: function (profileId, callback) {
        return db.query("SELECT * FROM \`phone\` WHERE IFNULL(\`isdeleted\`,0) = 0  AND `contact` = ? ORDER BY `ID_phone`", [profileId], callback);
    },
    addPhone: function (Phone, callback) {
        return db.query(`INSERT INTO \`phone\`
                            (
                                \`number\`,
                                \`contact\`,
                                \`type\`
                            ) 
                            VALUES(?,?,?)
                        `,
            [
                Phone.number,
                Phone.contact,
                Phone.type
            ], callback);
    },
    deletePhone: function (id, callback) {
        return db.query("UPDATE \`phone\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_phone` = ?", [id], callback);
    },
    updatePhone: function (id, Phone, callback) {
        return db.query(`UPDATE \`phone\` SET 
                                \`number\` = ?,
                                \`contact\` = ?,
                                \`type\` = ?
                            WHERE \`ID_phone\` = ? 
                        `,
            [
                Phone.number,
                Phone.contact,
                Phone.type,             
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_phone, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "phone.ID_phone" + "'," + ID_phone + " , " + ID_phone + ", " + ID_phone + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("phone." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_phone + "),";
                    }
                }
            }

            if (isChange) {
                queries = queries.trim(); //Remove whitespaces
                queries = queries.slice(0, -1); //Remove last charcters.
                queries = queries + ";" //Add semi-colon;
            } else {
                queries = "";
            }
        } else if (action == "delete") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "phone.ID_phone" + "'," + ID_phone + " , " + ID_phone + "," + ID_phone + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`phone\` WHERE IFNULL(\`isdeleted\`,0) = 0 ORDER BY ID_phone LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    phoneCRUD: function (body, callback) {
        
        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {

            for (let i = 0; i < body.add.length; i++) {                
                let Phone = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`phone\`
                            (
                                \`number\`,
                                \`contact\`,
                                \`type\`
                            ) 
                            VALUES(?,?,?)
                        `,
                        [
                            Phone.number,
                            Phone.contact,
                            Phone.type
                        ], function (err, result) {
                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            const insertId = result.insertId;
                            if (insertId > 0) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "phone.ID_phone" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

                                    resolve(db.query(query));
                                });
                                promiseArr.push(promise1);

                                resolve(true);
                            }
                        });
                });
                promiseArr.push(promise);
            }
        }

        //Delete
        if (body.delete && body.delete.length > 0) {
            for (let i = 0; i < body.delete.length; i++) {
                
                let ID_phone = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`phone\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_phone`=? ", [ID_phone],
                        function (err, result) {
                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "phone.ID_phone" + "'," + ID_phone + ", " + ID_phone + ", " + ID_phone + ")";

                                    resolve(db.query(query));
                                });
                                promiseArr.push(promise1);

                                resolve(true);
                            }
                        });
                });
                promiseArr.push(promise);
            }
        }

        //Update
        if (body.update && body.update != null) {
            for (let i = 0; i < body.update.new.length; i++) {
                
                let Phone = body.update.new[i];
                let OldPhone = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`phone\` SET 
                                \`number\` = ?,
                                \`contact\` = ?,
                                \`type\` = ?
                            WHERE \`ID_phone\` = ? 
                        `,
                        [
                            Phone.number,
                            Phone.contact,
                            Phone.type,
                            Phone.ID_phone
                        ], function (err, result) {
                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(Phone);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldPhone[field] != Phone[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("phone." + field) + "', '" + OldPhone[field] + "', '" + Phone[field] + "'," + Phone.ID_phone + "),";
                                            }
                                        }
                                    }

                                    if (isChange) {
                                        query = query.trim(); //Remove whitespaces
                                        query = query.slice(0, -1); //Remove last charcters.
                                        query = query + ";" //Add semi-colon;
                                    } else {
                                        query = "";
                                    }

                                    if (query != null && query != "") {
                                        resolve(db.query(query));
                                    } else {
                                        resolve(true);
                                    }
                                });
                                promiseArr.push(promise1);

                                resolve(true);
                            }
                        });
                });
                promiseArr.push(promise);
            }
        }

        Promise.all(promiseArr).then(function (data) {            
            return callback(null, data);
        }).catch(function (error) {            
            return callback(error, null);
        });
    },
}

module.exports = Phone;