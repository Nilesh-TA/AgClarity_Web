const express = require('express');
const router = express.Router();
const CompanyAccess = require('../models/companyaccess');

//Get All Company Access
router.get('/', function (req, res, next) {
    CompanyAccess.getAllCompanyAccess(req.query.company, req.query.userid, req.query.pageno, req.query.pagesize, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Company Access
router.get('/GetCompanyAccess', function (req, res, next) {
    CompanyAccess.getCompanyAccess(function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

//Get Company Access By Contact Profile Id.
router.get('/GetCompanyAccessByProfileId', function (req, res, next) {
    if (req.query.profileid) {
        CompanyAccess.getCompanyAccessByProfileId(req.query.profileid, function (err, rows) {
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

//Get Company Access By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        CompanyAccess.getCompanyAccessById(req.params.id, function (err, rows) {
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
        CompanyAccess.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }
});

//CRUD CompanyAccess
router.post('/CompanyaccessCRUD', function (req, res, next) {
    CompanyAccess.companyaccessCRUD(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Create New Company Access
router.post('/', function (req, res, next) {
    CompanyAccess.addCompanyAccess(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Company Access By Id
router.delete('/:id', function (req, res, next) {
    CompanyAccess.deleteCompanyAccess(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Company Access By Id
router.put('/:id', function (req, res, next) {
    CompanyAccess.updateCompanyAccess(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
