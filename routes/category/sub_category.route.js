const express = require('express')
const router = express.Router()
const subCatController = require('../../controllers/category/sub_category.controller')
const verifyToken = require('../../middlewares/verifyToken')

router.use(verifyToken)

router.get('/all', subCatController.allCategory)

router.post('/create', subCatController.createSubCategory)

router.route('/:categoryId')
    .get(subCatController.getSubCategoryById)
    .patch(subCatController.updateSubCategory)
    .delete(subCatController.deleteSubCategory)

module.exports = router