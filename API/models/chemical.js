const db = require('../config/dbconnection');

let Chemical = {
    getAllChemicals: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_chemical";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM chemical c
                    WHERE IFNULL(c.isdeleted,0) = 0
                    AND c.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            c.* 
                            FROM chemical c
                            WHERE IFNULL(c.isdeleted,0) = 0
                            AND c.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getChemicals: function (callback) {
        return db.query("SELECT * FROM chemical WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getChemicalById: function (id, callback) {
        return db.query("SELECT * FROM chemical WHERE IFNULL(isdeleted,0) = 0 AND `ID_chemical`=?", [id], callback);
    },
    addChemical: function (Chemical, callback) {
        return db.query(`INSERT INTO chemical
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
                Chemical.name,
                Chemical.description,
                Chemical.type,
                Chemical.severity,
                Chemical.spread,
                Chemical.symptoms,
                Chemical.prevention,
                Chemical.remedy,
                Chemical.company
            ], callback);
    },
    deleteChemical: function (id, callback) {
        return db.query("UPDATE chemical SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_chemical`=? ", [id], callback);
    },
    updateChemical: function (id, Chemical, callback) {
        return db.query(`UPDATE chemical SET 
                                \`name\` = ?,
                                \`description\` = ?,
                                \`type\` = ?,
                                \`severity\` = ?,
                                \`spread\` = ?,
                                \`symptoms\` = ?,
                                \`prevention\` = ?,
                                \`remedy\` = ?
                            WHERE \`ID_chemical\` = ? 
                        `,
            [
                Chemical.name,
                Chemical.description,
                Chemical.type,
                Chemical.severity,
                Chemical.spread,
                Chemical.symptoms,
                Chemical.prevention,
                Chemical.remedy,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_chemical, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "chemical.ID_chemical" + "'," + ID_chemical + ", " + ID_chemical + ", " + ID_chemical + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("chemical." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_chemical  + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "chemical.ID_chemical" + "'," + ID_chemical + " , " + ID_chemical + "," + ID_chemical + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`chemical\` ORDER BY ID_chemical LIMIT 1;`;
        }

        return db.query(queries, callback);
    }

}

module.exports = Chemical;