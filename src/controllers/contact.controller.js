import { StatusCodes } from "http-status-codes";
import { contactImage } from "../utils/image_upload/contact_image.util.js";
import {createData} from "../utils/db_call_functions/contact.db.js"
import contact from "../models/contact.module.js";


const createContactImages = (req, res) => {
    try {
        res.status(StatusCodes.OK).json(contactImage(req));
    } catch (error) {
        res.json(error.message)
    }
}


const createContactForm = (req, res) => {
    try {
        const data = createData(req, contact);
        res.status(data.status).json(data)
    } catch (error) {
        res.json(error.message)
    }
}

export {createContactImages, createContactForm};