const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: "images/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})

const pdfStorage = multer.diskStorage({
  destination: "pdfs/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})

const imageUploader = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const supportedImage = /png|jpg|webp|jpeg/;
    const extension = path.extname(file.originalname);

    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a png/jpg image"));
    }
  },
  limits: {
    fileSize: 5000000,
  }
});

const pdfUploader = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    const supportedPdf = /pdf/;
    const extension = path.extname(file.originalname);

    if (supportedPdf.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a pdf file"));
    }
  },
  limits: {
    fileSize: 5000000,
  }
});

module.exports = { imageUploader, pdfUploader };
