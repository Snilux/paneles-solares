import express from "express";
import cors from "cors";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
// Routes
import indexRoutes from "./routes/index-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Config routes
app.use("/", indexRoutes);

app.use((req, res) => {
  res.status(404).render("error", { title: "Error" });
});

export default app;
