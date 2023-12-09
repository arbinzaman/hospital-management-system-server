const Test = require("../models/Test");
const Patient = require("../models/Patient");
const fs = require('fs');
const path = require('path');

exports.findTestByIdService = async (testId) => {
    return await Test.findById(testId).populate([
        {
            path: "category",
            select: "name type nature -_id"
        },
        {
            path: "patient",
            select: "name age gender -_id serialId"
        },
        {
            path: "createdBy",
            select: "firstName lastName -_id"
        },
        {
            path: "invoiceId",
            select: "-_id dueAmount",
            populate: {
                path: 'referredBy',
                select: 'name -_id'
            }
        },
        {
            path: "results.test",
        }
    ]).select("-__v");
}

exports.updateFileUrlService = async (req) => {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (test.file_url) {
        const previousFilePath = path.join(__dirname, '..', test.file_url.replace(`${req.protocol}://${req.get('host')}/`, ''));
        fs.unlink(previousFilePath, (err) => {
            if (err) {
                return err;
            }
        });
    }

    const url = `${req.protocol}://${req.get('host')}/${req.file.path}`

    await Test.updateOne({ _id: test._id }, { $set: { file_url: url, available: true } })

    return url
}

exports.findAllTestsService = async (pagination) => {

    const { startIndex, limit, key, value } = pagination

    const query = key ? {
        [key]: value
    } : {};

    const total = await Test.find(query).countDocuments()

    const tests = await Test.find(query).select("createdAt serialId available").populate([
        {
            path: "category",
            select: "name -_id"
        },
        {
            path: "patient",
            select: "name -_id"
        }
    ]).sort({ serialId: -1 }).skip(startIndex).limit(limit)

    return { tests, total }
}

exports.findByIdAndDeleteService = async (req) => {
    const test = await Test.findByIdAndDelete(req.params.testId);
    if (test.file_url) {
        const previousFilePath = path.join(__dirname, '..', test.file_url.replace(`${req.protocol}://${req.get('host')}/`, ''));
        fs.unlink(previousFilePath, (err) => {
            if (err) {
                return err;
            }
        });
    }
    await Patient.updateOne({ _id: test.patient }, { $pull: { tests: req.params.testId } })
    return test;
}

exports.removeFileService = async (req) => {
    const test = await Test.findById(req.params.testId);

    if (test.file_url) {
        const previousFilePath = path.join(__dirname, '..', test.file_url.replace(`${req.protocol}://${req.get('host')}/`, ''));
        fs.unlink(previousFilePath, (err) => {
            if (err) {
                return err;
            }
        });
    }

    return await Test.updateOne({ _id: test._id }, { $set: { file_url: '', available: false } })
}

exports.updateTestService = async (id, data) => {

    if (data.type === 'main') {
        await Promise.all(data.results.map(async (result) => {
            await Test.updateOne({
                _id: id,
            },
                {
                    $set: {
                        available: true,
                    }
                })
            return await Test.updateOne(
                { _id: id, "results._id": result.testId },
                { $set: { "results.$.result": result.value } }
            )
        }))
    }

    await Test.updateOne({ _id: id }, { $set: { available: true } })
}

exports.updateImageUrlService = async (req) => {

    const test = await Test.findOne({ _id: req.params.testId });


    if (req.file) {
        if (test.image_url) {

            const previousImagePath = path.join(__dirname, '..', test.image_url.replace(`${req.protocol}://${req.get('host')}/`, ''));
            fs.unlink(previousImagePath, (err) => {
                if (err) {
                    return err;
                }
            });
        }

        const url = `${req.protocol}://${req.get('host')}/${req.file.path}`
        await Test.updateOne({ _id: test._id }, { $set: { image_url: url || test.image_url, remarks: req.body.remarks, available: true } })
    } else {
        await Test.updateOne({ _id: test._id }, { $set: { remarks: req.body.remarks, available: true } })
    }
}