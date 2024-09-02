const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder tempat menyimpan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan dengan nama unik
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Hanya menerima gambar
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Maksimal ukuran file 1MB
  fileFilter: fileFilter
});

module.exports = upload;
