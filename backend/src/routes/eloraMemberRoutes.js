import express from "express";
import {
  createEloraMember,
  deleteEloraMember,
  getAllEloraMembers,
  getEloraMemberById,
  updateEloraMember,
} from "../controllers/eloraMemberController.js";

const router = express.Router();

router.route("/").get(getAllEloraMembers).post(createEloraMember);

router
  .route("/:id")
  .get(getEloraMemberById)
  .put(updateEloraMember)
  .delete(deleteEloraMember);

export default router;
