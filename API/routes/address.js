const express = require('express');
const router = express.Router();
const Address = require('../models/address');

//Get All Addresses
router.get('/', function (req, res, next) {    
    Address.getAllAddresses(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err });
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Addresses
router.get('/GetAddresses', function (req, res, next) {    
    Address.getAddresses(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err });
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Address By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Address.getAddressById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Address id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Address.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err });            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//Create New Address
router.post('/', function (req, res, next) {
    Address.addAddress(req.body, function (err, count) {        
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Address By Id
router.delete('/:id', function (req, res, next) {
    Address.deleteAddress(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Address By Id
router.put('/:id', function (req, res, next) {
    Address.updateAddress(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
