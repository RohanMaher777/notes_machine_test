
const express = require("express")
const router = express.Router()
const {createUser} = require("../../controller/user_controller/user_registration.controller")
const {user_login} = require("../../controller/user_controller/user_login.controller")
const {generate_access_token} = require("../../services/generate_access_token")

router.post("/register", createUser)

router.post("/login", user_login)

//generating access token with the help of refresh token 

router.post("/gen_access_token", generate_access_token)



module.exports = router

