const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// PORT động từ Render, fallback về 5000 khi chạy local
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // tăng limit cho ảnh Base64 lớn

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

        // API thêm sách (lưu Base64 trực tiếp)
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
                    cover_image: cover_image || null // Base64
                };

                await collection.insertOne(newSach);
                res.json({ message: "✅ Thêm sách thành công", sach: newSach });
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi thêm sách");
            }
        });

        // API sửa sách theo id
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

                await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedSach }
                );

                res.json({ message: "✅ Sửa sách thành công", sach: updatedSach });
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi sửa sách");
            }
        });

        // API xóa sách theo id
        app.delete("/sach/:id", async (req, res) => {
            try {
                const id = req.params.id;
                await collection.deleteOne({ _id: new ObjectId(id) });
                res.json({ message: "✅ Xóa sách thành công" });
            } catch (err) {
                console.error(err);
                res.status(500).send("❌ Lỗi server khi xóa sách");
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
