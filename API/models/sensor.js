const db = require('../config/dbconnection');

let Sensor = {
    getAllSensors: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_sensor";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`sensor\` s
                    WHERE IFNULL(s.isdeleted,0) = 0
                    AND s.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            s.* 
                            FROM \`sensor\` s
                            WHERE IFNULL(s.isdeleted,0) = 0
                            AND s.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });
    },
    getSensors: function (callback) {
        return db.query("SELECT * FROM \`sensor\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getSensorById: function (id, callback) {
        return db.query("SELECT * FROM \`sensor\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_sensor`=?", [id], callback);
    },
    addSensor: function (Sensor, callback) {
        return db.query(`INSERT INTO \`sensor\`
                            (
                                \`sensorid\`,
                                \`name\`,
                                \`type\`,
                                \`manufacturer\`,
                                \`model\`,
                                \`version\`,                                                               
                                \`description\`,                                
                                \`mac_address\`,
                                \`chipset\`,
                                \`status\`,
                                \`first_install_date\`,
                                \`last_install_date\`,
                                \`calibration_date\`,
                                \`last_service_date\`,
                                \`battery_install_date\`,
                                \`sensor_set_point\`,
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `,
            [
                Sensor.sensorid,
                Sensor.name,
                Sensor.type,
                Sensor.manufacturer,
                Sensor.model,
                Sensor.version,                
                Sensor.description,                
                Sensor.mac_address,                
                Sensor.chipset,
                Sensor.status,
                Sensor.first_install_date,
                Sensor.last_install_date,
                Sensor.calibration_date,
                Sensor.last_service_date,
                Sensor.battery_install_date,
                Sensor.sensor_set_point,
                Sensor.company
            ], callback);
    },
    deleteSensor: function (id, callback) {
        return db.query("UPDATE \`sensor\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_sensor`=? ", [id], callback);
    },
    updateSensor: function (id, Sensor, callback) {
        return db.query(`UPDATE \`sensor\` SET 
                                \`sensorid\` = ?,
                                \`name\` = ?,
                                \`type\` = ?,
                                \`manufacturer\` = ?,
                                \`model\` = ?,
                                \`version\` = ?,                                
                                \`description\` = ?,
                                \`mac_address\` = ?,
                                \`chipset\` = ?,
                                \`status\` = ?,
                                \`first_install_date\` = ?,
                                \`last_install_date\` = ?,
                                \`calibration_date\` = ?,
                                \`last_service_date\` = ?,
                                \`battery_install_date\` = ?,
                                \`sensor_set_point\` = ?                                
                            WHERE \`ID_sensor\` = ? 
                        `,
            [
                Sensor.sensorid,
                Sensor.name,
                Sensor.type,
                Sensor.manufacturer,
                Sensor.model,
                Sensor.version,                 
                Sensor.description,                
                Sensor.mac_address,                
                Sensor.chipset,
                Sensor.status,
                Sensor.first_install_date,
                Sensor.last_install_date,
                Sensor.calibration_date,
                Sensor.last_service_date,
                Sensor.battery_install_date,
                Sensor.sensor_set_point,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_sensor, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "sensor.ID_sensor" + "'," + ID_sensor + " , " + ID_sensor + ", " + ID_sensor + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("sensor." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_sensor + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "sensor.ID_sensor" + "'," + ID_sensor + " , " + ID_sensor + "," + ID_sensor + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`sensor\` ORDER BY ID_sensor LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Sensor;