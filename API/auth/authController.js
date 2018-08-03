var jwt = require('jsonwebtoken');
var db = require('../config/dbconnection');

let auth = function (req, res) {    
    var email = req.body.email;
    var password = req.body.password;

    //db.query('SELECT * FROM userdetail WHERE email = ?', [email], function (err, results, rows) {        
    db.query('SELECT * FROM contactprofile WHERE 1 = 1', [email], function (err, results, rows) {        
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {            
            if (results.length > 0) {

                var email = "nilesh.sonkusare@techavidus.com"
                var password = "Admin@123"

                const expiresIn = 86400; // expires in 24 hours
                
                //Generate Token.
                var token = jwt.sign({ email: email, password : password }, process.env.SECRET_KEY, {
                    expiresIn: expiresIn 
                });

                res.json({
                    success: true,
                    access_token: token,
                    expiresIn: expiresIn,
                    data: user
                });

                // var user = results[0];
                // if (user && password == user.password) {   
                //     const expiresIn = 86400; // expires in 24 hours
                    
                //     //Generate Token.
                //     var token = jwt.sign({ email: user.email, password : user.password }, process.env.SECRET_KEY, {
                //         expiresIn: expiresIn 
                //     });

                //     res.json({
                //         success: true,
                //         access_token: token,
                //         expiresIn: expiresIn,
                //         data: user
                //     });

                // } else {
                //     res.json({
                //         success: false,
                //         message: "Invalid email and password"
                //     });
                // }
            }
            else {
                res.json({
                    success: false,
                    message: "Email does not exits"
                });
            }
        }
    });
}


module.exports = auth;