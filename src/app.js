import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import commentRouter from "./routes/comment.js";
import curationRouter from "./routes/curating.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.use("/products", productRouter);

app.use("/comments", commentRouter);

app.use("/curations", curationRouter);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
