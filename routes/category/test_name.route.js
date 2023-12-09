const express = require('express');
const { createTestName, updateTestName, deleteTestName, testNameById } = require('../../controllers/category/test_name.controller');
const verifyToken = require('../../middlewares/verifyToken');
const router = express.Router();

router.post('/create', verifyToken, createTestName)

router.route("/:id")
    .get(verifyToken, testNameById)
    .patch(verifyToken, updateTestName)
    .delete(verifyToken, deleteTestName);


module.exports = router;