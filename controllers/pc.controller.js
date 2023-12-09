const { registerService, getAllService, getPCByIdService, updatePCService, deletePCService } = require("../services/pc.service");

exports.register = async (req, res) => {
    try {

        const pc = await registerService(req.body, req.user);
        res.status(201).json({
            status: 'success',
            data: {
                pc,
            }
        });


    } catch (err) {
        res.status(500).json({
            status: 'fail',
            error: err.message,
        });
    }
}

exports.getAll = async (req, res) => {
    try {

        const { page, limit, key, value } = req.pagination

        const { pcs, total } = await getAllService(req.pagination);

        res.status(200).json({
            status: 'success',
            data: pcs,
            page,
            total,
            count: limit,
            key,
            value,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            error: err.message,
        });
    }
}

exports.gePCById = async (req, res) => {
    try {

        const pc = await getPCByIdService(req.params.id);

        if (!pc) {
            return res.status(404).json({
                status: 'fail',
                message: 'PC not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: pc,

        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            error: err.message,
        });
    }
}

exports.updatePC = async (req, res) => {
    try {

        const { id } = req.params;

        const pc = await updatePCService(id, req.body);

        if (!pc.matchedCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'PC not found',
            });
        }
        else if (pc.modifiedCount === 0) {
            return res.status(304).json({
                status: 'fail',
                message: 'PC not modified',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'PC updated successfully',
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            error: err.message,
        });
    }
}

exports.deletePC = async (req, res) => {
    try {

        const { id } = req.params;

        const pc = await deletePCService(id);

        if (!pc.deletedCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'PC not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'PC deleted successfully',
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            error: err.message,
        });
    }
}