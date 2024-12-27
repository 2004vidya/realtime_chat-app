import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getContactsForDMList, SearchContacts } from "../controllers/ContactsController.js";


const ContactsRoutes = Router();

ContactsRoutes.post("/search", verifyToken, SearchContacts);
ContactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDMList)

export default ContactsRoutes;