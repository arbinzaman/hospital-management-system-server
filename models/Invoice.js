const moment = require("moment/moment");
const mongoose = require("mongoose")

const invoiceSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: [true, "Please provide patient Id"]
    },

    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    }],

    bedding: {
        bed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bed"
        },
        charge: {
            type: Number,
            default: 0,
            min: [0, "Bedding charge cannot be negative"],
            validator: {
                validator: function () {
                    if (this.bed) return this.charge === (this.bed.charge * this.days);
                    return true;
                }
            }
        },
        days: {
            type: Number,
            default: 0,
            min: [0, "Bedding days cannot be negative"]
        }
    },

    medicineCharge: {
        type: Number,
        default: 0,
        min: [0, "Medicine charge cannot be negative"]
    },

    serviceCharge: {
        type: Number,
        default: 0,
        min: [0, "Service charge cannot be negative"]
    },

    otherCharges: [
        {
            name: String,
            amount: {
                type: Number,
                min: [0, "Amount cannot be negative"]
            }
        }
    ],

    sub_total: {
        type: Number,
        required: [true, "Please Provide total value"],
        min: [0, "Sub-total amount cannot be negative"],
    },

    discount: {
        type: Number,
        default: 0,
        min: [0, "Discount value cannot be negative"],
    },

    VAT: {
        vatPercentage: {
            type: Number,
            default: 0,
            min: [0, "VAT percentage cannot be negative"],
            max: [100, 'VAT percentage cannot be more than 100']
        },
        vatAmount: {
            type: Number,
            default: 0,
            min: [0, "VAT amount cannot be negative"],
            validate: {
                validator: function () {
                    const vatAmount = Math.ceil(this.sub_total * (this.VAT.vatPercentage / 100));
                    return vatAmount === this.VAT.vatAmount;
                },
                message: "VAT amount value is incorrect. Please ensure that it is calculated correctly."
            }
        }
    },

    paidAmount: {
        type: Number,
        default: 0,
        min: [0, "Paid Amount cannot be negative"],
    },

    dueAmount: {
        type: Number,
        default: 0,
        min: [0, "Due Amount cannot be negative"],
        validate: {
            validator: function () {
                const dueAmount = this.grand_total - this.paidAmount;
                return dueAmount === this.dueAmount;
            },
            message: "Due Amount value is incorrect. Please ensure that it is calculated correctly."
        }
    },

    deliveryDate: String,
    remarks: String,


    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PC",
    },

    appointedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    total_PC_Commission: {
        type: Number,
        min: [0, "Total PC Commission cannot be negative"],
    },

    grand_total: {
        type: Number,
        required: [true, "Please provide grand-total value"],
        min: [0, "Grand-total amount cannot be negative"],
        validate: {
            validator: function () {
                const grand_total = this.sub_total - this.discount + this.VAT.vatAmount;
                return grand_total === this.grand_total;
            },
            message:
                "Grand-total value is incorrect. Please ensure that it is calculated correctly.",
        },
    },

    serialId: {
        type: String,
        unique: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
})

invoiceSchema.pre("save", function (next) {

    let doc = this

    if (this.isNew) {

        let currentDate = moment().format('YYMMDD');

        mongoose.model('Invoice').findOne({
            serialId: { $regex: ('^' + currentDate) }
        },
            {},
            { sort: { 'serialId': -1 } },
            function (err, lastUser) {
                if (err) {
                    return next(err);
                }
                let serialNumber = currentDate + "INV" + '00001';
                if (lastUser) {
                    let lastSerialNumber = parseInt(lastUser.serialId.substring(12), 10);
                    serialNumber = currentDate + "INV" + ('00000' + (lastSerialNumber + 1)).slice(-5);
                }
                doc.serialId = serialNumber;
                next();
            });
    } else {
        next();
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice