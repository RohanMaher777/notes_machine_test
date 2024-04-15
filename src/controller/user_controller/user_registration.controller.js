const db = require("../../../config/db.config")
const User = db.user
const jwt = require("jsonwebtoken")
const secret_key = process.env.SECRET_KEY
const bcrypt = require("bcryptjs")



exports.createUser = async (req, res) => {
    const { name, email, mobile, password, confirm_password } = req.body
    try {

        const isEmptykey = Object.keys(req.body).some(key => {
            const value = req.body[key]
            return value === '' || value === null || value === undefined;
        })
        if (isEmptykey) {
            return res.status(400).json({ error: "please do not give empty fileds" })
        }


        if (password !== confirm_password) {
            return res.status(400).json({ error: "Please enter the same password" })
        }
        const existingUser = await User.findOne({
            where: {
                email: email,
            }
        })

        if (existingUser) {
            return res.status(400).json({ 
                status : false,
                error: "User already exist"
             })
        }
        const hashedPassword = await bcrypt.hash(confirm_password, 10)

        const remember_token = jwt.sign({ email: email }, secret_key, { expiresIn: '7d' });

        const creatingUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            mobile: mobile,
            remember_token: remember_token,
        })

        return res.status(200).json({
            status: true,
            message: "User rgister successfully",
            data: creatingUser
        })

    }
    catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}
