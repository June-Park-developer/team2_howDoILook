import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { assert } from "superstruct";
import { CreateComment } from "../utils/structs.js";
import prisma from "../utils/prismaClient.js";

const curationRouter = express.Router();

curationRouter.route("/:curationId/comments").post(
  asyncHandler(async (req, res) => {
    const { curationId } = req.params;
    assert(req.body, CreateComment);

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        password: req.body.password,
        curatingId: curationId,
      },
    });
    console.log(comment);
    //return json struct
    res.send(comment);
  })
);

export default curationRouter;
