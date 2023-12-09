const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const testSchema = mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: [true, 'Please provide category Id'],
        },
        file_url: String,
        image_url: String,
        results: [{
            test: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'TestName',
            },
            result: String,
        }
        ],
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
        },
        serialId: {
            type: Number,
            unique: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
        },
        available: {
            type: Boolean,
            default: false
        },
        allowed: {
            type: Boolean,
            default: false
        },
        deliveryDate : Date,
        remarks: String
    },
    {
        timestamps: true,
    }
);

testSchema.plugin(AutoIncrement, { id: 'serialId_seq', inc_field: 'serialId' });

const Test = mongoose.model("Test", testSchema)

module.exports = Test