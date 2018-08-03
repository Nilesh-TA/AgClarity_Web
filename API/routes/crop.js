const express = require('express');
const router = express.Router();
const Crop = require('../models/crop');

//Get All Crops
router.get('/', function (req, res, next) {    
    Crop.getAllCrops(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Crops
router.get('/GetCrops', function (req, res, next) {    
    Crop.getCrops(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Crop By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Crop.getCropById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Crop id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Crop.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {            
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
    
});

//Create New Crop
router.post('/', function (req, res, next) {
    Crop.addCrop(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Crop By Id
router.delete('/:id', function (req, res, next) {
    Crop.deleteCrop(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Crop By Id
router.put('/:id', function (req, res, next) {
    Crop.updateCrop(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
