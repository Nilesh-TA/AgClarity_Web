const express = require('express');
const router = express.Router();
const Email = require('../models/email');

//Get All Emails
router.get('/', function (req, res, next) {
    Email.getAllEmails(req.query.userid, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Emails
router.get('/GetEmail', function (req, res, next) {
    Email.getEmail(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Email By Contact Profile Id
router.get('/GetEmailByContactProfileId', function (req, res, next) {        
    if (req.query.id) {
        Email.getEmailByContactProfileId(req.query.id, function (err, rows) {                        
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Contact Profile id parameter missing." })
    }
});

//Get Email By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Email.getEmailById(req.params.id, function (err, rows) {
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
        Email.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//CRUD Email
router.post('/EmailCRUD', function (req, res, next) {
    Email.emailCRUD(req.body, function (err, count) {                
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Email
router.post('/', function (req, res, next) {
    Email.addEmail(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Email By Id
router.delete('/:id', function (req, res, next) {
    Email.deleteEmail(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Email By Id
router.put('/:id', function (req, res, next) {
    Email.updateEmail(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
