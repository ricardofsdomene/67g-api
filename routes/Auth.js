import "dotenv/config";
import express from "express";

const router = express.Router();

import jwt from "jsonwebtoken";

const JWT_SECRET = "f1naancial!";

import {
  getAccountStatus,
  getUserById,
  login,
  makeInstructor,
  me,
  register,
  sendEmailTest,
  sessions,
  update,
} from "../controller/auth";

function checkAuthMiddleware(request, response) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({
      error: true,
      code: "token.invalid",
      message: "Token not present.",
    });
  }

  const [, token] = authorization?.split(" ");

  if (!token) {
    return response.status(401).json({
      error: true,
      code: "token.invalid",
      message: "Token not present.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    request.user = decoded.email;

    return next();
  } catch (error) {
    const decoded = jwt.verify(token, JWT_SECRET);
    return response.status(401).json({
      error: decoded.email,
      code: "token.expired",
      message: "Token invalid.",
    });
  }
}

router.post("/session", sessions);

router.get("/user/:userId", getUserById);

router.post("/signup", register);

router.post("/signin", login);

router.get("/email-test", sendEmailTest);

export default router;
