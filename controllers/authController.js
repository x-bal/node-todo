const models = require("../models/index")
const User = models.User
const jwt = require("jsonwebtoken")

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ where: { username: username } })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            const isPasswordValid = await user.comparePassword(password)
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" })
            }

            const token = jwt.sign({ userId: user.id }, "secret_token", {
                expiresIn: "1h",
            })
            return res
                .status(200)
                .json({ message: "Login successful", token: token, user: user })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }
}

module.exports = new AuthController()
