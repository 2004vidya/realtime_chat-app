import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { SearchContacts } from "../controllers/ContactsController.js";


const ContactsRoutes = Router();

ContactsRoutes.post("/search", verifyToken, SearchContacts);

export default ContactsRoutes;