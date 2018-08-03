const db = require('../config/dbconnection');

let Dictionary = {
    getAllData: function (pageNo, pageSize, callback) {

        //LIMIT 0, 5; (0 = (current page - 1) * PageSize, 5 = PageSize)
        //LIMIT 5 OFFSET 0; (LIMIT 5 = PageSize, OFFSET 10 = (current page - 1) * PageSize)

        let sortBy = "ID_dictionary";
        let SortOrder = "DESC";
        pageNo = +pageNo;
        pageSize = +pageSize;

        db.query(`SELECT COUNT(*) AS TotalRows
                    FROM dictionary d                    
                `,
            function (err, rows, fields) {
                if (err) throw err;

                let totalRows = rows[0].TotalRows;
                db.query(`SELECT ${totalRows} AS TotalRows,
                            d.* 
                            FROM dictionary d                            
                            ORDER BY ${sortBy} ${SortOrder}
                            LIMIT ${((pageNo - 1) * pageSize)},${pageSize}
                        `, callback);

            });


    },
    getDictionaryByCode: function (code, callback) {
        return db.query(`SELECT * 
                            FROM dictionary 
                            WHERE \`code\` = ?
                            ORDER BY \`value\`
                        `, [code], callback);
    },
    getContactSource: function (callback) {
        return db.query(`SELECT * 
                            FROM dictionary 
                            WHERE \`code\` = 'ContactSource'
                            ORDER BY \`description\`
                        `, callback);
    },
}

module.exports = Dictionary;