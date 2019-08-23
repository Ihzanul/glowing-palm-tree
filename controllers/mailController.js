const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Mail = mongoose.model('Mails');

var mail = new Mail();

router.get('/', async (req, res, next) => {
    try {
        const lastData = await Mail.find().sort({'mailNumber': -1}).limit(1)
        res.render("mail/addOrEdit",{
            viewTitle: "Tambah Nomor Surat",
            mail: {
                mailNumber: lastData[0].mailNumber+1
            }
        });
    } catch(e) {
        return next(e)
    }
});

router.post('/', (req, res) => {
    if (req.body._id == ''){
        insertRecord(req, res);
    }else {
        updateRecord(req, res);
    }
});

function insertRecord(req, res){
    mail.mailNumber = req.body.mailNumber;
    mail.nama = req.body.nama;
    mail.stambuk = req.body.stambuk;
    mail.sign = req.body.sign;
    mail.save((err, doc) => {
        if (!err){
            res.redirect('/list')
        }else {
            if (err.nama == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("mail/addOrEdit",{
                    viewTitle: "Tambah Nomor Surat",
                    mail: req.body
                });
            }else {
                console.log('Error during insert record insertion : ' + err);
            }
        }
    });
}

function updateRecord(req, res) {
    Mail.findByIdAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if (!err) {
            res.redirect('/list');
        }else {
            if (err.nama == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("mail/adOrEdit", {
                    viewTitle: 'Perbarui Data',
                    mail: req.body
                });
            }else {
                console.log('Error during record update : ' + err);
            }
        }
    })
}

router.get('/list', (req, res) => {
    Mail.find((err, docs) => {
        if (!err) {
            res.render("mail/list", {
                list: docs
            });
        }else {
            console.log('Error in retriving mail list : ' + err);
        }
    });
});

router.get('/print', (req, res) => {
    Mail.find((err, docs) => {
        if (!err) {
            res.render("mail/print", {
                list: docs
            });
        }else {
            console.log('Error in print : ' + err);
        }
    });
});

function handleValidationError(err, body) {
    for(field in err.errors)
    {
    switch (err.errors[fields].path) {
        case 'nama':
            body['namaError'] = err.errors[field].message;
            break;

        case 'stambuk':
            body['stambukError'] = err.errors[field].message;
            break;

        default:
            break;
        }
    }
}

router.get('/:id', (req, res) => {
    Mail.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("mail/addOrEdit", {
                viewTitle: "Perbarui Data",
                mail: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Mail.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/list');
        }else {
            console.log('Error in mail during delete : ' + err);
        }
    });
});

module.exports = router;