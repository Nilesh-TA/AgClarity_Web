const db = require('../config/dbconnection');

let Subscription = {
    getSubscriptionByCompanyId: function (companyId, callback) {
        return db.query("SELECT ID_subscription, micro_app_name, app_level, app_version, DATE_FORMAT(start_date, '%Y/%m/%d') AS start_date,  DATE_FORMAT(expire_date, '%Y/%m/%d') AS expire_date, company FROM \`subscription\` WHERE IFNULL(isdeleted,0) = 0 AND `company` = ? ORDER BY `micro_app_name` ", [companyId], callback);
    },
    getSubscriptionById: function (id, callback) {
        return db.query("SELECT * FROM \`subscription\` WHERE IFNULL(isdeleted,0) = 0 AND `ID_subscription`=?", [id], callback);
    },
    addSubscription: function (Subscription, callback) {
        return db.query(`INSERT INTO \`subscription\`
                            (
                                \`micro_app_name\`,
                                \`app_level\`,
                                \`app_version\`,
                                \`start_date\`,
                                \`expire_date\`,                                
                                \`company\`
                            ) 
                            VALUES(?,?,?,?,?,?)
                        `,
            [
                Subscription.micro_app_name,
                Subscription.app_level,
                Subscription.app_version,
                Subscription.start_date,
                Subscription.expire_date,
                Subscription.company
            ], callback);
    },
    deleteSubscription: function (id, callback) {
        return db.query("UPDATE \`subscription\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_subscription`=? ", [id], callback);
    },
    updateSubscription: function (id, Subscription, callback) {
        return db.query(`UPDATE \`subscription\` SET 
                                \`micro_app_name\` = ?,
                                \`app_level\` = ?,
                                \`app_version\` = ?,
                                \`start_date\` = ?,
                                \`expire_date\` = ?
                            WHERE \`ID_subscription\` = ? 
                        `,
            [
                Subscription.micro_app_name,
                Subscription.app_level,
                Subscription.app_version,
                Subscription.start_date,
                Subscription.expire_date,
                id
            ], callback);
    },
    trackUserAction: function (action, microAppName, userId, ID_subscription, oldObj, newObj, callback) {
        let queries = "";
        let isChange = false;

        const fields = Object.keys(newObj);

        if (action == "add") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            queries += "(NOW(), 'add','" + microAppName + "'," + userId + ", '" + "subscription.ID_subscription" + "'," + ID_subscription + ", " + ID_subscription + ", " + ID_subscription + ")";
        } else if (action == "update") {
            queries += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (field) {
                    if (oldObj[field] != newObj[field]) {
                        isChange = true;
                        queries += "(NOW(), 'update','" + microAppName + "'," + userId + ", '" + ("subscription." + field) + "', '" + oldObj[field] + "', '" + newObj[field] + "'," + ID_subscription + "),";
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
            queries += "(NOW(), 'delete','" + microAppName + "'," + userId + ", '" + "subscription.ID_subscription" + "'," + ID_subscription + " , " + ID_subscription + "," + ID_subscription + ")";
        }

        if (queries == null || queries == undefined) {
            queries = `SELECT * FROM \`subscription\` ORDER BY ID_subscription LIMIT 1;`;
        }

        return db.query(queries, callback);
    },
    subscriptionCRUD: function (body, callback) {

        const microapp_name = body.microapp_name;
        const userid = body.userid;
        
        let promiseArr = [];

        //Add new
        if (body.add && body.add.length > 0) {

            for (let i = 0; i < body.add.length; i++) {

                let Subscription = body.add[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`INSERT INTO \`subscription\`
                        (
                            \`micro_app_name\`,
                            \`app_level\`,
                            \`app_version\`,
                            \`start_date\`,
                            \`expire_date\`,                                
                            \`company\`
                        ) 
                        VALUES(?,?,?,?,?,?)
                    `,
                        [
                            Subscription.micro_app_name,
                            Subscription.app_level,
                            Subscription.app_version,
                            Subscription.start_date,
                            Subscription.expire_date,
                            Subscription.company
                        ], function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            const insertId = result.insertId;
                            if (insertId > 0) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'add','" + microapp_name + "'," + userid + ", '" + "subscription.ID_subscription" + "'," + insertId + ", " + insertId + ", " + insertId + ")";

                                    resolve(db.query(query));
                                });
                                promiseArr.push(promise1);

                                resolve(true);
                            }
                        });
                });
                promiseArr.push(promise);
            }
        }

        //Delete
        if (body.delete && body.delete.length > 0) {
            for (let i = 0; i < body.delete.length; i++) {

                let ID_subscription = body.delete[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query("UPDATE \`subscription\` SET isdeleted = 1, deletedon = NOW() WHERE IFNULL(isdeleted,0) = 0 AND `ID_subscription`=? ", [ID_subscription],
                        function (err, result) {                            
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    query += "(NOW(), 'delete','" + microapp_name + "'," + userid + ", '" + "subscription.ID_subscription" + "'," + ID_subscription + ", " + ID_subscription + ", " + ID_subscription + ")";

                                    resolve(db.query(query));
                                });
                                promiseArr.push(promise1);

                                resolve(true);
                            }
                        });
                });
                promiseArr.push(promise);
            }
        }

        //Update
        if (body.update && body.update != null) {
            for (let i = 0; i < body.update.new.length; i++) {

                let Subscription = body.update.new[i];
                let OldSubscription = body.update.old[i];

                let promise = new Promise(function (resolve, reject) {
                    db.query(`UPDATE \`subscription\` SET 
                                \`micro_app_name\` = ?,
                                \`app_level\` = ?,
                                \`app_version\` = ?,
                                \`start_date\` = ?,
                                \`expire_date\` = ?
                            WHERE \`ID_subscription\` = ? 
                        `,
                        [
                            Subscription.micro_app_name,
                            Subscription.app_level,
                            Subscription.app_version,
                            Subscription.start_date,
                            Subscription.expire_date,
                            Subscription.ID_subscription
                        ], function (err, result) {
                            if (err) {
                                //throw err;
                                reject(err);
                            }

                            if (result != null) {

                                const fields = Object.keys(Subscription);
                                let isChange = false;

                                let promise1 = new Promise(function (resolve, reject) {
                                    let query = "";
                                    query += "INSERT INTO \`useraction\` (\`datetime\`,\`description\`,\`micro_app\`,\`user\`,\`value_1\`,\`value_2\`,\`value_3\`,\`ref_id\`) VALUES ";
                                    for (let i = 0; i < fields.length; i++) {
                                        let field = fields[i];
                                        if (field) {
                                            if (OldSubscription[field] != Subscription[field]) {
                                                isChange = true;
                                                query += "(NOW(), 'update','" + microapp_name + "'," + userid + ", '" + ("subscription." + field) + "', '" + OldSubscription[field] + "', '" + Subscription[field] + "'," + Subscription.ID_subscription + "),";
                                            }
                                        }
                                    }

                                    if (isChange) {
                                        query = query.trim(); //Remove whitespaces
                                        query = query.slice(0, -1); //Remove last charcters.
                                        query = query + ";" //Add semi-colon;
                                    } else {
                                        query = "";
                                    }

                                    if (query != null && query != "") {
                                        resolve(db.query(query));
                                    } else {
                                        resolve(true);
                                    }
                                });
                                promiseArr.push(promise1);

                                resolve(true);
                            }
                        });
                });
                promiseArr.push(promise);
            }
        }

        Promise.all(promiseArr).then(function (data) {               
            return callback(null, data);
        }).catch(function (error) {            
            return callback(error, null);
        });

    },
}

module.exports = Subscription;