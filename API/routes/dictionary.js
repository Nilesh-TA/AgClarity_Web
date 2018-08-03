const express = require('express');
const router = express.Router();
const Dictionary = require('../models/dictionary');

//Get All Data.
router.get('/', function (req, res, next) {    
    Dictionary.getAllData(req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Contact Source.
router.get('/GetContactSource', function (req, res, next) {    
    Dictionary.getContactSource(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Dictionary data by code.
router.get('/:code', function (req, res, next) {
    if (req.params.code) {
        Dictionary.getDictionaryByCode(req.params.code, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Code parameter missing." })
    }
});



module.exports = router;

