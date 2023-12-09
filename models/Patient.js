const mongoose = require('mongoose');
const validator = require("validator");
const moment = require('moment/moment');

const patientSchema = mongoose.Schema(
    {
        phone: {
            type: String,
            required: [true, "Please provide patient's phone number."],
            trim: true,
            unique: [true, "There already exists an account with {VALUE}"],
            validate: [validator.isMobilePhone, "Please provide a valid contact number"],
        },

        email: {
            type: String,
            validate: [validator.isEmail, "Please provide a valid Email"],
            trim: true,
            lowercase: true,
        },

        age: {
            type: Number,
            required: [true, "Please provide patient's age."]
        },

        gender: {
            type: String,
            enum: ["Female", "Male", "Others"],
            required: [true, "Please provide patient's gender."]
        },

        bloodGroup: {
            type: String,
            enum: ['A+', "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
        },

        name: {
            type: String,
            required: [true, "Please provide a first name"],
            trim: true,
            minLength: [3, "Name must be at least 3 characters."],
            maxLength: [100, "Name is too large"],
        },

        emergency_contact: {
            name: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                required: [true, "Please provide an emergency contact number."],
                trim: true,
                unique: [true, "There already exists an account with {VALUE}"],
                validate: [validator.isMobilePhone, "Please provide a valid contact number"],
            },
            relation: String
        },

        serialId: {
            type: String,
            unique: true
        },

        admitted: {
            type: Boolean,
            default: false
        },

        bed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bed',
        },

        invoices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
        }],

        tests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
        }],

        appointments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
        }]
    },
    {
        timestamps: true,
    }
);

patientSchema.pre("save", function (next) {

    let doc = this

    if (this.isNew) {

        let currentDate = moment().format('YYMMDD');

        mongoose.model('Patient').findOne({
            serialId: { $regex: ('^' + currentDate) }
        },
            {},
            { sort: { 'serialId': -1 } },
            function (err, lastUser) {
                if (err) {
                    return next(err);
                }
                let serialNumber = currentDate + 'P' + '00001';
                if (lastUser) {
                    let lastSerialNumber = parseInt(lastUser.serialId.substring(9), 10);
                    serialNumber = currentDate + "P" + ('00000' + (lastSerialNumber + 1)).slice(-5);
                }
                doc.serialId = serialNumber;
                next();
            });
    } else {
        next();
    }
});

const Patient = mongoose.model("Patient", patientSchema)

module.exports = Patient