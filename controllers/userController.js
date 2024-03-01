const models = require("../models/index")
const User = models.User
const fs = require("fs")

class UserController {
    async get(req, res, next) {
        try {
            const { keyword, page = 1, pageSize = 10 } = req.query
            let users
            let totalCount

            if (keyword) {
                const { count, rows } = await User.findAndCountAll({
                    where: {
                        [models.Sequelize.Op.or]: [
                            {
                                username: {
                                    [models.Sequelize.Op.iLike]: `%${keyword}%`,
                                },
                            },
                            {
                                name: {
                                    [models.Sequelize.Op.iLike]: `%${keyword}%`,
                                },
                            },
                        ],
                    },
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                })

                users = rows
                totalCount = count
            } else {
                users = await User.findAll({
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                })
                totalCount = await User.count()
            }

            return res.status(200).json({
                message: "List users",
                data: users,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                currentPage: parseInt(page),
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }

    async store(req, res, next) {
        try {
            const { username, name, password } = req.body

            if (!req.body.file) {
                return res.status(400).json({ message: "File data is missing" })
            }

            const base64Data = req.body.file
            const contentType = base64Data.split(';')[0].split('/')[1];
            const buffer = Buffer.from(base64Data.split(';base64,')[1], 'base64');

            const filePath = `uploads/${username}.${contentType}`;
            fs.writeFileSync(filePath, buffer)

            const user = User.create({
                username: username,
                name: name,
                password: password,
                foto: filePath,
            })

            return res.status(201).json({
                message: "User created successfully!",
                data: user,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }
}

module.exports = new UserController()