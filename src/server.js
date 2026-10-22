require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const app = require("./app.js");
const connectDB = require("./confiG/db.js");

const port = process.env.PORT || 5000;


const startServer = async() => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`✅ Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start the server");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();