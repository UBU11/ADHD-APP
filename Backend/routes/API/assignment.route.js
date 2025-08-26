import express from "express";
import getAssignments from "../../controllers/assignmentController.js";
import requireAuth from "../../middleware/requireAuth.js";

const router = express.Router();

// api/assignments

router.get("/", requireAuth, getAssignments);

export default router;
