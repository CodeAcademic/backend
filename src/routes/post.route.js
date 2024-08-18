const express = require("express");
const postControllers = require("../controllers/post.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const authorMiddleware = require("../middlewares/author.middleware");

const router = express.Router();

router.get("/get", postControllers.getAll);
router.post("/create", authMiddleware, postControllers.create);
router.delete("/delete/:id",authMiddleware, authorMiddleware, postControllers.delete);
router.put("/edit/:id",authMiddleware, authorMiddleware, postControllers.edit);
router.get("/get-one/:id", postControllers.getOne);

module.exports = router;
