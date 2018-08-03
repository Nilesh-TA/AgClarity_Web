const db = require('../config/dbconnection');
//const moment = require('moment');
let Crop = {
    getAllCrops: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_crop";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`crop\` c
                    WHERE IFNULL(c.isdeleted,0) = 0
                    AND c.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            c.* 
                            FROM \`crop\` c
                            WHERE IFNULL(c.isdeleted,0) = 0
                            AND c.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getCrops: function (callback) {
        return db.query("SELECT * FROM \`crop\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getCropById: function (id, callback) {
        return db.query("SELECT * FROM \`crop\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_crop`=?", [id], callback);
    },
    addCrop: function (Crop, callback) {
        return db.query(`INSERT INTO \`crop\`
                            (
                                \`name\`,
                                \`variety_name\`,
                                \`description\`,
                                \`type\`,
                                \`avg_yield_acre\`,
                                \`avg_size\`,
                                \`avg_color\`,
                                \`maturity_cycle\`,
                                \`crop_cycle\`,
                                \`crop_season\`,
                                \`kc_init\`,
                                \`kc_mid\`,
                                \`kc_end\`,
                                \`stage_1\`,
                                \`stage_2\`,
                                \`stage_3\`,
                                \`stage_4\`,
                                \`stage_5\`,
                                \`stage_6\`,
                                \`stage_7\`,
                                \`stage_8\`,
                                \`stage_9\`,
                                \`stage_10\`,
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `,
            [
                Crop.name,
                Crop.variety_name,
                Crop.description,
                Crop.type,
                Crop.avg_yield_acre,
                Crop.avg_size,
                Crop.avg_color,
                Crop.maturity_cycle,
                Crop.crop_cycle,
                Crop.crop_season,
                Crop.kc_init,
                Crop.kc_mid,
                Crop.kc_end,
                Crop.stage_1,
                Crop.stage_2,
                Crop.stage_3,
                Crop.stage_4,
                Crop.stage_5,
                Crop.stage_6,
                Crop.stage_7,
                Crop.stage_8,
                Crop.stage_9,
                Crop.stage_10,
                Crop.company
            ], callback);
    },
    deleteCrop: function (id, callback) {
        // const currenDateTime = moment(Date.now()).format("YYYY-MM-DD hh:mm:ss A");
        // console.log("currenDateTime : " + currenDateTime);

        let queries = "";

        //Update isdeleted flag in crop table.
        queries += `
                UPDATE \`crop\` SET 
                        isdeleted = 1, 
                        deletedon = NOW()
                WHERE IFNULL(isdeleted,0) = 0 AND \`ID_crop\`= ${id} 
        `;

        return db.query(queries, [id], callback);
    },
    updateCrop: function (id, Crop, callback) {
        return db.query(`UPDATE \`crop\` SET 
                                \`name\` = ?,
                                \`variety_name\` = ?,
                                \`description\` = ?,
                                \`type\` = ?,
                                \`avg_yield_acre\` = ?,
                                \`avg_size\` = ?,
                                \`avg_color\` = ?,
                                \`maturity_cycle\` = ?,
                                \`crop_cycle\` = ?,
                                \`crop_season\` = ?,
                                \`kc_init\` = ?,
                                \`kc_mid\` = ?,
                                \`kc_end\` = ?,                                
                                \`stage_1\` = ?,
                                \`stage_2\` = ?,
                                \`stage_3\` = ?,
                                \`stage_4\` = ?,
                                \`stage_5\` = ?,
                                \`stage_6\` = ?,
                                \`stage_7\` = ?,
                                \`stage_8\` = ?,
                                \`stage_9\` = ?,
                                \`stage_10\` = ?
                            WHERE \`ID_crop\` = ? 
                        `,
            [
                Crop.name,
                Crop.variety_name,
                Crop.description,
                Crop.type,
                Crop.avg_yield_acre,
                Crop.avg_size,
                Crop.avg_color,
                Crop.maturity_cycle,
                Crop.crop_cycle,
                Crop.crop_season,
                Crop.kc_init,
                Crop.kc_mid,
                Crop.kc_end,
                Crop.stage_1,
                Crop.stage_2,
                Crop.stage_3,
                Crop.stage_4,
                Crop.stage_5,
                Crop.stage_6,
                Crop.stage_7,
                Crop.stage_8,
                Crop.stage_9,
                Crop.stage_10,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_crop, OldCrop, NewCrop, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(NewCrop);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "crop.ID_crop" + "'," + ID_crop + " , " + ID_crop + ", " + ID_crop + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (OldCrop[field] != NewCrop[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("crop." + field) + "', '" + OldCrop[field] + "', '" + NewCrop[field] + "'," + ID_crop + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "crop.ID_crop" + "'," + ID_crop + " , " + ID_crop + ", " + ID_crop + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`crop\` ORDER BY ID_Crop LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Crop;
