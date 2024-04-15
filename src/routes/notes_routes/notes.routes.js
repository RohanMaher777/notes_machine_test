
const express = require("express")
const router = express.Router()
const {createNotes, getAllNotes, get_notes_by_id, update_notes_by_id, delete_user, get_note_by_search} = require("../../controller/notes_controller/notes.controller")
const {authorize} = require("../../middleware/authorization")

router.post("/",authorize(['user', 'admin']), createNotes)

router.get("/",authorize(['user', 'admin']), getAllNotes)

router.get("/:note_id",authorize(['user', 'admin']), get_notes_by_id)

router.put("/:note_id", authorize(['user', 'admin']), update_notes_by_id)

router.delete("/:note_id",authorize(['user', 'admin']), delete_user)

router.get("/:text", authorize(["user", 'admin']), get_note_by_search)


module.exports = router

