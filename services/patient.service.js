const Patient = require("../models/Patient");

exports.addNewPatientService = async (patientInfo) => {
    return await Patient.create(patientInfo)
};

exports.findPatientbyIdService = async (_id) => {
    return await Patient.findById(_id).populate([{
        path: "appointments",
        select: "reason paymentCompleted createdAt serialId",
    }, {
        path: "invoices",
        select: "sub_total grand_total createdAt serialId paymentCompleted",
    },
    {
        path: 'bed',
        select: 'name',
        populate: {
            path: 'category',
            select: 'name charge -_id'
        }
    },
    {
        path: "tests",
        select: "createdAt serialId available file_url",
        populate: {
            path: "category",
            select: "name -_id"
        },
        options: { sort: { serialId: -1 } }
    }])
}

exports.getAllPatientsService = async (pagination) => {
    const { startIndex, limit, key, value } = pagination;

    let query = {};

    if (key && value) {
        if (value.toLowerCase() === "true") {
            query[key] = true;
        } else if (value.toLowerCase() === "false") {
            query[key] = false;
        } else {
            query[key] = {
                $regex: value,
                $options: "i",
            };
        }
    }

    const total = await Patient.find(query).countDocuments();

    const patients = await Patient.find(query)
        .select("name phone serialId age bloodGroup gender createdAt admitted")
        .sort({ serialId: -1 })
        .skip(startIndex)
        .limit(limit);

    return { total, patients };
};


exports.deletePatientService = async (_id) => {
    await Patient.deleteOne({ _id })
}