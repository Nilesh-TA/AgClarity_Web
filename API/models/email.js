const db = require('../config/dbconnection');

let Email = {
    getAllEmails: function (userid, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_email";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`email\` e           
                    WHERE IFNULL(\`isdeleted\`,0) = 0            
                    AND e.contact = ${userid}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            e.*
                            FROM \`email\` e           
                            WHERE IFNULL(\`isdeleted\`,0) = 0            
                            AND e.contact = ${userid}            
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getEmail: function (callback) {
        return db.query("SELECT * FROM \`email\` WHERE IFNULL(\`isdeleted\`,0) = 0 ORDER BY `ID_email` DESC", callback);
    },
    getEmailById: function (id, callback) {
        return db.query("SELECT * FROM \`email\` WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_email` = ?", [id], callback);
    },
    getEmailByContactProfileId: function (profileId, callback) {
        return db.query("SELECT * FROM \`email\` WHERE IFNULL(\`isdeleted\`,0) = 0  AND `contact` = ? ORDER BY `ID_email`", [profileId], callback);
    },
    addEmail: function (Email, callback) {
        return db.query(`INSERT INTO \`email\`
                            (
                                \`email\`,
                                \`contact\`,
                                \`type\`
                            ) 
                            VALUES(?,?,?)
                        `,
            [
                Email.email,
                Email.contact,
                Email.type
            ], callback);
    },
    deleteEmail: function (id, callback) {
        return db.query("UPDATE \`email\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_email` = ?", [id], callback);
    },
    updateEmail: function (id, Email, callback) {
        return db.query(`UPDATE \`email\` SET 
                                \`email\` = ?,
                                \`contact\` = ?,
                                \`type\` = ?
                            WHERE \`ID_email\` = ? 
                        `,
            [
                Email.email,
                Email.company,
                Email.type,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_email, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "email.ID_email" + "'," + ID_email + " , " + ID_email + ", " + ID_email + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("email." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_email + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "email.ID_email" + "'," + ID_email + " , " + ID_email + "," + ID_email + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`email\` WHERE IFNULL(\`isdeleted\`,0) = 0  ORDER BY ID_email LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    emailCRUD: function (body, callback) {        
        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {

            for (let i = 0; i < body.add.length; i++) {                
                let Email = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`email\`
                            (
                                \`email\`,
                                \`contact\`,
                                \`type\`
                            ) 
                            VALUES(?,?,?)
                        `,
                        [
                            Email.email,
                            Email.contact,
                            Email.type
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
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "email.ID_email" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

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

                let ID_email = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`email\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_email`=? ", [ID_email],
                        function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "email.ID_email" + "'," + ID_email + ", " + ID_email + ", " + ID_email + ")";

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
                
                let Email = body.update.new[i];
                let OldEmail = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`email\` SET 
                                \`email\` = ?,
                                \`contact\` = ?,
                                \`type\` = ?
                            WHERE \`ID_email\` = ? 
                        `,
                        [
                            Email.email,
                            Email.contact,
                            Email.type,
                            Email.ID_email
                        ], function (err, result) {
                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(Email);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldEmail[field] != Email[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("email." + field) + "', '" + OldEmail[field] + "', '" + Email[field] + "'," + Email.ID_email + "),";
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

module.exports = Email;