const express = require('express');
const router = express.Router();
const Company = require('../models/company');

//Get All Companies
router.get('/', function (req, res, next) {    
    Company.getAllCompanies(req.query.company, req.query.pageno, req.query.pagesize, function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Companies
router.get('/GetCompanies', function (req, res, next) {    
    Company.getCompanies(function (err, rows) {        
        if (err) {
            res.json({ success: false, message: err })
        } else {                        
            res.json({ success: true, data: rows });
        }
    });
});

//Get Company By Contact Profile Id
router.get('/GetCompanyByContactProfileId', function (req, res, next) {        
    if (req.query.id) {
        Company.getCompanyByContactProfileId(req.query.id, function (err, rows) {                        
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


//Get Related Company By Company Id
router.get('/GetRelatedCompanyById', function (req, res, next) {        
    if (req.query.id) {
        Company.getRelatedCompanyById(req.query.id, function (err, rows) {                        
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



//Get Company By Id
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Company.getCompanyById(req.params.id, function (err, rows) {
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

//Track User Action.
router.post('/TrackUserAction', function (req, res, next) {    
    if(req.body){
        const oldObj = req.body.old;
        const newObj = req.body.new;
        Company.trackUserAction(req.query.action, req.query.appname, req.query.user, req.query.id, oldObj, newObj, function (err, count) {            
            if (err) {
                res.json({ success: false, message: err })            
            } else {
                res.json({ success: true, data: req.body });
            }
        });
    }    
});

//Create New Company
router.post('/', function (req, res, next) {
    Company.addCompany(req.body, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })            
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Delete Company By Id
router.delete('/:id', function (req, res, next) {
    Company.deleteCompany(req.params.id, function (err, count) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: count });
        }
    });
});

//Update Company By Id
router.put('/:id', function (req, res, next) {
    Company.updateCompany(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json({ success: false, message: err })
        } else {
            res.json({ success: true, data: rows });
        }
    });
});

module.exports = router;
