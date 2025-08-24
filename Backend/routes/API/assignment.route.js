import express from "express";
import assignmentController from "../../controllers/assignmentController.js";
import requireAuth from "../../middleware/requireAuth.js";

const router = express.Router();

// api/assignments

router.get("/", requireAuth, assignmentController.getAssignments);

export default router;
