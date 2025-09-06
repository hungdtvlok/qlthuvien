// server.js
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb"); // ObjectId để xử lý id
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cho phép truy cập ảnh trong thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

// Cấu hình Multer để lưu ảnh
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
        // Kết nối MongoDB
        await client.connect();
        console.log("✅ Kết nối MongoDB thành công");

        const db = client.db("qlthuvien");
        const collection = db.collection("qlsach");

        // ========================
        // API LẤY DANH SÁCH SÁCH
        // ========================
        app.get("/sach", async (req, res) => {
            try {
                const sach = await collection.find({}).toArray();
                res.json(sach);
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi lấy sách");
            }
        });

        // ========================
        // API THÊM SÁCH (UPLOAD ẢNH)
        // ========================
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

        // ========================
        // API SỬA SÁCH (UPLOAD ẢNH MỚI NẾU CÓ)
        // ========================
        app.put("/sach/:id", upload.single("cover"), async (req, res) => {
            try {
                const { id } = req.params;
                const updateData = {
                    title: req.body.title,
                    author: req.body.author,
                    category: req.body.category,
                    published_year: parseInt(req.body.published_year),
                    status: req.body.status,
                    quantity: parseInt(req.body.quantity)
                };
                if (req.file) {
                    updateData.cover_image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
                }
                const result = await collection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updateData },
                    { returnDocument: "after" }
                );
                res.json({ message: "✅ Sửa sách thành công", sach: result.value });
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi sửa sách");
            }
        });

        // ========================
        // API XÓA SÁCH
        // ========================
        app.delete("/sach/:id", async (req, res) => {
            try {
                const { id } = req.params;
                await collection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "✅ Xóa sách thành công" });
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi xóa sách");
            }
        });

        // ========================
        // START SERVER
        // ========================
        app.listen(PORT, () => {
            console.log(`🚀 Server chạy tại port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Kết nối MongoDB thất bại:", err);
    }
}

startServer();
