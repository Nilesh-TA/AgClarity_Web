const db = require('../config/dbconnection');

let WatersourceLocation = {
    getAllWatersourceLocation: function (watersource, location,  pageNo, pageSize, callback) {

        let sortBy = "ID_watersource_location";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(DISTINCT wl.ID_watersource_location) AS TotalRows
                    FROM \`watersourcelocation\` wl  
                    WHERE IFNULL(wl.isdeleted,0) = 0  
                    AND wl.watersource = ${watersource}               
                    AND wl.location = ${location}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            wl.*
                            FROM \`watersourcelocation\` wl  
                            WHERE IFNULL(wl.isdeleted,0) = 0  
                            AND wl.watersource = ${watersource}               
                            AND wl.location = ${location}            
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },    
    getWatersourceLocation: function (callback) {
        return db.query("SELECT * FROM \`watersourcelocation\` WHERE IFNULL(\`isdeleted\`,0) = 0 ", callback);
    },
    getWatersourceLocationById: function (id, callback) {
        return db.query("SELECT * FROM watersourcelocation WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_watersource_location`=?", [id], callback);
    },
    getWatersourceLocationByWaterSourceId: function (watersourceid, callback) {
        return db.query(`SELECT wl.ID_watersource_location, wl.watersource, wl.location, (CASE WHEN IFNULL(description,' ') <> ' ' THEN CONCAT(name, ', ', description) ELSE name END) AS location_name 
                            FROM watersourcelocation wl INNER JOIN location l ON wl.location = l.ID_location AND IFNULL(l.isdeleted,0) = 0 
                            WHERE IFNULL(wl.isdeleted,0) = 0  
                            AND wl.watersource = ? 
                            ORDER BY wl.ID_watersource_location`, 
                    [
                        watersourceid
                    ], callback);
    },
    addWatersourceLocation: function (WatersourceLocation, callback) {
        return db.query(`INSERT INTO \`watersourcelocation\`
                            (
                                \`watersource\`,
                                \`location\`                                
                            ) 
                            VALUES(?,?)
                        `,
            [
                WatersourceLocation.watersource,
                WatersourceLocation.location                
            ], callback);
    },
    deleteWatersourceLocation: function (id, callback) {        
        return db.query("UPDATE \`watersourcelocation\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0 AND `ID_watersource_location`=? ", [id], callback);
    },
    updateWatersourceLocation: function (id, WatersourceLocation, callback) {
        return db.query(`UPDATE \`watersourcelocation\` SET 
                                \`watersource\` = ?,
                                \`location\` = ?                                
                            WHERE \`ID_watersource_location\` = ? 
                        `,
            [
                WatersourceLocation.watersource,
                WatersourceLocation.location,      
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_watersource_location, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "watersourcelocation.ID_watersource_location" + "'," + ID_watersource_location + " , " + ID_watersource_location + ", " + ID_watersource_location + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("watersourcelocation." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_watersource_location + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "watersourcelocation.ID_watersource_location" + "'," + ID_watersource_location + " , " + ID_watersource_location + "," + ID_watersource_location + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`watersourcelocation\` WHERE IFNULL(\`isdeleted\`,0) = 0  ORDER BY ID_watersource_location LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    watersourcelocationCRUD: function (body, callback) {
        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {            
            for (let i = 0; i < body.add.length; i++) {
                let WatersourceLocation = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`watersourcelocation\`
                            (
                                \`watersource\`,
                                \`location\`
                            ) 
                            VALUES(?,?)
                        `,
                        [
                            WatersourceLocation.watersource,
                            WatersourceLocation.location                            
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
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "watersourcelocation.ID_watersource_location" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

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
                let ID_watersource_location = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`watersourcelocation\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_watersource_location`=? ", [ID_watersource_location],
                        function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "watersourcelocation.ID_watersource_location" + "'," + ID_watersource_location + ", " + ID_watersource_location + ", " + ID_watersource_location + ")";

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
                let WatersourceLocation = body.update.new[i];
                let OldWatersourceLocation = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`watersourcelocation\` SET 
                                \`watersource\` = ?,
                                \`location\` = ?                                
                            WHERE \`ID_watersource_location\` = ? 
                        `,
                        [
                            WatersourceLocation.watersource,
                            WatersourceLocation.location,                            
                            WatersourceLocation.ID_watersource_location
                        ], function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(WatersourceLocation);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldWatersourceLocation[field] != WatersourceLocation[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("watersourcelocation." + field) + "', '" + OldWatersourceLocation[field] + "', '" + WatersourceLocation[field] + "'," + WatersourceLocation.ID_watersource_location + "),";
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

module.exports = WatersourceLocation;