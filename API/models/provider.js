const db = require('../config/dbconnection');

let Provider = {
    getAllProviders: function (company, pageNo, pageSize, callback) {

        let sortBy = "ID_provider";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows 
                    FROM \`provider\` p 
                    WHERE IFNULL(p.isdeleted,0) = 0  
                    AND p.company = ${company} 
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows, 
                            p.*, IFNULL(p1.name,'') AS \`related_to_name\`, a.address_1 AS \`address\`, a.city, a.state, a.country 
                            FROM \`provider\` p 
                                LEFT JOIN location l ON p.locationID = l.ID_location AND IFNULL(l.isdeleted,0) = 0 
                                LEFT JOIN address a ON p.addressID = a.ID_address AND IFNULL(a.isdeleted,0) = 0	
                                LEFT JOIN provider p1 ON p.related_to = p1.ID_provider AND IFNULL(p1.isdeleted,0) = 0 
                            WHERE IFNULL(p.isdeleted,0) = 0 
                            AND p.company = ${company} 
                            ORDER BY ${sortBy} ${SortOrder} 
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize} 
                        `, callback);

            });


    },
    getProviders: function (callback) {
        return db.query("SELECT * FROM \`provider\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `ID_provider` ", callback);
    },
    getProvidersByCompany: function (company, id, callback) {
        if (id != null && id != undefined && id != "" && id != "0") {
            return db.query("SELECT * FROM \`provider\` WHERE IFNULL(isdeleted,0) = 0 AND IFNULL(company, 0) = ? AND `ID_provider` != ? ORDER BY `name` ", [company, id], callback);
        } else {
            return db.query("SELECT * FROM \`provider\` WHERE IFNULL(isdeleted,0) = 0 AND IFNULL(company, 0) = ? ORDER BY `name` ", [company], callback);
        }
    },
    getProviderById: function (id, callback) {
        return db.query("SELECT * FROM \`provider\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_provider`=?", [id], callback);
    },
    addProvider: function (Provider, callback) {
        return db.query(`INSERT INTO \`provider\`
                            (
                                \`name\`,
                                \`metric_imperial\`,
                                \`locationID\`,
                                \`addressID\`,
                                \`related_to\`,
                                \`type\`,                                
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?,?)
                        `,
            [
                Provider.name,
                Provider.metric_imperial,
                Provider.locationID,
                Provider.addressID,
                Provider.related_to,
                Provider.type,
                Provider.company
            ], callback);
    },
    deleteProvider: function (id, callback) {
        return db.query("UPDATE \`provider\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_provider`=? ", [id], callback);
    },
    updateProvider: function (id, Provider, callback) {
        return db.query(`UPDATE \`provider\` SET 
                                \`name\` = ?,
                                \`metric_imperial\` = ?,
                                \`locationID\` = ?,
                                \`addressID\` = ?,
                                \`related_to\` = ?,
                                \`type\` = ?
                            WHERE \`ID_provider\` = ? 
                        `,
            [
                Provider.name,
                Provider.metric_imperial,
                Provider.locationID,
                Provider.addressID,
                Provider.related_to,
                Provider.type,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_provider, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "provider.ID_provider" + "'," + ID_provider + " , " + ID_provider + ", " + ID_provider + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("provider." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_provider + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "provider.ID_provider" + "'," + ID_provider + " , " + ID_provider + "," + ID_provider + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`provider\` ORDER BY ID_provider LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Provider;