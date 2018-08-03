const db = require('../config/dbconnection');

let IrrigationLocation = {
    getAllIrrigationLocation: function (irrigation, location,  pageNo, pageSize, callback) {

        let sortBy = "ID_irrigation_location";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(DISTINCT il.ID_irrigation_location) AS TotalRows
                    FROM \`irrigationlocation\` il  
                    WHERE IFNULL(il.isdeleted,0) = 0  
                    AND il.irrigation = ${irrigation}               
                    AND il.location = ${location}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            il.*
                            FROM \`irrigationlocation\` il  
                            WHERE IFNULL(il.isdeleted,0) = 0  
                            AND il.irrigation = ${irrigation}               
                            AND il.location = ${location}            
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },    
    getIrrigationLocation: function (callback) {
        return db.query("SELECT * FROM \`irrigationlocation\` WHERE IFNULL(\`isdeleted\`,0) = 0 ", callback);
    },
    getIrrigationLocationById: function (id, callback) {
        return db.query("SELECT * FROM irrigationlocation WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_irrigation_location`=?", [id], callback);
    },
    getIrrigationLocationByIrrigationId: function (irrigationid, callback) {
        return db.query(`SELECT il.ID_irrigation_location, il.irrigation, il.location, (CASE WHEN IFNULL(description,' ') <> ' ' THEN CONCAT(name, ', ', description) ELSE name END) AS location_name 
                            FROM irrigationlocation il INNER JOIN location l ON il.location = l.ID_location AND IFNULL(l.isdeleted,0) = 0 
                            WHERE IFNULL(il.isdeleted,0) = 0  
                            AND il.irrigation = ? 
                            ORDER BY il.ID_irrigation_location`, 
                    [
                        irrigationid
                    ], callback);
    },
    addIrrigationLocation: function (IrrigationLocation, callback) {
        return db.query(`INSERT INTO \`irrigationlocation\`
                            (
                                \`irrigation\`,
                                \`location\`                                
                            ) 
                            VALUES(?,?)
                        `,
            [
                IrrigationLocation.irrigation,
                IrrigationLocation.location                
            ], callback);
    },
    deleteIrrigationLocation: function (id, callback) {        
        return db.query("UPDATE \`irrigationlocation\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0 AND `ID_irrigation_location`=? ", [id], callback);
    },
    updateIrrigationLocation: function (id, IrrigationLocation, callback) {
        return db.query(`UPDATE \`irrigationlocation\` SET 
                                \`irrigation\` = ?,
                                \`location\` = ?                                
                            WHERE \`ID_irrigation_location\` = ? 
                        `,
            [
                IrrigationLocation.irrigation,
                IrrigationLocation.location,      
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_irrigation_location, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "irrigationlocation.ID_irrigation_location" + "'," + ID_irrigation_location + " , " + ID_irrigation_location + ", " + ID_irrigation_location + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("irrigationlocation." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_irrigation_location + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "irrigationlocation.ID_irrigation_location" + "'," + ID_irrigation_location + " , " + ID_irrigation_location + "," + ID_irrigation_location + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`irrigationlocation\` WHERE IFNULL(\`isdeleted\`,0) = 0  ORDER BY ID_irrigation_location LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    irrigationlocationCRUD: function (body, callback) {
        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {            
            for (let i = 0; i < body.add.length; i++) {
                let IrrigationLocation = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`irrigationlocation\`
                            (
                                \`irrigation\`,
                                \`location\`
                            ) 
                            VALUES(?,?)
                        `,
                        [
                            IrrigationLocation.irrigation,
                            IrrigationLocation.location                            
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
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "irrigationlocation.ID_irrigation_location" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

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
                let ID_irrigation_location = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`irrigationlocation\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_irrigation_location`=? ", [ID_irrigation_location],
                        function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "irrigationlocation.ID_irrigation_location" + "'," + ID_irrigation_location + ", " + ID_irrigation_location + ", " + ID_irrigation_location + ")";

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
                let IrrigationLocation = body.update.new[i];
                let OldIrrigationLocation = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`irrigationlocation\` SET 
                                \`irrigation\` = ?,
                                \`location\` = ?                                
                            WHERE \`ID_irrigation_location\` = ? 
                        `,
                        [
                            IrrigationLocation.irrigation,
                            IrrigationLocation.location,                            
                            IrrigationLocation.ID_irrigation_location
                        ], function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(IrrigationLocation);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldIrrigationLocation[field] != IrrigationLocation[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("irrigationlocation." + field) + "', '" + OldIrrigationLocation[field] + "', '" + IrrigationLocation[field] + "'," + IrrigationLocation.ID_irrigation_location + "),";
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

module.exports = IrrigationLocation;