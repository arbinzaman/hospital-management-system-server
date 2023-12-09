const MainCategory = require("../../models/categories/MainCategory");
const SubCategory = require("../../models/categories/SubCategory");
const TestName = require("../../models/categories/TestName");

exports.createCategoryService = async (data) => {

    const category = await MainCategory.create(data);
    category.save();
    return category;

}


exports.allCategoryService = async (pagination) => {

    const { key, value } = pagination

    const query = key ? {
        [key]: {
            $regex: value,
            $options: 'i'
        }
    } : {};

    const total = await MainCategory.find(query).countDocuments()

    const category = await MainCategory.find(query, { subCategories: 0 })
    return { category, total };
}

exports.getCategoryByIdService = async (id) => {
    const category = await MainCategory.findById(id).populate({
        path: 'subCategories',
        select: '-__v -mainCategory'
    });
    return category;
}

exports.deleteCategoryService = async (id) => {

    const subCategories = await SubCategory.find({ mainCategory: id }, { _id: 1 });

    await SubCategory.deleteMany({ mainCategory: id });

    await TestName.deleteMany({ subCategory: { $in: subCategories } })

    const category = await MainCategory.deleteOne({ _id: id });
    return category;
}

exports.updateCategoryService = async (id, data) => {
    return await MainCategory.updateOne({ _id: id }, { $set: data })
}