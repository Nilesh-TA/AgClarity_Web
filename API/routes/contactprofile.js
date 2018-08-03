const express = require('express');
const router = express.Router();
const ContactProfile = require('../models/contactprofile');

//Get All Contact Profiles
router.get('/', function (req, res, next) {
    ContactProfile.getAllContactProfiles(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Contact Profiles
router.get('/GetContactProfiles', function (req, res, next) {
    ContactProfile.getContactProfiles(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Contact Profile By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        ContactProfile.getContactProfileById(req.params.id, function (err, rows) {
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
        ContactProfile.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//Create New Contact Profile
router.post('/', function (req, res, next) {
    ContactProfile.addContactProfile(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Contact Profile By Id
router.delete('/:id', function (req, res, next) {
    ContactProfile.deleteContactProfile(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});


//Update User Profile
router.put('/UpdateUserProfile', function (req, res, next) {
    if (req.query.id) {
        ContactProfile.updateUserProfile(+req.query.id, req.body, function (err, rows) {
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

//Update Contact Profile By Id
router.put('/:id', function (req, res, next) {
    ContactProfile.updateContactProfile(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
