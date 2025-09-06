const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");

const app = express();

// PORT động từ Render, fallback về 5000 khi chạy local
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cho phép truy cập ảnh trong thư mục uploads
app.use("/uploads", express.static("uploads"));

// Cấu hình nơi lưu ảnh với multer
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // tên file duy nhất
    }
});
const upload = multer({ storage: storage });

// Kết nối MongoDB
const uri = "mongodb+srv://bdx:123456789%40@cluster0.xmmbfgf.mongodb.net/qlthuvien?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function startServer() {
    try {
        await client.connect();
        console.log("✅ Kết nối MongoDB thành công");

        const db = client.db("qlthuvien");
        const collection = db.collection("qlsach");

        // API lấy danh sách sách
        app.get("/sach", async (req, res) => {
            try {
                const sach = await collection.find({}).toArray();
                res.json(sach);
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi lấy sách");
            }
        });

        // API thêm sách (có upload ảnh)
        app.post("/sach", upload.single("cover"), async (req, res) => {
            try {
                const newSach = {
                    title: req.body.title,
                    author: req.body.author,
                    category: req.body.category,
                    published_year: parseInt(req.body.published_year),
                    status: req.body.status,
                    quantity: parseInt(req.body.quantity),
                    cover_image: req.file
                        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
                        : null
                };

                await collection.insertOne(newSach);
                res.json({ message: "✅ Thêm sách thành công", sach: newSach });
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi thêm sách");
            }
        });

        // Chạy server
        app.listen(PORT, () => {
            console.log(`🚀 Server chạy tại port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Kết nối MongoDB thất bại:", err);
    }
}

startServer();
