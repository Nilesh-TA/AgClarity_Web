const db = require('../config/dbconnection');

let ContactProfile = {
    getAllContactProfiles: function (company, pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_profile";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(DISTINCT c.ID_profile) AS TotalRows
                    FROM \`contactprofile\` c  
                    WHERE IFNULL(c.isdeleted,0) = 0  
                    AND c.company = ${company}               
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            c.*,
                            (SELECT IFNULL(number,'') AS number FROM \`phone\` p WHERE IFNULL(p.isdeleted,0) = 0  AND p.contact = c.ID_profile ORDER BY ID_phone LIMIT 1) AS phone,
                            (SELECT IFNULL(email,'') AS email FROM \`email\` e WHERE IFNULL(e.isdeleted,0) = 0 AND e.contact = c.ID_profile ORDER BY ID_email LIMIT 1) AS email
                            FROM \`contactprofile\` c
                            WHERE IFNULL(c.isdeleted,0) = 0  
                            AND c.company = ${company}                  
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },    
    getContactProfiles: function (callback) {
        return db.query("SELECT * FROM \`contactprofile\` WHERE IFNULL(isdeleted,0) = 0 ORDER BY `last_name` ", callback);
    },   
    getContactProfileById: function (id, callback) {
        return db.query("SELECT * FROM contactprofile WHERE IFNULL(isdeleted,0) = 0  AND `ID_profile`=?", [id], callback);
    },
    addContactProfile: function (ContactProfile, callback) {
        return db.query(`INSERT INTO \`contactprofile\`
                            (
                                \`first_name\`,
                                \`last_name\`,
                                \`title\`,
                                \`responsibility_level\`,
                                \`preferred_contact_method\`,
                                \`secondary_contact_method\`,
                                \`address_1\`,
                                \`address_2\`,
                                \`city\`,
                                \`state\`,
                                \`postal_code\`,
                                \`country\`,
                                \`access_role\`,
                                \`language\`,
                                \`type\`,
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `,
            [
                ContactProfile.first_name,
                ContactProfile.last_name,
                ContactProfile.title,
                ContactProfile.responsibility_level,
                ContactProfile.preferred_contact_method,
                ContactProfile.secondary_contact_method,
                ContactProfile.address_1,
                ContactProfile.address_2,
                ContactProfile.city,
                ContactProfile.state,
                ContactProfile.postal_code,
                ContactProfile.country,
                ContactProfile.access_role,
                ContactProfile.language,
                ContactProfile.type,
                ContactProfile.company
            ], callback);
    },
    deleteContactProfile: function (id, callback) {
        //return db.query("UPDATE \`contactprofile\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_profile`=? ", [id], callback);
        return db.query(`   
                    UPDATE \`contactprofile\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND \`ID_profile\`=?; 
                    UPDATE \`phone\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND \`contact\`=?; 
                    UPDATE \`email\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND \`contact\`=?; 
                    UPDATE \`companyaccess\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND \`contactProfileID\`=?; 
                    UPDATE \`contactaccess\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND \`contactprofileid\`=?; 
                `
            ,   [
                    id,
                    id,
                    id,
                    id,
                    id
                ], callback);
    },
    updateContactProfile: function (id, ContactProfile, callback) {
        return db.query(`UPDATE \`contactprofile\` SET 
                                \`first_name\` = ?,
                                \`last_name\` = ?,
                                \`title\` = ?,
                                \`responsibility_level\` = ?,
                                \`preferred_contact_method\` = ?,
                                \`secondary_contact_method\` = ?,
                                \`address_1\` = ?,
                                \`address_2\` = ?,
                                \`city\` = ?,
                                \`state\` = ?,
                                \`postal_code\` = ?,
                                \`country\` = ?,
                                \`access_role\` = ?,
                                \`language\` = ?,
                                \`type\` = ?
                            WHERE \`ID_profile\` = ? 
                        `,
            [
                ContactProfile.first_name,
                ContactProfile.last_name,
                ContactProfile.title,
                ContactProfile.responsibility_level,
                ContactProfile.preferred_contact_method,
                ContactProfile.secondary_contact_method,
                ContactProfile.address_1,
                ContactProfile.address_2,
                ContactProfile.city,
                ContactProfile.state,
                ContactProfile.postal_code,
                ContactProfile.country,
                ContactProfile.access_role,
                ContactProfile.language,
                ContactProfile.type,                
                id
            ], callback);
    },
    updateUserProfile: function (id, ContactProfile, callback) {
        return db.query(`UPDATE \`contactprofile\` SET 
                                \`first_name\` = ?,
                                \`last_name\` = ?,
                                \`title\` = ?,                                
                                \`preferred_contact_method\` = ?,
                                \`secondary_contact_method\` = ?,
                                \`address_1\` = ?,
                                \`address_2\` = ?,
                                \`city\` = ?,
                                \`state\` = ?,
                                \`postal_code\` = ?,
                                \`country\` = ?                                
                            WHERE \`ID_profile\` = ? 
                        `,
            [
                ContactProfile.first_name,
                ContactProfile.last_name,
                ContactProfile.title,                
                ContactProfile.preferred_contact_method,
                ContactProfile.secondary_contact_method,
                ContactProfile.address_1,
                ContactProfile.address_2,
                ContactProfile.city,
                ContactProfile.state,
                ContactProfile.postal_code,
                ContactProfile.country,                         
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_profile, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        
        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "contactprofile.ID_profile" + "'," + ID_profile + " , " + ID_profile + ", " + ID_profile + ")";
        } else if (action == "update") {            
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("contactprofile." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_profile + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "contactprofile.ID_profile" + "'," + ID_profile + " , " + ID_profile + "," + ID_profile + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`contactprofile\` ORDER BY ID_profile LIMIT 1;`;
        }

        return db.query(queries, callback);
    }   
}

module.exports = ContactProfile;