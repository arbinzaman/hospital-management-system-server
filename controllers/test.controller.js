const { updateFileUrlService, findAllTestsService, findTestByIdService, findByIdAndDeleteService, removeFileService, updateTestService, updateImageUrlService } = require("../services/test.service");

exports.uploadTestFile = async (req, res) => {
    try {

        const imageUrl = await updateFileUrlService(req);

        res.status(200).json({
            status: "success",
            message: "File Uploaded Successfully",
            imageUrl
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
};

exports.allTests = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { tests, total } = await findAllTestsService(req.pagination)

        res.status(200).json({
            status: "success",
            message: "All Tests",
            total, page,
            data: tests
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getTest = async (req, res) => {
    try {

        const test = await findTestByIdService(req.params.testId);

        res.status(200).json({
            status: "success",
            message: "Test",
            data: test
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.deleteTest = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(403).json({
                status: "fail",
                error: "You are not authorized to perform this action"
            })
        }

        const test = await findByIdAndDeleteService(req);

        res.status(200).json({
            status: "success",
            message: `Test ${test?.serialId} Deleted Successfully`
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.removeFile = async (req, res) => {
    try {

        const test = await removeFileService(req);

        if (!test?.modifiedCount) {
            return res.status(500).json({
                status: "fail",
                error: "Something went wrong"
            })
        }

        res.status(200).json({
            status: "success",
            message: "File Removed Successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.updateTest = async (req, res) => {
    try {

        await updateTestService(req.params.testId, req.body);

        res.status(200).json({
            status: "success",
            message: "Test Updated Successfully",
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.updateTestImage = async (req, res) => {
    try {

        await updateImageUrlService(req)

        res.status(200).json({
            status: "success",
            message: "Picture Updated Sucessfully",
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}