const express = require("express")
const router = express.Router()
const { verifyToken } = require("../middleware/authMiddleware")
// import controllers
const CategoryController = require("../controllers/categoryController")
const TodoController = require("../controllers/todoController")
const UserController = require("../controllers/userController")
const AuthController = require("../controllers/authController")

// Router
// Auth
router.post("/login", AuthController.login)

// Category
router.get("/categories", verifyToken, CategoryController.get)
router.get("/categories/:id", verifyToken, CategoryController.show)
router.post("/categories", verifyToken, CategoryController.store)
router.put("/categories/:id", verifyToken, CategoryController.update)
router.delete("/categories/:id", verifyToken, CategoryController.destroy)

// Todo
router.get("/todos", verifyToken, TodoController.get)
router.get("/todos/:id", verifyToken, TodoController.show)
router.post("/todos", verifyToken, TodoController.store)
router.put("/todos/:id", verifyToken, TodoController.update)
router.delete("/todos/:id", verifyToken, TodoController.destroy)

// User
router.get("/users", verifyToken, UserController.get)
router.post("/users", verifyToken, UserController.store)

module.exports = router
