import multer from 'multer';
import nextConnect from 'next-connect';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const handler = nextConnect();

handler.use(upload.single('image'));

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded for detection' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filename = Date.now() + '-' + req.file.originalname;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);

    const mlServiceUrl = 'https://web-production-b3332.up.railway.app/predict';

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const headers = formData.getHeaders ? formData.getHeaders() : {};

    const response = await axios.post(mlServiceUrl, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (!response.data || !response.data.predictions) {
      throw new Error('Invalid response format from ML service');
    }

    const detectionResult = {
      predictions: response.data.predictions.map(pred => ({
        title: pred.movie,
        accuracy: pred.confidence,
      })),
      raw: response.data,
    };

    res.status(200).json({ success: true, detectionResult });
  } catch (error) {
    console.error('Error in detection:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error communicating with ML service',
      details: error.message,
      response: error.response ? error.response.data : null,
    });
  } finally {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
