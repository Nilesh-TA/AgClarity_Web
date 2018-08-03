const db = require('../config/dbconnection');

let Company = {
    getAllCompanies: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)
        let sortBy = "ID_company";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`company\` c1
                    LEFT JOIN \`company\` r1 ON r1.ID_company = c1.related_to 
                    AND IFNULL(r1.\`isdeleted\`,0) = 0
                    WHERE IFNULL(c1.\`isdeleted\`,0) = 0
                    AND (c1.ID_company = ${company} OR r1.ID_company = ${company})
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            c1.*, IFNULL(r1.\`name\`,'') AS  relatedcompanyname,
                            (
                                SELECT (CASE WHEN COUNT(*) > 0 THEN true ELSE false END) 
                                    FROM company c3 
                                    WHERE c3.\`related_to\` = c1.\`ID_company\`
                            ) AS IsRelatedWithOtherCompany
                            FROM \`company\` c1
                            LEFT JOIN \`company\` r1 ON r1.\`ID_company\` = c1.\`related_to\`
                            AND IFNULL(r1.\`isdeleted\`,0) = 0
                            WHERE IFNULL(c1.\`isdeleted\`,0) = 0
                            AND (c1.ID_company = ${company} OR r1.ID_company = ${company})
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getCompanies: function (callback) {
        return db.query("SELECT * FROM \`company\` WHERE IFNULL(\`isdeleted\`,0) = 0 ORDER BY `name` ", callback);
    },
    getCompanyById: function (id, callback) {
        return db.query("SELECT * FROM \`company\` WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_company`=?", [id], callback);
    },
    addCompany: function (Company, callback) {
        return db.query(`INSERT INTO \`company\`
                            (
                                \`name\`,
                                \`metric_imperial\`,
                                \`currency\`,
                                \`dunsnumber\`,
                                \`related_to\`,
                                \`rank\`,
                                \`address_1\`,
                                \`address_2\`,
                                \`city\`,
                                \`state\`,
                                \`postal_code\`,
                                \`country\`,
                                \`water_saved\`
                            ) 
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `,
            [
                Company.name,
                Company.metric_imperial,
                Company.currency,
                Company.dunsnumber,
                Company.related_to,
                Company.rank,
                Company.address_1,
                Company.address_2,
                Company.city,
                Company.state,
                Company.postal_code,
                Company.country,
                Company.water_saved
            ], callback);
    },
    deleteCompany: function (id, callback) {
        return db.query("UPDATE \`company\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0 AND `ID_company`=? ", [id], callback);
    },
    updateCompany: function (id, Company, callback) {
        return db.query(`UPDATE \`company\` SET 
                                \`name\` = ?,
                                \`metric_imperial\` = ?,
                                \`currency\` = ?,
                                \`dunsnumber\` = ?,
                                \`related_to\` = ?,
                                \`rank\` = ?,
                                \`address_1\` = ?,
                                \`address_2\` = ?,
                                \`city\` = ?,
                                \`state\` = ?,
                                \`postal_code\` = ?,
                                \`country\` = ?,
                                \`water_saved\` = ?
                            WHERE \`ID_company\` = ? 
                        `,
            [
                Company.name,
                Company.metric_imperial,
                Company.currency,
                Company.dunsnumber,
                Company.related_to,
                Company.rank,
                Company.address_1,
                Company.address_2,
                Company.city,
                Company.state,
                Company.postal_code,
                Company.country,
                Company.water_saved,
                id
            ], callback);
    },
    getCompanyByContactProfileId: function (id, callback) {
        return db.query(`SELECT c.*,ca.ID_company_access,ca.contactProfileID,ca.company 
                            FROM \`company\` c 
                                INNER JOIN \`companyaccess\` ca ON c.\`ID_company\` = ca.\`company\` 
                                    AND IFNULL(ca.\`isdeleted\`,0) = 0  
                            WHERE IFNULL(c.\`isdeleted\`,0) = 0  
                                AND ca.\`contactProfileID\` = ? 
                            ORDER BY name
                        `, [id], callback);
    },
    getRelatedCompanyById: function (id, callback) {
        return db.query(`SELECT c.* 
                            FROM \`company\` c                                 
                            WHERE IFNULL(c.\`isdeleted\`,0) = 0  
                                AND (c.\`ID_company\` = ? OR c.\`related_to\` = ?) 
                            ORDER BY name
                    `,  [
                            id,
                            id
                        ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_company, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "company.ID_company" + "'," + ID_company + " , " + ID_company + ", " + ID_company + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("company." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_company + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "company.ID_company" + "'," + ID_company + " , " + ID_company + ", " + ID_company + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`company\` ORDER BY ID_company LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Company;