const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');

//Get Subscription By Company
router.get('/GetSubscriptionByCompany', function (req, res, next) {    
    if (req.query.company) {
        Subscription.getSubscriptionByCompanyId(req.query.company, function (err, rows) {            
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

//Get Subscription By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Subscription.getSubscriptionById(req.params.id, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Subscription id parameter missing." })
    }
});

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {
    if (req.body) {
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Subscription.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//CRUD Subscription
router.post('/SubscriptionCRUD', function (req, res, next) {
    Subscription.subscriptionCRUD(req.body, function (err, count) {                
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Subscription
router.post('/', function (req, res, next) {
    Subscription.addSubscription(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Subscription By Id
router.delete('/:id', function (req, res, next) {
    Subscription.deleteSubscription(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Subscription By Id
router.put('/:id', function (req, res, next) {
    Subscription.updateSubscription(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
