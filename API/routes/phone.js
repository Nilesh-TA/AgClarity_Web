const express = require('express');
const router = express.Router();
const Phone = require('../models/phone');

//Get All Phones
router.get('/', function (req, res, next) {    
    Phone.getAllPhones(req.query.userid, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Phones
router.get('/GetPhone', function (req, res, next) {    
    Phone.getPhone(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Phone By Contact Profile Id
router.get('/GetPhoneByContactProfileId', function (req, res, next) {        
    if (req.query.id) {
        Phone.getPhoneByContactProfileId(req.query.id, function (err, rows) {                        
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Contact Profile id parameter missing." })
    }
});

//Get Phone By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Phone.getPhoneById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Id parameter missing." })
    }
});


//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Phone.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//CRUD Phone
router.post('/PhoneCRUD', function (req, res, next) {
    Phone.phoneCRUD(req.body, function (err, count) {                
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Phone
router.post('/', function (req, res, next) {
    Phone.addPhone(req.body, function (err, count) {        
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Phone By Id
router.delete('/:id', function (req, res, next) {
    Phone.deletePhone(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Phone By Id
router.put('/:id', function (req, res, next) {
    Phone.updatePhone(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
