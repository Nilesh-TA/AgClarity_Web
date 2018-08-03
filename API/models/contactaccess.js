const db = require('../config/dbconnection');

let ContactAccess = {
    getAllContactAccess: function (company, userid,  pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "id_contact_access";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(DISTINCT c.id_contact_access) AS TotalRows
                    FROM \`contactaccess\` c  
                    WHERE IFNULL(c.isdeleted,0) = 0  
                    AND c.company = ${company}               
                    AND c.contactprofileid = ${userid}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            c.*
                            FROM \`contactaccess\` c  
                            WHERE IFNULL(c.isdeleted,0) = 0  
                            AND c.company = ${company}               
                            AND c.contactprofileid = ${userid}             
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },    
    getContactAccess: function (callback) {
        return db.query("SELECT * FROM \`contactaccess\` WHERE IFNULL(\`isdeleted\`,0) = 0 ", callback);
    },
    getSelectedMicroApps: function (profileId, companyId, callback) {
        return db.query(`SELECT * 
                            FROM \`contactaccess\` 
                            WHERE IFNULL(isdeleted,0) = 0 
                                AND contactprofileid = ${profileId}
                                AND company = ${companyId}
                        `,[
                            profileId, 
                            companyId
                        ], callback);
    },
    getContactAccessById: function (id, callback) {
        return db.query("SELECT * FROM contactaccess WHERE IFNULL(\`isdeleted\`,0) = 0  AND `id_contact_access`=?", [id], callback);
    },
    getContactAccessByProfileId: function (profileid, callback) {
        return db.query(`SELECT ca.id_contact_access, ca.contactprofileid, ca.micro_apps, ca.company, c.name AS company_name 
                            FROM contactaccess ca INNER JOIN company c ON ca.company = c.ID_company AND IFNULL(c.isdeleted,0) = 0 
                            WHERE IFNULL(ca.isdeleted,0) = 0  
                            AND ca.contactprofileid = ? 
                            ORDER BY ca.company, ca.id_contact_access`, 
                    [
                        profileid
                    ], callback);
    },
    addContactAccess: function (ContactAccess, callback) {
        return db.query(`INSERT INTO \`contactaccess\`
                            (
                                \`contactprofileid\`,
                                \`company\`,
                                \`micro_apps\`
                            ) 
                            VALUES(?,?,?)
                        `,
            [
                ContactAccess.contactprofileid,
                ContactAccess.company,
                ContactAccess.micro_apps
            ], callback);
    },
    deleteContactAccess: function (id, callback) {        
        return db.query("UPDATE \`contactaccess\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0 AND `id_contact_access`=? ", [id], callback);
    },
    updateContactAccess: function (id, ContactAccess, callback) {
        return db.query(`UPDATE \`contactaccess\` SET 
                                \`contactprofileid\` = ?,
                                \`company\` = ?,
                                \`micro_apps\` = ?
                            WHERE \`id_contact_access\` = ? 
                        `,
            [
                ContactAccess.contactprofileid,
                ContactAccess.company,
                ContactAccess.micro_apps,             
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, id_contact_access, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "contactaccess.id_contact_access" + "'," + id_contact_access + " , " + id_contact_access + ", " + id_contact_access + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("contactaccess." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + id_contact_access + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "contactaccess.id_contact_access" + "'," + id_contact_access + " , " + id_contact_access + "," + id_contact_access + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`contactaccess\` WHERE IFNULL(\`isdeleted\`,0) = 0  ORDER BY id_contact_access LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    contactaccessCRUD: function (body, callback) {

        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {

            for (let i = 0; i < body.add.length; i++) {                
                let ContactAccess = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`contactaccess\`
                            (
                                \`contactprofileid\`,
                                \`company\`,
                                \`micro_apps\`
                            ) 
                            VALUES(?,?,?)
                        `,
                        [
                            ContactAccess.contactprofileid,
                            ContactAccess.company,
                            ContactAccess.micro_apps
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
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "contactaccess.id_contact_access" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

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
                let id_contact_access = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`contactaccess\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `id_contact_access`=? ", [id_contact_access],
                        function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "contactaccess.id_contact_access" + "'," + id_contact_access + ", " + id_contact_access + ", " + id_contact_access + ")";

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
                let ContactAccess = body.update.new[i];
                let OldContactAccess = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`contactaccess\` SET 
                                \`contactprofileid\` = ?,
                                \`company\` = ?,
                                \`micro_apps\` = ?
                            WHERE \`id_contact_access\` = ? 
                        `,
                        [
                            ContactAccess.contactprofileid,
                            ContactAccess.company,
                            ContactAccess.micro_apps,
                            ContactAccess.id_contact_access
                        ], function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(ContactAccess);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldContactAccess[field] != ContactAccess[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("contactaccess." + field) + "', '" + OldContactAccess[field] + "', '" + ContactAccess[field] + "'," + ContactAccess.id_contact_access + "),";
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

module.exports = ContactAccess;