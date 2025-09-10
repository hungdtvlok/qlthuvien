const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔑 Lấy MongoDB URI từ biến môi trường
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function startServer() {
    try {
        await client.connect();
        console.log("✅ Kết nối MongoDB thành công");

        const db = client.db("qlthuvien");
        const collection = db.collection("qlsach");

        // Route test
        app.get("/", (req, res) => {
            res.send("🚀 API Quản lý thư viện đang chạy!");
        });

        // Lấy sách
        app.get("/sach", async (req, res) => {
            try {
                const sach = await collection.find({}).toArray();
                res.json(sach);
            } catch (err) {
                res.status(500).send("❌ Lỗi server khi lấy sách");
            }
        });

        // Thêm sách
        app.post("/sach", async (req, res) => {
            try {
                const { title, author, category, published_year, status, quantity, cover_image } = req.body;
                const newSach = {
                    title,
                    author,
                    category,
                    published_year: parseInt(published_year),
                    status,
                    quantity: parseInt(quantity),
                    cover_image: cover_image || null
                };
                await collection.insertOne(newSach);
                res.json({ message: "✅ Thêm sách thành công", sach: newSach });
            } catch {
                res.status(500).send("❌ Lỗi server khi thêm sách");
            }
        });

        // Sửa sách
        app.put("/sach/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const { title, author, category, published_year, status, quantity, cover_image } = req.body;
                const updatedSach = {
                    title,
                    author,
                    category,
                    published_year: parseInt(published_year),
                    status,
                    quantity: parseInt(quantity),
                    cover_image: cover_image || null
                };
                await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedSach });
                res.json({ message: "✅ Sửa sách thành công", sach: updatedSach });
            } catch {
                res.status(500).send("❌ Lỗi server khi sửa sách");
            }
        });

        // Xóa sách
        app.delete("/sach/:id", async (req, res) => {
            try {
                const id = req.params.id;
                await collection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "✅ Xóa sách thành công" });
            } catch {
                res.status(500).send("❌ Lỗi server khi xóa sách");
            }
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server chạy tại port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Kết nối MongoDB thất bại:", err);
    }
}

startServer();
