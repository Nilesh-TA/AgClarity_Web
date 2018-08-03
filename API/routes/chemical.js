const express = require('express');
const router = express.Router();
const Chemical = require('../models/chemical');

//Get All Chemicals
router.get('/', function (req, res, next) {    
    Chemical.getAllChemicals(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Chemicals
router.get('/GetChemicals', function (req, res, next) {    
    Chemical.getChemicals(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Chemical By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Chemical.getChemicalById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Chemical id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Chemical.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {            
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//Create New Chemical
router.post('/', function (req, res, next) {
    Chemical.addChemical(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Chemical By Id
router.delete('/:id', function (req, res, next) {
    Chemical.deleteChemical(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Chemical By Id
router.put('/:id', function (req, res, next) {
    Chemical.updateChemical(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
