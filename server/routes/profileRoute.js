import { Router } from "express";
import {changeName, changeProfileImage} from "../controllers/profile.js";
import { auth } from "../middlewares/auth.js";

const profileRoute = Router();

profileRoute.patch("/update-profile", auth, changeProfileImage);
profileRoute.patch("/update-name", auth, changeName);

export default profileRoute;