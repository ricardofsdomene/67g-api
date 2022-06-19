import express from "express";
const router = express.Router();

import { get, create, deleteProject } from "../controller/project";

router.post("/create", create);
// router.put("/:slug", update);
router.get("/:slug", get);

router.delete("/:id", deleteProject);

export default router;
