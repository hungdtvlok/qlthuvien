const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

// Cho phép gọi từ Android
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const uri = "mongodb+srv://bdx:123456789%40@cluster0.xmmbfgf.mongodb.net/qlthuvien?retryWrites=true&w=majority&appName=Cluster0"; 
const client = new MongoClient(uri);

app.get("/api/sach", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("qlthuvien");     // database
        const collection = db.collection("qlsach"); // collection

        const sach = await collection.find({}).toArray();
        res.json(sach);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
});

// Chạy server
app.listen(port, () => {
    console.log(`✅ Server chạy tại http://localhost:${port}`);
});
