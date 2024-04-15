require("dotenv").config();
require("./config/db.config")
const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const port = process.env.PORT;
const Routes = require("./src/routes/main.routes")

const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));


app.use(express.json())
//app.use(multer().none())
app.use(cookieParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", Routes)

//app.use(require("./config/error_handler"))
app.listen(port, () => {
    console.log(`server is running on the ${port}`)
})

