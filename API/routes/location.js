const express = require('express');
const router = express.Router();
const Location = require('../models/location');

//Get All Locations
router.get('/', function (req, res, next) {
    Location.getAllLocations(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Locations
router.get('/GetLocations', function (req, res, next) {
    Location.getLocations(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Locations By Company Id
router.get('/GetLocationByCompany', function (req, res, next) {
    if (req.query.company) {
        Location.getLocationByCompany(req.query.company, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Company id parameter missing." })
    }
});


//Get Location By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Location.getLocationById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Location id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {
    if (req.body) {
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Location.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }

});

//Create New Location
router.post('/', function (req, res, next) {
    Location.addLocation(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Location By Id
router.delete('/:id', function (req, res, next) {
    Location.deleteLocation(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Location By Id
router.put('/:id', function (req, res, next) {
    Location.updateLocation(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
