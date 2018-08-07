const db = require('../config/dbconnection');

let Dictionary = {
    getAllData: function (pageNo, pageSize, callback) {

        let sortBy = "ID_dictionary";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows 
                    FROM dictionary d 
                    WHERE IFNULL(\`isdeleted\`,0) = 0 
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            d.* 
                            FROM dictionary d 
                            WHERE IFNULL(\`isdeleted\`,0) = 0 
                            ORDER BY ${sortBy} ${SortOrder} 
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });

    },
    getDictionaryByCode: function (code, callback) {
        return db.query(`SELECT * 
                            FROM dictionary 
                            WHERE \`code\` = ?  
                            AND IFNULL(\`isdeleted\`,0) = 0 
                            ORDER BY \`value\`
                        `, [code], callback);
    },
    getContactSource: function (callback) {
        return db.query(`SELECT * 
                            FROM dictionary 
                            WHERE \`code\` = 'ContactSource'  
                            AND IFNULL(\`isdeleted\`,0) = 0 
                            ORDER BY \`description\` 
                        `, callback);
    },
    getDictionaryById: function (id, callback) {
        return db.query(`SELECT * 
                            FROM dictionary  
                            WHERE \`ID_dictionary\` = ? 
                            AND IFNULL(\`isdeleted\`,0) = 0 
                            ORDER BY \`value\`
                        `, [id], callback);
    },
    addDictionary: function (Dictionary, callback) {
        return db.query(`INSERT INTO \`dictionary\`
                            (
                                \`code\`,
                                \`value\`,
                                \`description\`
                            ) 
                            VALUES(?,?,?)
                        `,
            [
                Dictionary.code,
                Dictionary.value,
                Dictionary.description
            ], callback);
    },
    deleteDictionary: function (id, callback) {
        return db.query("UPDATE \`dictionary\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_dictionary` = ?", [id], callback);
    },
    updateDictionary: function (id, Dictionary, callback) {
        return db.query(`UPDATE \`dictionary\` SET 
                                \`code\` = ?,
                                \`value\` = ?,
                                \`description\` = ?
                            WHERE \`ID_dictionary\` = ? 
                        `,
            [
                Dictionary.code,
                Dictionary.value,
                Dictionary.description,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_dictionary, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "dictionary.ID_dictionary" + "'," + ID_dictionary + " , " + ID_dictionary + ", " + ID_dictionary + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("dictionary." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_dictionary + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "dictionary.ID_dictionary" + "'," + ID_dictionary + " , " + ID_dictionary + "," + ID_dictionary + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`dictionary\` WHERE IFNULL(\`isdeleted\`,0) = 0  ORDER BY ID_dictionary LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
}

module.exports = Dictionary;