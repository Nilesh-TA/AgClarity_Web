const db = require('../config/dbconnection');
let Location = {
    getAllLocations: function (company, pageNo, pageSize, callback) {

        let sortBy = "ID_location";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM \`location\` l
                    WHERE IFNULL(l.isdeleted,0) = 0
                    AND l.company = ${company}
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            l.* 
                            FROM \`location\` l
                            WHERE IFNULL(l.isdeleted,0) = 0
                            AND l.company = ${company}
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getLocations: function (callback) {
        return db.query("SELECT * FROM \`location\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `name` ", callback);
    },
    getLocationById: function (id, callback) {
        return db.query("SELECT * FROM \`location\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_location`=?", [id], callback);
    },
    getLocationByCompany: function (companyid, callback) {
        return db.query("SELECT * FROM \`location\` WHERE IFNULL(isdeleted,0) = 0 AND `company`=?", [companyid], callback);
    },
    addLocation: function (Location, callback) {
        return db.query(`INSERT INTO \`location\`
                            (
                                \`name\`,
                                \`type\`,
                                \`description\`,
                                \`address\`,
                                \`longitude\`,
                                \`latitude\`,
                                \`polygon_data\`,
                                \`size\`,
                                \`slope\`,
                                \`aspect\`,
                                \`elevation\`,
                                \`soil_texture\`,
                                \`soil_depth\`,
                                \`water_depth\`,
                                \`field_capacity\`,
                                \`mdp\`,                                
                                \`company\`,
                                \`related_to\`
                            ) 
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `,
            [
                Location.name,
                Location.type,
                Location.description,                
                Location.address,
                Location.longitude,
                Location.latitude,
                Location.polygon_data,
                Location.size,
                Location.slope,
                Location.aspect,
                Location.elevation,
                Location.soil_texture,
                Location.soil_depth,
                Location.water_depth,
                Location.field_capacity,
                Location.mdp,
                Location.company,
                Location.related_to
            ], callback);
    },
    deleteLocation: function (id, callback) {
        return db.query("UPDATE \`location\` SET \`isdeleted\` = 1, \`deletedon\` = NOW() WHERE IFNULL(\`isdeleted\`,0) = 0  AND `ID_location` = ?", [id], callback);
    },
    updateLocation: function (id, Location, callback) {
        return db.query(`UPDATE \`location\` SET 
                                \`name\` = ?,
                                \`type\` = ?,
                                \`description\` = ?,                                
                                \`address\` = ?,
                                \`longitude\` = ?,
                                \`latitude\` = ?,
                                \`polygon_data\` = ?,
                                \`size\` = ?,
                                \`slope\` = ?,
                                \`aspect\` = ?,
                                \`elevation\` = ?,
                                \`soil_texture\` = ?,                                
                                \`soil_depth\` = ?,
                                \`water_depth\` = ?,
                                \`field_capacity\` = ?,
                                \`mdp\` = ?
                            WHERE \`ID_location\` = ? 
                        `,
            [
                Location.name,
                Location.type,
                Location.description,                
                Location.address,
                Location.longitude,
                Location.latitude,
                Location.polygon_data,
                Location.size,
                Location.slope,
                Location.aspect,
                Location.elevation,
                Location.soil_texture,
                Location.soil_depth,
                Location.water_depth,
                Location.field_capacity,
                Location.mdp,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_location, OldLocation, NewLocation, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(NewLocation);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "location.ID_location" + "'," + ID_location + " , " + ID_location + ", " + ID_location + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (OldLocation[field] != NewLocation[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("location." + field) + "', '" + OldLocation[field] + "', '" + NewLocation[field] + "'," + ID_location + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "location.ID_location" + "'," + ID_location + " , " + ID_location + ", " + ID_location + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`location\` ORDER BY ID_location LIMIT 1;`;
        }

        return db.query(queries, callback);
    }
}

module.exports = Location;
