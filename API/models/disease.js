const db = require('../config/dbconnection');

let Disease = {
    getAllDiseases: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_disease";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`disease\` d
                    WHERE IFNULL(d.isdeleted,0) = 0
                    AND d.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            d.* 
                            FROM \`disease\` d
                            WHERE IFNULL(d.isdeleted,0) = 0
                            AND d.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getDiseases: function (callback) {
        return db.query("SELECT * FROM \`disease\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getDiseaseById: function (id, callback) {
        return db.query("SELECT * FROM \`disease\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_disease`=?", [id], callback);
    },
    addDisease: function (Disease, callback) {
        return db.query(`INSERT INTO \`disease\`
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
                Disease.name,
                Disease.description,
                Disease.type,
                Disease.severity,
                Disease.spread,
                Disease.symptoms,
                Disease.prevention,
                Disease.remedy,
                Disease.company
            ], callback);
    },
    deleteDisease: function (id, callback) {
        return db.query("UPDATE \`disease\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_disease`=? ", [id], callback);
    },
    updateDisease: function (id, Disease, callback) {
        return db.query(`UPDATE \`disease\` SET 
                                \`name\` = ?,
                                \`description\` = ?,
                                \`type\` = ?,
                                \`severity\` = ?,
                                \`spread\` = ?,
                                \`symptoms\` = ?,
                                \`prevention\` = ?,
                                \`remedy\` = ?
                            WHERE \`ID_disease\` = ? 
                        `,
            [
                Disease.name,
                Disease.description,
                Disease.type,
                Disease.severity,
                Disease.spread,
                Disease.symptoms,
                Disease.prevention,
                Disease.remedy,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_disease, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "disease.ID_disease" + "'," + ID_disease + " , " + ID_disease + ", " + ID_disease +")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("disease." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_disease + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "disease.ID_disease" + "'," + ID_disease + " , " + ID_disease + ", " + ID_disease + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`disease\` ORDER BY ID_disease LIMIT 1;`;
        }
        
        return db.query(queries, callback);
    }
}

module.exports = Disease;