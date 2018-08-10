const express = require('express');
const router = express.Router();
const Provider = require('../models/provider');

//Get All Providers
router.get('/', function (req, res, next) {
    Provider.getAllProviders(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Providers
router.get('/GetProviders', function (req, res, next) {
    Provider.getProviders(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Providers By Company Id
router.get('/GetProvidersByCompany', function (req, res, next) {        
    if (req.query.company) {
        Provider.getProvidersByCompany(req.query.company, req.query.id, function (err, rows) {                        
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


//Get Provider By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Provider.getProviderById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Provider id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {
    if (req.body) {
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Provider.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//Create New Provider
router.post('/', function (req, res, next) {
    Provider.addProvider(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Provider By Id
router.delete('/:id', function (req, res, next) {
    Provider.deleteProvider(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Provider By Id
router.put('/:id', function (req, res, next) {
    Provider.updateProvider(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
