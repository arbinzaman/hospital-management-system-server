const e = require("express");
const PC = require("../models/PC");
const { findUserByEmailService } = require("./user.service");

exports.registerService = async (data, user) => {

    const { _id: addedBy } = await findUserByEmailService(user.email)

    return await PC.create({
        ...data,
        addedBy,
    });
}

exports.getAllService = async (pagination) => {
    const { startIndex, limit, key, value } = pagination

    const query = key ? {
        [key]: {
            $regex: value,
            $options: 'i'
        }
    } : {};

    const total = await PC.find(query).countDocuments()

    const pcs = await PC.find(query, {
        name: 1,
        phone: 1,
        location: 1,
        serialId: 1,
    }).sort({ serialId: -1 }).skip(startIndex).limit(limit);

    return { pcs, total }

}

exports.getPCByIdService = async (id) => {
    return await PC.findById(id)
        .populate([
            {
                path: 'invoices.invoice',
                select: 'serialId createdAt total_PC_Commission',
                populate: [{
                    path: 'patient',
                    select: 'name phone serialId'
                }, {
                    path: 'tests',
                    select: 'name charge pcRate'
                }]
            },
            {
                path: 'addedBy',
                select: 'firstName lastName role email'
            }
        ])
};



exports.updatePCService = async (id, data) => {
    return await PC.updateOne({ _id: id }, { $set: data });
}

exports.deletePCService = async (id) => {
    return await PC.deleteOne({ _id: id });
}

exports.getPCInvoiceService = async (id, invoiceId) => {
    return await PC.find({ _id: id, "invoices.invoice": invoiceId }, {
        invoices: {
            $elemMatch: {
                invoice: invoiceId
            }
        }
    })
}