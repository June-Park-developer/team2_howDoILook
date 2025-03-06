import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import commentRouter from "./routes/comment.js";
import curationRouter from "./routes/curating.js";
import imageRouter from "./routes/image.js";
import styleRouter from "./routes/style.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/styles", styleRouter);
app.use("/comments", commentRouter);

app.use("/curations", curationRouter);

app.use("/images", imageRouter);
app.use("/download", express.static("files"));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
