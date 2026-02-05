const multer = require("multer");
const ApiError = require("../utils/ApiError");
const multerStorage = multer.memoryStorage();
const { translate } = require("../utils/translation");

//multer will only accepts image
//using mimetype image/imageExtension
const multerFilterForImage = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/octet-stream"
  )
    cb(null, true);
  else
    cb(new ApiError(translate("Not an image, please upload only Image", req.headers.lang), 400), false);
};


const multerFilterForPDF = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "application/octet-stream")
    cb(null, true); // Accept the file
  else cb(new ApiError( translate("Not a PDF, please upload only PDFs", req.headers.lang), 400), false);
};

const imageConfiguration = multer({
  storage: multerStorage,
  fileFilter: multerFilterForImage,
  limits: { fileSize: 10 * 1024 * 1024 } // Set the limit to 10MB
});

const PDFConfiguration = multer({
  storage: multerStorage,
  fileFilter: multerFilterForPDF,
  limits: { fileSize: 10 * 1024 * 1024 } // Set the limit to 10MB
});

const ImageConfiguration = multer({
  storage: multerStorage,
  fileFilter: multerFilterForImage,
  limits: { fileSize: 10 * 1024 * 1024 } // Set the limit to 10MB
});

const uploadAnyImages = imageConfiguration.any([
  { name: "profilePicture", maxCount: 1 },
]);


const uploadMultipleImagesForChat = imageConfiguration.any([{ name: "media", maxCount: 4 }]);

const uploadSingleImage = (fileKey) => ImageConfiguration.single(fileKey);

const uploadEntityFile = (fileKey) => PDFConfiguration.single(fileKey);

module.exports = {
  uploadAnyImages,
  uploadSingleImage,
  uploadEntityFile,
  uploadMultipleImagesForChat
};