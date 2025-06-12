# AnimeLens Backend

Backend Express.js untuk proyek AnimeLens yang berfungsi sebagai penyimpanan sementara gambar untuk pemrosesan dan caching.

## Cara Menjalankan

1. Pastikan Node.js sudah terinstall di komputer Anda.
2. Buka terminal dan arahkan ke folder backend:
   ```
   cd Anime-Lens-BackEnd
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Jalankan server dalam mode development (dengan nodemon):
   ```
   npm run dev
   ```
   atau jalankan server biasa:
   ```
   npm start
   ```
5. Server akan berjalan di port 5000 secara default. Anda dapat mengubah port dengan menambahkan file `.env` dan variabel `PORT`.

## API Endpoints

- `POST /upload`  
  Upload satu file gambar dengan form-data key `image`.  
  Response: JSON dengan nama file yang disimpan.

- `GET /uploads/:filename`  
  Mengakses file gambar yang sudah diupload.

- `DELETE /upload/:filename`  
  Menghapus file gambar yang sudah diupload.

## Catatan

- Folder `uploads/` digunakan untuk menyimpan gambar sementara.
- Pastikan frontend mengakses backend sesuai dengan URL dan port yang benar.
