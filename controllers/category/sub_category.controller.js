const { createSubCategoryService, allSubCategoryService, getSubCategoryByIdService, updateSubCategoryService, deleteSubCategoryService } = require("../../services/category/sub_category.service")

exports.createSubCategory = async (req, res) => {
    try {
        const subCategory = await createSubCategoryService(req.body)

        if (!subCategory) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sub Category not created'
            })
        }

        res.status(201).json({
            status: 'success',
            message: 'Sub Category created successfully',
            data: subCategory
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.allCategory = async (req, res) => {
    try {
        const subCategories = await allSubCategoryService(req.pagination)

        if (!subCategories) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sub Categories not found'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Sub Categories found successfully',
            data: subCategories,
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await getSubCategoryByIdService(req.params.categoryId)

        if (!subCategory) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sub Category not found'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Sub Category found successfully',
            data: subCategory
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.updateSubCategory = async (req, res) => {
    try {
        const subCategory = await updateSubCategoryService(req.params.categoryId, req.body)

        if (subCategory.matchedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sub Category not updated'
            })
        }

        if (subCategory.modifiedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sub Category already updated'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Sub Category updated successfully',
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await deleteSubCategoryService(req.params.categoryId)

        if (subCategory.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Sub Category not deleted'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Sub Category deleted successfully',
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}