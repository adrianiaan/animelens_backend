// pages/api/upload.js
// Ini adalah Next.js API Route untuk menangani unggahan gambar.

// Impor modul yang diperlukan
import multer from 'multer';
import nextConnect from 'next-connect'; // Next-connect sangat membantu untuk middleware di API Routes
// 'path' dan 'fs' tidak diperlukan karena kita tidak akan menyimpan file ke disk lokal
// import path from 'path';
// import fs from 'fs';

// Konfigurasi Multer:
// Gunakan memoryStorage() karena Vercel Serverless Functions tidak memiliki penyimpanan disk persisten.
// File yang diunggah akan disimpan di memori sementara `req.file.buffer`.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10MB
});

// Buat instance next-connect
const handler = nextConnect();

// Gunakan middleware multer untuk menangani unggahan file tunggal dengan nama field 'image'.
handler.use(upload.single('image'));

// Definisikan handler POST untuk endpoint ini.
// Endpoint ini akan dapat diakses di `/api/upload` di aplikasi Next.js Anda.
handler.post(async (req, res) => {
  // Pastikan ada file yang diunggah
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // File diterima di memori (req.file.buffer).
  // Karena tidak ada penyimpanan disk persisten di Vercel, kita tidak akan menyimpan file di sini.
  // Jika Anda perlu menyimpan file, Anda harus mengintegrasikan dengan layanan cloud storage (misalnya AWS S3, Cloudinary).

  console.log(`File diterima di /api/upload: ${req.file.originalname}, ukuran: ${req.file.size} bytes`);

  // Kirim respons sukses ke frontend
  res.status(200).json({
    message: 'File uploaded successfully (received in memory)',
    filename: req.file.originalname, // Menggunakan nama asli file
    size: req.file.size
  });
});

// Konfigurasi API Route untuk menonaktifkan body parser bawaan Next.js,
// karena Multer akan menangani parsing body.
export const config = {
  api: {
    bodyParser: false, // Penting: Disallow body parsing, Multer yang akan melakukannya
  },
};

export default handler;
