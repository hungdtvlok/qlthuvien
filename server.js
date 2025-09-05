const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

// PORT động từ Render, fallback về 5000 khi local
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const uri = "mongodb+srv://bdx:123456789%40@cluster0.xmmbfgf.mongodb.net/qlthuvien?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function startServer() {
    try {
        // Kết nối một lần duy nhất
        await client.connect();
        console.log("✅ Kết nối MongoDB thành công");

        const db = client.db("qlthuvien");
        const collection = db.collection("qlsach");

        // API lấy sách
        app.get("/sach", async (req, res) => {
            try {
                const sach = await collection.find({}).toArray();
                res.json(sach);
            } catch (err) {
                console.error(err);
                res.status(500).send("Lỗi server khi lấy sách");
            }
        });

        // Chạy server
        app.listen(PORT, () => {
            console.log(`✅ Server chạy tại port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Kết nối MongoDB thất bại:", err);
    }
}

startServer();
