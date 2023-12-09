const Bed = require("../models/Bed");
const BedCategory = require("../models/BedCategory");
const Patient = require("../models/Patient");

exports.createBedCategoryService = async (data) => {
    return await BedCategory.create(data);
}

exports.getBedCategoryService = async (id) => {
    return await BedCategory.findById(id, { __v: 0 });
}

exports.getAllBedCategoriesService = async (pagination) => {

    const query = pagination.key ? { [pagination.key]: { $regex: pagination.value, $options: "i" } } : {};

    const total = await BedCategory.countDocuments(query);

    const bedCategories = await BedCategory.find(query, {
        __v: 0,
    })
        .skip(pagination.startIndex)
        .limit(pagination.limit);
    return { bedCategories, total };
}

exports.updateBedCategoryService = async (id, data) => {
    return await BedCategory.updateOne({ _id: id }, { $set: data })
}

exports.deleteBedCategoryService = async (id) => {
    return await BedCategory.findByIdAndDelete(id);
}

exports.createBedService = async (data) => {
    return await Bed.create(data);
}

exports.getBedService = async (id) => {
    return await Bed.findById(id, { __v: 0 })
        .populate('category', { __v: 0 })
        .populate('patient', { name: 1 });
}

exports.getAllBedsService = async (pagination) => {

    const { key, value } = pagination;

    const query = key ? {
        [key]: (value === 'true' || value === 'false')
            ? value
            : {
                $regex: value,
                $options: 'i'
            }
    } : {};

    const total = await Bed.countDocuments(query);

    const beds = await Bed.find(query, {
        __v: 0,
    })
        .populate('category', { __v: 0 })
        .populate('patient', { name: 1 })
        .sort({ "serialId": -1 })
        .skip(pagination.startIndex)
        .limit(pagination.limit);
    return { beds, total };
}

exports.updateBedService = async (id, data) => {
    return await Bed.updateOne({ _id: id }, { $set: data })
}

exports.deleteBedService = async (id) => {
    return await Bed.findByIdAndDelete(id);
}

exports.assignBedService = async (id, data) => {
    await Patient.updateOne({ _id: data.patient }, { $set: { admitted: true, bed: id } })
    return await Bed.updateOne({ _id: id }, { $set: { patient: data.patient, status: false } })
}

exports.unassignBedService = async (id, data) => {
    await Patient.updateOne({ _id: data.patient }, { $set: { admitted: false, bed: null } })
    return await Bed.updateOne({ _id: id }, { $set: { patient: null, status: true } })
}

exports.getAllAvailableBedService = async () => {
    return await Bed.find({ status: true }, { name: 1, })
}
