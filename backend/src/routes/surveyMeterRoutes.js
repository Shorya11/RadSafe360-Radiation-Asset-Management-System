import express from "express";
import multer from "multer";
import {
  getAllSurveyMeters,
  getSurveyMeterById,
  createSurveyMeter,
  updateSurveyMeter,
  deleteSurveyMeter,
  uploadSurveyMeterDocument,
} from "../controllers/surveyMeterController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route("/")
  .get(getAllSurveyMeters)
  .post(createSurveyMeter);

router.route("/:id")
  .get(getSurveyMeterById)
  .put(updateSurveyMeter)
  .delete(deleteSurveyMeter);

router.post("/:id/documents", upload.single("file"), uploadSurveyMeterDocument);

export default router;
