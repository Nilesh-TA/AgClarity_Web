const db = require('../config/dbconnection');

let Pest = {
    getAllPests: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_pest";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`pest\` p
                    WHERE IFNULL(p.isdeleted,0) = 0
                    AND p.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            p.* 
                            FROM \`pest\` p
                            WHERE IFNULL(p.isdeleted,0) = 0
                            AND p.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getPests: function (callback) {
        return db.query("SELECT * FROM \`pest\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getPestById: function (id, callback) {
        return db.query("SELECT * FROM \`pest\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_pest`=?", [id], callback);
    },
    addPest: function (Pest, callback) {
        return db.query(`INSERT INTO \`pest\`
                            (
                                \`name\`,
                                \`description\`,
                                \`type\`,
                                \`severity\`,
                                \`spread\`,
                                \`symptoms\`,
                                \`prevention\`,
                                \`remedy\`,
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?,?,?,?)
                        `,
            [
                Pest.name,
                Pest.description,
                Pest.type,
                Pest.severity,
                Pest.spread,
                Pest.symptoms,
                Pest.prevention,
                Pest.remedy,
                Pest.company
            ], callback);
    },
    deletePest: function (id, callback) {
        return db.query("UPDATE \`pest\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_pest`=? ", [id], callback);
    },
    updatePest: function (id, Pest, callback) {
        return db.query(`UPDATE \`pest\` SET 
                                \`name\` = ?,
                                \`description\` = ?,
                                \`type\` = ?,
                                \`severity\` = ?,
                                \`spread\` = ?,
                                \`symptoms\` = ?,
                                \`prevention\` = ?,
                                \`remedy\` = ?
                            WHERE \`ID_pest\` = ? 
                        `,
            [
                Pest.name,
                Pest.description,
                Pest.type,
                Pest.severity,
                Pest.spread,
                Pest.symptoms,
                Pest.prevention,
                Pest.remedy,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_pest, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "pest.ID_pest" + "'," + ID_pest + " , " + ID_pest + ", " + ID_pest + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("pest." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_pest + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "pest.ID_pest" + "'," + ID_pest + " , " + ID_pest + "," + ID_pest + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`pest\` ORDER BY ID_pest LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Pest;