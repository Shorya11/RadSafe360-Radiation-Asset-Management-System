import express from "express";
import multer from "multer";
import {
  getAllGauges,
  getGaugeById,
  createGauge,
  updateGauge,
  deleteGauge,
  uploadGaugeDocument,
} from "../controllers/gaugeController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route("/")
  .get(getAllGauges)
  .post(createGauge);

router.route("/:id")
  .get(getGaugeById)
  .put(updateGauge)
  .delete(deleteGauge);

router.post("/:id/documents", upload.single("file"), uploadGaugeDocument);

export default router;
