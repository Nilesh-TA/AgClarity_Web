var jwt = require('jsonwebtoken');

// validation middleware (token)
module.exports = function (req, res, next) {    
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp        
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {            
            if (err) { //failed verification.
                return res.status(500).send('Token Invalid');
            }
            req.decoded = decoded;
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        return res.status(401).send('Token Missing');        
    }
}