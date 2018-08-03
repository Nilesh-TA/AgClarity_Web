const express = require('express');
const router = express.Router();
const ContactAccess = require('../models/contactaccess');

//Get All Contact Access
router.get('/', function (req, res, next) {    
    ContactAccess.getAllContactAccess(req.query.company, req.query.userid, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Contact Access
router.get('/GetContactAccess', function (req, res, next) {    
    ContactAccess.getContactAccess(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Selected Micro-Apps by Profile Id & Company Id.
router.get('/GetSelectedMicroApps', function (req, res, next) {    
    ContactAccess.getSelectedMicroApps(req.query.profileid, req.query.companyid, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Contact Access By Contact Profile Id.
router.get('/GetContactAccessByProfileId', function (req, res, next) {
    if (req.query.profileid) {
        ContactAccess.getContactAccessByProfileId(req.query.profileid, function (err, rows) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: rows });
            }
        });
    } else {
        res.json({ success: false, message: "Contact Profile Id parameter missing." })
    }
});


//Get Contact Access By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        ContactAccess.getContactAccessById(req.params.id, function (err, rows) {
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
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        ContactAccess.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//CRUD ContactAccess
router.post('/ContactaccessCRUD', function (req, res, next) {
    ContactAccess.contactaccessCRUD(req.body, function (err, count) {                
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Contact Access
router.post('/', function (req, res, next) {
    ContactAccess.addContactAccess(req.body, function (err, count) {        
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Contact Access By Id
router.delete('/:id', function (req, res, next) {
    ContactAccess.deleteContactAccess(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Contact Access By Id
router.put('/:id', function (req, res, next) {
    ContactAccess.updateContactAccess(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
