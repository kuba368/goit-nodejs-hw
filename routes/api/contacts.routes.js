const express = require("express");

const contactsController = require("../../controllers/contacts.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/contacts", auth, contactsController.listContacts);
router.get("/contacts/:id", auth, contactsController.getContactById);
router.post("/contacts", auth, contactsController.addContact);
router.put("/contacts/:id", auth, contactsController.updateContact);
router.patch("/contacts/:id/favorite", auth, contactsController.updateFavorite);
router.delete("/contacts/:id", auth, contactsController.removeContact);

module.exports = router;
