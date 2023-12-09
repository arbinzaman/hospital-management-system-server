const moment = require('moment');
const Invoice = require("../models/Invoice")
const Patient = require("../models/Patient")
const Test = require("../models/Test")
const { findUserByEmailService } = require("./user.service");
const PC = require('../models/PC');

exports.createInvoiceService = async (info, user, patient) => {
    const { _id: createdBy } = await findUserByEmailService(user.email);

    if (info.paidAmount === 0) {
        info.dueAmount = info.grand_total;
    }

    info = { ...info, createdBy, patient };


    const invoice = await Invoice.create(info);

    const tests = await Promise.all(info.tests.map(async (test) => {

        let testData = {
            category: test._id,
            createdBy,
            patient,
            invoiceId: invoice._id
        }

        if (test.type === "main") {
            const results = await Promise.all(test.tests.map(async (result) => {
                return {
                    test: result,
                    result: ""
                }
            }
            ))
            testData = {
                ...testData,
                results
            }
        }

        const testResult = await Test.create(testData);

        testResult.save();

        return testResult._id;

    }));

    if (info?.referredBy) {
        await PC.updateOne(
            {
                _id: info.referredBy
            },
            {
                $push: {
                    invoices: {
                        invoice: invoice._id,
                        paid: false
                    }
                }
            }
        )
    }

    await Patient.updateOne(
        { _id: patient },
        { $push: { tests: { $each: tests }, invoices: invoice._id } }
    );

    invoice.save();

    return invoice;
};

exports.getAllInvoiceService = async (pagination) => {

    let { startIndex, limit, key, value } = pagination

    const query = key ? {
        [key]: (value === 'true' || value === 'false')
            ? value
            : {
                $regex: value,
                $options: 'i'
            }
    } : {};

    const total = await Invoice.find(query).countDocuments()

    const invoices = await Invoice.find(query).populate({
        path: 'patient',
        select: "name -_id"
    }).select("serialId createdAt dueAmount grand_total").sort({ "serialId": -1 }).skip(startIndex).limit(limit);

    return {
        invoices, total
    }
}

exports.invByIdService = async (id) => {
    return await Invoice.findById(id).populate([
        {
            path: "patient",
            select: "serialId phone name"
        },
        {
            path: "tests",
            select: "name charge pcRate roomNo"
        },
        {
            path: "createdBy",
            select: "phone email role firstName lastName"
        },
        {
            path: "bedding.bed",
            select: "name"
        }
    ])
}

exports.deleteInvoiceService = async (_id) => {
    const invoice = await Invoice.findByIdAndDelete(_id)
    await Patient.updateOne({ _id: invoice.patient }, { $pull: { invoices: _id } })
}

exports.statusUpdateService = async (id, info) => {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
        throw new Error('Invoice not found');
    }

    if (info.paidAmount > invoice.dueAmount) {
        throw new Error('Paid amount cannot be greater than due amount');
    }

    return await Invoice.updateOne(
        { _id: id },
        {
            $inc: {
                paidAmount: info.paidAmount,
                dueAmount: -info.paidAmount,
            },
        }
    );
};



exports.getMonthlyInvoiceService = async () => {
    return await Invoice.find({
        createdAt: {
            $gte: moment().startOf('month').toDate(),
            $lte: moment().endOf('month').toDate()
        }
    }).populate('patient').populate('payments').populate('createdBy');

}