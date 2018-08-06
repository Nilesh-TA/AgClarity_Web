const db = require('../config/dbconnection');

let WaterSource = {
    getAllWaterSources: function (company, pageNo, pageSize, callback) {

        let sortBy = "ID_watersource";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`watersource\` w
                    WHERE IFNULL(w.isdeleted,0) = 0
                    AND w.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            w.*,
                            (SELECT (CASE WHEN IFNULL(l.description,' ') <> ' ' THEN CONCAT(l.name, ', ', l.description) ELSE l.name END) 
                                FROM \`watersourcelocation\` wl INNER JOIN location l ON wl.location = l.ID_location AND IFNULL(l.isdeleted,0) = 0 
                                WHERE IFNULL(wl.isdeleted,0) = 0 AND wl.watersource = w.ID_watersource 
                                ORDER BY wl.ID_watersource_location LIMIT 1
                            ) AS locations 
                            FROM \`watersource\` w
                            WHERE IFNULL(w.isdeleted,0) = 0
                            AND w.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getWaterSources: function (callback) {
        return db.query("SELECT * FROM \`watersource\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getWaterSourceById: function (id, callback) {
        return db.query("SELECT * FROM \`watersource\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_watersource`=?", [id], callback);
    },
    addWaterSource: function (WaterSource, callback) {
        return db.query(`INSERT INTO \`watersource\`
                            (
                                \`name\`,
                                \`type\`,
                                \`description\`,
                                \`volume_rating\`,
                                \`min_depth\`,
                                \`max_depth\`,
                                \`company\`                                
                            ) 
                            VALUES(?,?,?,?,?,?,?)
                        `,
            [
                WaterSource.name,
                WaterSource.type,
                WaterSource.description,
                WaterSource.volume_rating,
                WaterSource.min_depth,
                WaterSource.max_depth,
                WaterSource.company
            ], callback);
    },
    deleteWaterSource: function (id, callback) {
        return db.query(` 
                    UPDATE \`watersource\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND \`ID_watersource\` = ?;
                    UPDATE \`watersourcelocation\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND \`watersource\` = ?;
                `, [
                        id,
                        id
                    ], callback);
    },
    updateWaterSource: function (id, WaterSource, callback) {
        return db.query(`UPDATE \`watersource\` SET 
                                \`name\` = ?,
                                \`type\` = ?,
                                \`description\` = ?,
                                \`volume_rating\` = ?,
                                \`min_depth\` = ?,
                                \`max_depth\` = ?
                            WHERE \`ID_watersource\` = ? 
                        `,
            [
                WaterSource.name,
                WaterSource.type,
                WaterSource.description,
                WaterSource.volume_rating,
                WaterSource.min_depth,
                WaterSource.max_depth,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_watersource, OldWaterSource, NewWaterSource, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(NewWaterSource);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "watersource.ID_watersource" + "'," + ID_watersource + " , " + ID_watersource + ", " + ID_watersource + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (OldWaterSource[field] != NewWaterSource[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("watersource." + field) + "', '" + OldWaterSource[field] + "', '" + NewWaterSource[field] + "'," + ID_watersource + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "watersource.ID_watersource" + "'," + ID_watersource + " , " + ID_watersource + ", " + ID_watersource + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`watersource\` ORDER BY ID_watersource LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = WaterSource;