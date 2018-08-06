const express = require('express');
const router = express.Router();
const WatersourceLocation = require('../models/watersourcelocation');

//Get All Watersource Location
router.get('/', function (req, res, next) {
    WatersourceLocation.getAllWatersourceLocation(req.query.watersource, req.query.location, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Watersource Location
router.get('/GetWatersourceLocation', function (req, res, next) {
    WatersourceLocation.getWatersourceLocation(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Watersource Location By Watersource Id.
router.get('/GetWatersourceLocationByWaterSourceId', function (req, res, next) {
    if (req.query.watersourceid) {
        WatersourceLocation.getWatersourceLocationByWaterSourceId(req.query.watersourceid, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Watersource Id parameter missing." })
    }
});

//Get Watersource Location By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        WatersourceLocation.getWatersourceLocationById(req.params.id, function (err, rows) {
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
        WatersourceLocation.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//CRUD WatersourceLocation
router.post('/WatersourcelocationCRUD', function (req, res, next) {
    WatersourceLocation.watersourcelocationCRUD(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Watersource Location
router.post('/', function (req, res, next) {
    WatersourceLocation.addWatersourceLocation(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Watersource Location By Id
router.delete('/:id', function (req, res, next) {
    WatersourceLocation.deleteWatersourceLocation(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Watersource Location By Id
router.put('/:id', function (req, res, next) {
    WatersourceLocation.updateWatersourceLocation(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
