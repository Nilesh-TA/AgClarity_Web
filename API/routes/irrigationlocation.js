const express = require('express');
const router = express.Router();
const IrrigationLocation = require('../models/irrigationlocation');

//Get All Irrigation Location
router.get('/', function (req, res, next) {
    IrrigationLocation.getAllIrrigationLocation(req.query.irrigation, req.query.location, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Irrigation Location
router.get('/GetIrrigationLocation', function (req, res, next) {
    IrrigationLocation.getIrrigationLocation(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Irrigation Location By Irrigation Id.
router.get('/GetIrrigationLocationByIrrigationId', function (req, res, next) {
    if (req.query.irrigationid) {
        IrrigationLocation.getIrrigationLocationByIrrigationId(req.query.irrigationid, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Irrigation Id parameter missing." })
    }
});

//Get Irrigation Location By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        IrrigationLocation.getIrrigationLocationById(req.params.id, function (err, rows) {
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
        IrrigationLocation.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//CRUD IrrigationLocation
router.post('/IrrigationlocationCRUD', function (req, res, next) {
    IrrigationLocation.irrigationlocationCRUD(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Irrigation Location
router.post('/', function (req, res, next) {
    IrrigationLocation.addIrrigationLocation(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Irrigation Location By Id
router.delete('/:id', function (req, res, next) {
    IrrigationLocation.deleteIrrigationLocation(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Irrigation Location By Id
router.put('/:id', function (req, res, next) {
    IrrigationLocation.updateIrrigationLocation(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
