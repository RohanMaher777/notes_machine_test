const db = require("../../../config/db.config");
const User = db.user;
const bcrypt = require("bcryptjs");
const Token = require("../../middleware/generate_token")


exports.user_login = async (req, res,) => {

    try {
        if (!req.body.email) {
            return res.status(400).json({ error: 'Please enter your email ' });
        }
        if (!req.body.password) {
            return res.status(400).json({ error: 'please enter your password' });
        }
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const verifyEmail = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!verifyEmail) {
            res.status(400).json({ message: 'Please verify your email first then try to login' })
        }

        const access_token = Token.generateAccessToken(user)
        const refresh_token = Token.generateRefreshToken()
        const Refresh_token_expiration = Date.now() + (7 * 24 * 60 * 60 * 1000);

        user.refreshToken = refresh_token
        user.refreshToken_Expiration = Refresh_token_expiration
        await user.save()
        const { name, email, mobile } = user
        const user_data = {
            name: name,
            email: email,
            mobile: mobile
        }

        res.cookie("refresh_token", refresh_token, { httpOnly: true })

        return res.status(200).json({
            status : true,
            message: "Successfully login",
            data: user_data,
            access_token: access_token
        })
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            status : false,
            message: 'Internal Server error' 
        });
    }
}



