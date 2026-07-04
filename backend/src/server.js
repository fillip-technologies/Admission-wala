import { envConfig } from "./configs/envConfig.js";
import app from "./app.js";
import { connectDb } from "./configs/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
        await connectDb();
    } catch (error) {
        console.log("Failed to start server");
        console.error(error);
        process.exit(1);
    }
};

startServer();