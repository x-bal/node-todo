const models = require("../models/index")
const Todo = models.Todo
const Category = models.Category

class TodoController {
    async get(req, res, next) {
        try {
            const { keyword, page = 1, pageSize = 1 } = req.query
            let todos
            let totalCount

            if (keyword) {
                const { count, rows } = await Todo.findAndCountAll({
                    where: {
                        [models.Sequelize.Op.or]: [
                            {
                                title: {
                                    [models.Sequelize.Op.iLike]: `%${keyword}%`,
                                },
                            },
                            {
                                description: {
                                    [models.Sequelize.Op.iLike]: `%${keyword}%`,
                                },
                            },
                        ],
                    },
                    include: "category",
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                })

                todos = rows
                totalCount = count
            } else {
                todos = await Todo.findAll({
                    include: "category",
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                })
                totalCount = await Todo.count()
            }

            return res.status(200).json({
                message: "List todo",
                data: todos,
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
            const { title, description, category_id } = req.body
            const todo = await Todo.create({ title, description, category_id })
            return res
                .status(201)
                .json({ message: "Create succrss", data: todo })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }

    async show(req, res, next) {
        try {
            let { id } = req.params
            let todo = await Todo.findByPk(id)

            if (!todo) return res.status(404).json({ message: "Not found" })
            return res.status(200).json({ message: "Detail todo", data: todo })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }

    async update(req, res, next) {
        try {
            const { title, description, category_id } = req.body
            let { id } = req.params
            let todo = await Todo.findByPk(id)
            if (!todo)
                return res.status(404).json({ message: "Todo not found" })
            todo.update({ title, description, category_id })
            return res
                .status(200)
                .json({ message: "Create succrss", data: todo })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }

    async destroy(req, res, next) {
        try {
            let { id } = req.params
            let todo = await Todo.findByPk(id)
            if (!todo)
                return res.status(404).json({ message: "Todo not found" })
            await todo.destroy()
            return res
                .status(200)
                .json({ message: "Delete success", data: todo })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" })
        }
    }
}

module.exports = new TodoController()
