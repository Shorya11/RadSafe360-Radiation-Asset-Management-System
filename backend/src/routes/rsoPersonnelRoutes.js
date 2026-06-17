import express from "express";
import {
  getAllPersonnel,
  getPersonnelById,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
} from "../controllers/rsoPersonnelController.js";

const router = express.Router();

router.route("/")
  .get(getAllPersonnel)
  .post(createPersonnel);

router.route("/:id")
  .get(getPersonnelById)
  .put(updatePersonnel)
  .delete(deletePersonnel);

export default router;
