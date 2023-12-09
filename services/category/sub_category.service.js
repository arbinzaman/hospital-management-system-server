const SubCategory = require("../../models/categories/SubCategory");
const MainCategory = require("../../models/categories/MainCategory");
const TestName = require("../../models/categories/TestName");

exports.createSubCategoryService = async (data) => {

    const subCategory = await SubCategory.create(data);

    await MainCategory.updateOne({ _id: data.mainCategory }, { $push: { subCategories: subCategory._id } })

    subCategory.save();
    return subCategory;
}

exports.allSubCategoryService = async () => {
    const subCategories = await SubCategory.find({}, { __v: 0, mainCategory: 0 })
    return subCategories;
}

exports.getSubCategoryByIdService = async (id) => {
    const subCategory = await SubCategory.findById(id, { __v: 0 }).populate([
        {
            path: 'mainCategory',
            select: 'name'
        },
        {
            path: 'tests',
            select: '-__v -subCategory'
        }
    ]);
    return subCategory;
}

exports.updateSubCategoryService = async (id, data) => {
    return await SubCategory.updateOne({ _id: id }, { $set: data });
}

exports.deleteSubCategoryService = async (id) => {

    await MainCategory.updateOne({ subCategories: id }, { $pull: { subCategories: id } });

    await TestName.deleteMany({ subCategory: id });

    return await SubCategory.deleteOne({ _id: id });
}