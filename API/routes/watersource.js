const express = require('express');
const router = express.Router();
const WaterSource = require('../models/watersource');

//Get All WaterSources
router.get('/', function (req, res, next) {    
    WaterSource.getAllWaterSources(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get WaterSources
router.get('/GetWaterSources', function (req, res, next) {    
    WaterSource.getWaterSources(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get WaterSource By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        WaterSource.getWaterSourceById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "WaterSource id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        WaterSource.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
    
});

//Create New WaterSource
router.post('/', function (req, res, next) {
    WaterSource.addWaterSource(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete WaterSource By Id
router.delete('/:id', function (req, res, next) {
    WaterSource.deleteWaterSource(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update WaterSource By Id
router.put('/:id', function (req, res, next) {
    WaterSource.updateWaterSource(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;