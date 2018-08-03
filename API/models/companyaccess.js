const db = require('../config/dbconnection');

let CompanyAccess = {
    getAllCompanyAccess: function (company, userid,  pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_company_access";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(DISTINCT c.ID_company_access) AS TotalRows
                    FROM \`companyaccess\` c  
                    WHERE IFNULL(c.isdeleted,0) = 0  
                    AND c.company = ${company}               
                    AND c.contactProfileID = ${userid}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            c.*
                            FROM \`companyaccess\` c  
                            WHERE IFNULL(c.isdeleted,0) = 0  
                            AND c.company = ${company}               
                            AND c.contactProfileID = ${userid}             
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },    
    getCompanyAccess: function (callback) {
        return db.query("SELECT * FROM \`companyaccess\` WHERE IFNULL(\`isdeleted\`,0) = 0 ", callback);
    },
    getCompanyAccessById: function (id, callback) {
        return db.query("SELECT * FROM companyaccess WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_company_access`=?", [id], callback);
    },
    getCompanyAccessByProfileId: function (profileid, callback) {
        return db.query(`SELECT ca.ID_company_access, ca.contactProfileID, ca.company, c.name AS company_name 
                            FROM companyaccess ca INNER JOIN company c ON ca.company = c.ID_company AND IFNULL(c.isdeleted,0) = 0 
                            WHERE IFNULL(ca.isdeleted,0) = 0  
                            AND ca.contactProfileID = ? 
                            ORDER BY ca.ID_company_access`, 
                    [
                        profileid
                    ], callback);
    },
    addCompanyAccess: function (CompanyAccess, callback) {
        return db.query(`INSERT INTO \`companyaccess\`
                            (
                                \`contactProfileID\`,
                                \`company\`                                
                            ) 
                            VALUES(?,?)
                        `,
            [
                CompanyAccess.contactProfileID,
                CompanyAccess.company                
            ], callback);
    },
    deleteCompanyAccess: function (id, callback) {        
        return db.query("UPDATE \`companyaccess\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0 AND `ID_company_access`=? ", [id], callback);
    },
    updateCompanyAccess: function (id, CompanyAccess, callback) {
        return db.query(`UPDATE \`companyaccess\` SET 
                                \`contactProfileID\` = ?,
                                \`company\` = ?                                
                            WHERE \`ID_company_access\` = ? 
                        `,
            [
                CompanyAccess.contactProfileID,
                CompanyAccess.company,      
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_company_access, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "companyaccess.ID_company_access" + "'," + ID_company_access + " , " + ID_company_access + ", " + ID_company_access + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("companyaccess." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_company_access + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "companyaccess.ID_company_access" + "'," + ID_company_access + " , " + ID_company_access + "," + ID_company_access + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`companyaccess\` WHERE IFNULL(\`isdeleted\`,0) = 0  ORDER BY ID_company_access LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    companyaccessCRUD: function (body, callback) {
        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {            
            for (let i = 0; i < body.add.length; i++) {
                let CompanyAccess = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`companyaccess\`
                            (
                                \`contactProfileID\`,
                                \`company\`
                            ) 
                            VALUES(?,?)
                        `,
                        [
                            CompanyAccess.contactProfileID,
                            CompanyAccess.company                            
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
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "companyaccess.ID_company_access" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

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
                let ID_company_access = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`companyaccess\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_company_access`=? ", [ID_company_access],
                        function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "companyaccess.ID_company_access" + "'," + ID_company_access + ", " + ID_company_access + ", " + ID_company_access + ")";

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
                let CompanyAccess = body.update.new[i];
                let OldCompanyAccess = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`companyaccess\` SET 
                                \`contactProfileID\` = ?,
                                \`company\` = ?                                
                            WHERE \`ID_company_access\` = ? 
                        `,
                        [
                            CompanyAccess.contactProfileID,
                            CompanyAccess.company,                            
                            CompanyAccess.ID_company_access
                        ], function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(CompanyAccess);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldCompanyAccess[field] != CompanyAccess[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("companyaccess." + field) + "', '" + OldCompanyAccess[field] + "', '" + CompanyAccess[field] + "'," + CompanyAccess.ID_company_access + "),";
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

module.exports = CompanyAccess;