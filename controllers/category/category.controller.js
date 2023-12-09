const { createCategoryService, allCategoryService, getCategoryByIdService, deleteCategoryService, updateCategoryService } = require("../../services/category/category.service")

exports.createCategory = async (req, res) => {
    try {
        const category = await createCategoryService(req.body)

        if (!category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category not created'
            })
        }

        res.status(201).json({
            status: 'success',
            message: 'Category created successfully',
            data: category
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
        const { category, total } = await allCategoryService(req.pagination)

        if (!category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category not created'
            })
        }

        res.status(201).json({
            status: 'success',
            message: 'Category created successfully',
            data: category,
            total,
        })
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await getCategoryByIdService(req.params.categoryId)

        if (!category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category not found'
            })
        }

        res.status(201).json({
            status: 'success',
            message: 'Category found successfully',
            data: category
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await deleteCategoryService(req.params.categoryId)

        if (category.deletedCount === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category not found'
            })
        }

        res.status(201).json({
            status: 'success',
            message: 'Category deleted successfully',
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await updateCategoryService(req.params.categoryId, req.body)

        if (!category.matchedCount) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category not found'
            })
        }

        if (!category.modifiedCount) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category not updated'
            })
        }

        res.status(201).json({
            status: 'success',
            message: 'Category updated successfully',
            data: category
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}