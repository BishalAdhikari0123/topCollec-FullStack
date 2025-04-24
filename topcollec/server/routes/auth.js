import {Router} from "express";
import validate from "../middlewares/validate.js";
import userValidation from "../validations/auth.js";
import authController from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/register",validate(userValidation.register),authController.register);

authController.post("verify-email",validate(userValidation.verifyEmail,authController.verifyEmail));

export default authRouter;