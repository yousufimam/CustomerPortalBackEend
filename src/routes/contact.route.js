import express from "express";
import multer from "multer";
import * as contactController from "../controllers/contact.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } 
  else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});





router.route("")
  .post(contactController.createContactForm);

router.route("/upload")
    .post(upload.array('contactImages', 5), contactController.createContactImages);


    
export default router;