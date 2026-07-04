import dns from 'node:dns';
import mongoose from 'mongoose';

// Force public DNS so `mongodb+srv://` SRV lookups work on networks whose
// resolver refuses SRV queries (querySrv ECONNREFUSED). Harmless in the cloud.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDb = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ MONGO_URI is not set — check your .env / Render env vars.");
        return;
    }

    try {
        // serverSelectionTimeoutMS: fail in 10s with the real reason instead of
        // letting queries hang and report a generic "buffering timed out".
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("✅ Mongo connected");
    } catch (err) {
        console.error("❌ Mongo connection failed:", err.message);
    }
}