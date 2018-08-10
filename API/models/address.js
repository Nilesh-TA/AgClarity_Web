const db = require('../config/dbconnection');

let Address = {
    getAllAddresses: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_address";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`address\` a
                    WHERE IFNULL(a.isdeleted,0) = 0
                    AND a.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            a.* 
                            FROM \`address\` a
                            WHERE IFNULL(a.isdeleted,0) = 0
                            AND a.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getAddresses: function (callback) {
        return db.query("SELECT * FROM \`address\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `ID_address` ", callback);
    },
    getAddressById: function (id, callback) {
        return db.query("SELECT * FROM \`address\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_address`=?", [id], callback);
    },
    getAddressByCompany: function (company, callback) {
        return db.query("SELECT * FROM \`address\` WHERE IFNULL(isdeleted,0) = 0 AND IFNULL(company, 0) = ? ORDER BY `ID_address` ", [company], callback);
    },
    addAddress: function (Address, callback) {
        return db.query(`INSERT INTO \`address\`
                            (
                                \`address_1\`,
                                \`address_2\`,
                                \`city\`,
                                \`state\`,
                                \`postal_code\`,
                                \`country\`,                                
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?,?)
                        `,
            [
                Address.address_1,
                Address.address_2,
                Address.city,
                Address.state,
                Address.postal_code,
                Address.country,
                Address.company
            ], callback);
    },
    deleteAddress: function (id, callback) {
        return db.query("UPDATE \`address\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_address`=? ", [id], callback);
    },
    updateAddress: function (id, Address, callback) {
        return db.query(`UPDATE \`address\` SET 
                                \`address_1\` = ?,
                                \`address_2\` = ?,
                                \`city\` = ?,
                                \`state\` = ?,
                                \`postal_code\` = ?,
                                \`country\` = ?
                            WHERE \`ID_address\` = ? 
                        `,
            [
                Address.address_1,
                Address.address_2,
                Address.city,
                Address.state,
                Address.postal_code,
                Address.country,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_address, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "address.ID_address" + "'," + ID_address + " , " + ID_address + ", " + ID_address + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("address." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_address + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "address.ID_address" + "'," + ID_address + " , " + ID_address + "," + ID_address + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`address\` ORDER BY ID_address LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Address;