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
router.get('/GetDictionaryByCode/:code', function (req, res, next) {    
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

//Get Dictionary data by id.
router.get('/:id', function (req, res, next) {    
    if (req.params.id) {
        Dictionary.getDictionaryById(req.params.id, function (err, rows) {
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
    if (req.body) {
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Dictionary.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//Create New Dictionary
router.post('/', function (req, res, next) {
    Dictionary.addDictionary(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});


//Delete Dictionary By Id
router.delete('/:id', function (req, res, next) {
    Dictionary.deleteDictionary(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Dictionary By Id
router.put('/:id', function (req, res, next) {
    Dictionary.updateDictionary(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;

