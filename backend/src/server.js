import dns from "node:dns";
import { envConfig } from "./configs/envConfig.js";
import app from "./app.js";
import { connectDb } from "./configs/db.js";

// Some ISP / local DNS resolvers refuse SRV record lookups, which breaks
// `mongodb+srv://` connections with `querySrv ECONNREFUSED`. Point Node's
// resolver at public DNS (Google + Cloudflare) so Atlas SRV resolves reliably.
// Harmless in the cloud (Render already resolves SRV fine).
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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