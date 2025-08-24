const express = require("express");
const router = express.Router();
const assignmentController = require("../../controllers/assignmentController");
const requireAuth = require("../../middleware/requireAuth");

// api/assignments

router.get("/", requireAuth, assignmentController.getAssignments);

module.exports = router;
