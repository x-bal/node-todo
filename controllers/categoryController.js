const models = require("../models/index")
const Category = models.Category
const { validationResult, body } = require("express-validator")

exports.get = async (req, res) => {
    try {
        let categories = await Category.findAll()
        res.status(200).json({ message: "List category", data: categories })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.store = async (req, res) => {
    try {
        // validasi
        await Promise.all([
            body("name").notEmpty().withMessage("Name is required").run(req),
        ])

        // Menangani kesalahan validasi
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name } = req.body

        const category = await Category.create({ name })
        res.status(201).json({ message: "Create success", data: category })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.show = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id)
        res.json(category)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.update = async (req, res) => {
    try {
        let { id } = req.params
        let { name } = req.body
        let category = await Category.findByPk(id)
        if (!category) return res.status(404).json({ message: "Not found" })
        category = await category.update({ name })
        res.status(200).json({ message: "Update success", data: category })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error on update data" })
    }
}

exports.destroy = async (req, res) => {
    try {
        let { id } = req.params
        let category = await Category.findByPk(id)
        if (!category) return res.status(404).json({ message: "Not found" })
        category = await category.destroy(id)
        res.status(200).json({ message: "Delete success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error on delete data" })
    }
}
