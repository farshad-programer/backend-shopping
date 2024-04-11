import multer from "multer";
import { mkdirp } from "mkdirp";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  // -------------------------------------
  destination: function (req, file, cb) {
    mkdirp("./public/uploads").then((made) => {
      cb(null, "./public/uploads");
    });
  },
  // ----------------------------------------
  filename: function (req, file, cb) {
    file.originalname;
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
// -----------------------------------
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("format file"), false);
  }
};
// ---------------------------------------
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
  storage,
});
export default upload;
