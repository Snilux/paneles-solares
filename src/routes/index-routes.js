import express from "express";
import indexController from "../controllers/index-controller.js";

const router = express.Router();

router.get("/", indexController.renderIndexPage);

router.get("/cotizador", indexController.renderQuoterPage);

router.post("/cotizador", indexController.calculateQuote);

export default router;
