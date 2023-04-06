const util = require("util");
const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images'); // storage location
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = util.promisify(multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } }).single('image'));

module.exports = { upload };
