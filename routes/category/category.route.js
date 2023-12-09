const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/category/category.controller')
const verifyToken = require('../../middlewares/verifyToken')
const paginate = require('../../middlewares/paginate')

router.use(verifyToken)

router.get('/all', paginate, categoryController.allCategory)

router.post('/create', categoryController.createCategory)

router.route('/:categoryId')
    .get(categoryController.getCategoryById)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

module.exports = router