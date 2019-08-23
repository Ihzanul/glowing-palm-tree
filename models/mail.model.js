const mongoose = require('mongoose');

var mailSchema = new mongoose.Schema({
    mailNumber: {
        type: Number
    },
    nama: {
        type: String,
        required: 'This field is required.'
    },
    stambuk: {
        type: String,
        required: 'This field is required'
    },
    sign: {
        type: String
    }
});

mongoose.model('Mails', mailSchema);