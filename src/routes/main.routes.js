
const express = require("express")
const router = express.Router()
const user = require("./user_routes/user.routes")
const notes = require("./notes_routes/notes.routes")
const employee = require("./employee_routes/employee.routes")


router.use("/users", user)

router.use("/notes", notes)

router.use("/employee", employee)


module.exports = router

