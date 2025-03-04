import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import multer from "multer";
import path from "path";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

const __dirname = path.resolve();
const imageRouter = express.Router();

const allowedExt = [
  "jpg",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "png",
  "webp",
  "avif",
  "bmp",
  "gif",
  "icns",
  "ico",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "files"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const uniqueFileName = `${baseName}-${timestamp}${ext}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldNameSize: 100, fileSize: 5 * 1024 * 1024 },
});

imageRouter.route("/").post(
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const filePath = `${__dirname}/files/${req.file.filename}`;
    const mimeType = await fileTypeFromFile(filePath);
    const ext = mimeType ? mimeType["ext"] : null;
    if (!ext || !allowedExt.includes(ext)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
      const e = new Error("Make sure you are uploading an image type.");
      e.name = "FileExtensionError";
      throw e;
    }

    const downloadPath = `${req.protocol}://${req.get("host")}/download/${
      req.file.filename
    }`;
    res.json({ imageUrl: downloadPath });
  })
);

export default imageRouter;
