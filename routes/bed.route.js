const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bed.controller');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyToken = require('../middlewares/verifyToken');
const paginate = require('../middlewares/paginate');

router.post('/create', verifyAdmin, bedController.createBed);

router.get('/', verifyToken, paginate, bedController.getAllBed);

router.get('/available', verifyToken, bedController.getAvailableBeds);

router.patch('/assign/:id', verifyToken, bedController.assignBed)

router.patch('/unassign/:id', verifyToken, bedController.unassignBed)

router.post('/category/create', verifyAdmin, bedController.createBedCategory);

router.get('/category', verifyToken, paginate, bedController.getAllBedCategories);

router.route('/:id')
    .get(verifyAdmin, bedController.getBed)
    .patch(verifyAdmin, bedController.updateBed)
    .delete(verifyAdmin, bedController.deleteBed);

router.route('/category/:id')
    .get(verifyAdmin, bedController.getBedCategory)
    .patch(verifyAdmin, bedController.updateBedCategory)
    .delete(verifyAdmin, bedController.deleteBedCategory);

module.exports = router;