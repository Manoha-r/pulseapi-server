

const healthCheck = async(req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "API is healthy and running"
        });
    }
    catch (error) {
        res.error(500).json({
            status: "error",
            message: "API is not healthy"
        });
    }
}

exports.checkHealth = healthCheck;