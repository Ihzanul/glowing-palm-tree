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

router.post('/', async (req, res, next) => {
    try {
        const { 
            mailNumber,
            nama,
            stambuk,
            sign
        } = req.body

        const ref = await Mail.create({
            mailNumber,
            nama,
            stambuk,
            sign
        }, function (err, doc) {
            res.redirect('/list')
        })

    } catch(e) {
        return next(e)
    }
});

router.get('/edit/:id', async (req, res, next) => {
    try {
        const oneData = await Mail.findOne({_id: req.params.id})
        res.render("mail/Edit",{
            viewTitle: "Tambah Nomor Surat",
            mail: {
                mailNumber: oneData.mailNumber,
                nama: oneData.nama,
                stambuk: oneData.stambuk,
                sign: oneData.sign
            }
        });
    } catch(e) {
        return next(e)
    }
})

router.post('/edit', async (req, res, next) => {
    try {
        const { 
            mailNumber,
            nama,
            stambuk,
            sign
        } = req.body

        const ref = await Mail.updateOne({ mailNumber }, { $set: { nama, stambuk, sign } })
        res.redirect('/list')
    } catch(e) {
        next(e)
    }
})

router.get('/list', (req, res) => {
    Mail.find((err, docs) => {
        if (!err) {
            res.render("mail/list", {
                list: docs
            });
        }else {
            console.log('Error in retriving mail list : ' + err);
        }
    }).sort({ mailNumber: 1 });
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