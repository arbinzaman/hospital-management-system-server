const mongoose = require("mongoose");
const validator = require("validator");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PCSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        trim: true,
        unique: [true, 'There exists an account already with {VALUE}'],
        validate: [validator.isMobilePhone, 'Please provide a valid contact number'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
        trim: true,
    },
    organization: String,
    invoices: [{
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice'
        },
        paid: {
            type: Boolean,
            default: false
        }
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    serialId: {
        type: Number,
        unique: true
    }
}, {
    timestamps: true
});

PCSchema.plugin(AutoIncrement, { id: 'serialId_pc', inc_field: 'serialId' });

const PC = mongoose.model("PC", PCSchema);

module.exports = PC;