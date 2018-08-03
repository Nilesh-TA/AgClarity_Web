const db = require('../config/dbconnection');

let Irrigation = {
    getAllIrrigations: function (company, pageNo, pageSize, callback) {

        let sortBy = "ID_irrigation";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`irrigation\` i
                    WHERE IFNULL(i.isdeleted,0) = 0
                    AND i.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            i.*,
                            (SELECT (CASE WHEN IFNULL(l.description,' ') <> ' ' THEN CONCAT(l.name, ', ', l.description) ELSE l.name END) 
                                FROM \`irrigationlocation\` il INNER JOIN location l ON il.location = l.ID_location AND IFNULL(l.isdeleted,0) = 0 
                                WHERE IFNULL(il.isdeleted,0) = 0 AND il.irrigation = i.ID_irrigation 
                                ORDER BY il.ID_irrigation_location LIMIT 1
                            ) AS locations 
                            FROM \`irrigation\` i
                            WHERE IFNULL(i.isdeleted,0) = 0
                            AND i.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getIrrigations: function (callback) {
        return db.query("SELECT * FROM \`irrigation\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getIrrigationById: function (id, callback) {
        return db.query("SELECT * FROM \`irrigation\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_irrigation`=?", [id], callback);
    },
    addIrrigation: function (Irrigation, callback) {
        return db.query(`INSERT INTO \`irrigation\`
                            (
                                \`name\`,
                                \`type\`,
                                \`description\`,
                                \`volume_rating\`,                                                         
                                \`company\`                                
                            ) 
                            VALUES(?,?,?,?,?)
                        `,
            [
                Irrigation.name,
                Irrigation.type,
                Irrigation.description,
                Irrigation.volume_rating,
                Irrigation.company
            ], callback);
    },
    deleteIrrigation: function (id, callback) {
        return db.query(` 
                    UPDATE \`irrigation\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND \`ID_irrigation\` = ?;
                    UPDATE \`irrigationlocation\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND \`irrigation\` = ?;
                `, [
                        id,
                        id
                    ], callback);
    },
    updateIrrigation: function (id, Irrigation, callback) {
        return db.query(`UPDATE \`irrigation\` SET 
                                \`name\` = ?,
                                \`type\` = ?,
                                \`description\` = ?,                                
                                \`volume_rating\` = ?                                
                            WHERE \`ID_irrigation\` = ? 
                        `,
            [
                Irrigation.name,
                Irrigation.type,
                Irrigation.description,
                Irrigation.volume_rating,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_irrigation, OldIrrigation, NewIrrigation, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(NewIrrigation);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "irrigation.ID_irrigation" + "'," + ID_irrigation + " , " + ID_irrigation + ", " + ID_irrigation + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (OldIrrigation[field] != NewIrrigation[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("irrigation." + field) + "', '" + OldIrrigation[field] + "', '" + NewIrrigation[field] + "'," + ID_irrigation + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "irrigation.ID_irrigation" + "'," + ID_irrigation + " , " + ID_irrigation + ", " + ID_irrigation + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`irrigation\` ORDER BY ID_irrigation LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Irrigation;
