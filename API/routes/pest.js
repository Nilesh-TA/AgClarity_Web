const express = require('express');
const router = express.Router();
const Pest = require('../models/pest');

//Get All Pests
router.get('/', function (req, res, next) {    
    Pest.getAllPests(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Pests
router.get('/GetPests', function (req, res, next) {    
    Pest.getPests(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Pest By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Pest.getPestById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Pest id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Pest.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//Create New Pest
router.post('/', function (req, res, next) {
    Pest.addPest(req.body, function (err, count) {        
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Pest By Id
router.delete('/:id', function (req, res, next) {
    Pest.deletePest(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Pest By Id
router.put('/:id', function (req, res, next) {
    Pest.updatePest(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
