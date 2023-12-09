const SubCategory = require("../../models/categories/SubCategory");
const TestName = require("../../models/categories/TestName");

exports.createTestNameService = async (testNameData) => {
    const testName = await TestName.create(testNameData);

    await SubCategory.findByIdAndUpdate(testNameData.subCategory, {
        $push: {
            tests: testName._id,
        }
    });

    testName.save();

    return testName;
}

exports.updateTestNameService = async (id, data) => {
    return await TestName.updateOne({ _id: id }, { $set: data });
}

exports.deleteTestNameService = async (id) => {
    await SubCategory.updateOne({ tests: id }, { $pull: { tests: id } });
    return await TestName.deleteOne({ _id: id });
}

exports.testNameByIdService = async (id) => {
    return await TestName.findById(id).populate({
        path: 'subCategory',
        select: 'name'
    });
}
