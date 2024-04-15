
const express = require("express")
const router = express.Router()
const {createEmployee, getAllEmployee} = require("../../controller/employee_controller/employee.controller")
const {authorize} = require("../../middleware/authorization")

router.post("/create",authorize(['user']), createEmployee)

router.get("/get_all",authorize(['user', 'admin']), getAllEmployee)


module.exports = router

