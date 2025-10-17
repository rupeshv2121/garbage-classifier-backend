import axios from 'axios';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import FormData from 'form-data';
import multer from 'multer';
dotenv.config();


const app = express();
const upload = multer();
app.use(cors());

app.post("/predict", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        const response = await axios.post(`${process.env.FAST_API_URL}/predict`, formData, {
            headers: formData.getHeaders(), // Set proper multipart headers
        });

        if (response.status !== 200) {
            const errorText = response.data.error || "Unknown error";
            return res.status(500).json({ error: "FastAPI error: " + errorText });
        }
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Node.js backend listening on port ${PORT}`));
