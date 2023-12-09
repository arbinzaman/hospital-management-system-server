const { createBedCategoryService, getBedCategoryService, getAllBedCategoriesService, updateBedCategoryService, deleteBedCategoryService, createBedService, getBedService, getAllBedsService, updateBedService, deleteBedService, getAllAvailableBedService, assignBedService, unassignBedService } = require("../services/bed.service")

exports.createBedCategory = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bedCategory = await createBedCategoryService(req.body);

        bedCategory.save();

        res.status(201).json({
            status: "success",
            message: "Bed Category created successfully",
            data: bedCategory
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getBedCategory = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bedCategory = await getBedCategoryService(req.params.id);

        res.status(200).json({
            status: "success",
            data: bedCategory
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getAllBedCategories = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { bedCategories, total } = await getAllBedCategoriesService(req.pagination);

        res.status(200).json({
            status: "success",
            data: bedCategories,
            total, page
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.updateBedCategory = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bedCategory = await updateBedCategoryService(req.params.id, req.body);

        if (!bedCategory.matchedCount) {
            return res.status(404).json({
                status: "fail",
                message: "Bed Category not found"
            })
        }

        if (!bedCategory.modifiedCount) {
            return res.status(400).json({
                status: "fail",
                message: "Bed Category not modified"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Bed Category updated successfully",
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.deleteBedCategory = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bedCategory = await deleteBedCategoryService(req.params.id);

        if (!bedCategory) {
            return res.status(404).json({
                status: "fail",
                message: "Bed Category not found"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Bed Category deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}


exports.createBed = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bed = await createBedService(req.body);

        bed.save();

        res.status(201).json({
            status: "success",
            message: "Bed created successfully",
            data: bed
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getBed = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bed = await getBedService(req.params.id);

        res.status(200).json({
            status: "success",
            data: bed
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getAllBed = async (req, res) => {
    try {

        const { page } = req.pagination;

        const { beds, total } = await getAllBedsService(req.pagination);

        res.status(200).json({
            status: "success",
            data: beds,
            total, page
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.updateBed = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bed = await updateBedService(req.params.id, req.body);

        if (!bed.matchedCount) {
            return res.status(404).json({
                status: "fail",
                message: "Bed not found"
            })
        }

        if (!bed.modifiedCount) {
            return res.status(400).json({
                status: "fail",
                message: "Bed not modified"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Bed updated successfully",
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.deleteBed = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized"
            })
        }

        const bed = await deleteBedService(req.params.id);

        if (!bed) {
            return res.status(404).json({
                status: "fail",
                message: "Bed not found"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Bed deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.getAvailableBeds = async (req, res) => {
    try {

        const beds = await getAllAvailableBedService();

        res.status(200).json({
            status: "success",
            data: beds,
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.assignBed = async (req, res) => {
    try {

        const bed = await assignBedService(req.params.id, req.body);

        if (!bed.matchedCount) {
            return res.status(404).json({
                status: "fail",
                message: "Bed not found"
            })
        }

        if (!bed.modifiedCount) {
            return res.status(400).json({
                status: "fail",
                message: "Bed not modified"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Bed assigned successfully",
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}

exports.unassignBed = async (req, res) => {
    try {

        const bed = await unassignBedService(req.params.id, req.body);

        if (!bed.matchedCount) {
            return res.status(404).json({
                status: "fail",
                message: "Bed not found"
            })
        }

        if (!bed.modifiedCount) {
            return res.status(400).json({
                status: "fail",
                message: "Bed not modified"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Bed unassigned successfully",
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error: error.message
        })
    }
}