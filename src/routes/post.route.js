const express = require('express');
const postControllers = require('../controllers/post.controllers');

const router = express.Router()

router.get("/get", postControllers.getAll);
router.post("/create", postControllers.create)
router.delete("/delete/:id", postControllers.delete)
router.put("/edit/:id", postControllers.edit)

module.exports = router