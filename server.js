const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const JWT_SECRET = "secret123";
const PORT = process.env.PORT || 5000;

// ===== MongoDB Mongoose (User) =====
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Kết nối MongoDB (mongoose) thành công"))
  .catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: String,
    phone: String,
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// ===== MongoDB Native (Library) =====
const client = new MongoClient(process.env.MONGO_URI);
let collection;

async function startLibrary() {
    await client.connect();
    console.log("✅ Kết nối MongoDB (library) thành công");
    const db = client.db("qlthuvien");
    collection = db.collection("qlsach");
}
startLibrary();

// ===== Routes User =====
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const existUser = await User.findOne({ username });
        if (existUser) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, phone, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Đăng ký thành công" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Sai tên đăng nhập" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Đăng nhập thành công", token, user: { username: user.username, email: user.email, phone: user.phone } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ===== Routes Library =====
app.get("/sach", async (req, res) => {
    try {
        const sach = await collection.find({}).toArray();
        res.json(sach);
    } catch { res.status(500).send("❌ Lỗi server khi lấy sách"); }
});

app.post("/sach", async (req, res) => {
    try {
        const { title, author, category, published_year, status, quantity, cover_image } = req.body;
        const newSach = { title, author, category, published_year: parseInt(published_year), status, quantity: parseInt(quantity), cover_image: cover_image || null };
        await collection.insertOne(newSach);
        res.json({ message: "✅ Thêm sách thành công", sach: newSach });
    } catch { res.status(500).send("❌ Lỗi server khi thêm sách"); }
});

app.put("/sach/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, author, category, published_year, status, quantity, cover_image } = req.body;
        const updatedSach = { title, author, category, published_year: parseInt(published_year), status, quantity: parseInt(quantity), cover_image: cover_image || null };
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedSach });
        res.json({ message: "✅ Sửa sách thành công", sach: updatedSach });
    } catch { res.status(500).send("❌ Lỗi server khi sửa sách"); }
});

app.delete("/sach/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "✅ Xóa sách thành công" });
    } catch { res.status(500).send("❌ Lỗi server khi xóa sách"); }
});

// ===== Test =====
app.get("/", (req, res) => res.send("🚀 API đang chạy!"));

app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));
