import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // Allows your frontend to connect

// Exact endpoint and JSON required by the sheet
app.get('/api/health', (req, res) => {
    res.status(200).json({
        "status": "success",
        "message": "Campus Service Request API is running"
    });
});

app.listen(5000);