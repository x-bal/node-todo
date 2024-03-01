const jwt = require("jsonwebtoken")
const { User } = require("../models")

const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        // Verifikasi token
        const decodedToken = jwt.verify(token, "secret_token")

        // Ambil ID pengguna dari token
        const userId = decodedToken.userId

        // Cari pengguna berdasarkan ID
        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Tambahkan informasi pengguna ke objek permintaan (request)
        req.user = user

        // Lanjutkan ke middleware atau controller berikutnya
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = {
    verifyToken,
}
