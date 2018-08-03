const express = require('express');
const router = express.Router();
const Disease = require('../models/disease');

//Get All Diseases
router.get('/', function (req, res, next) {    
    Disease.getAllDiseases(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Diseases
router.get('/GetDiseases', function (req, res, next) {    
    Disease.getDiseases(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Disease By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Disease.getDiseaseById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Disease id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Disease.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//Create New Disease
router.post('/', function (req, res, next) {
    Disease.addDisease(req.body, function (err, count) {        
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Disease By Id
router.delete('/:id', function (req, res, next) {
    Disease.deleteDisease(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Disease By Id
router.put('/:id', function (req, res, next) {
    Disease.updateDisease(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
