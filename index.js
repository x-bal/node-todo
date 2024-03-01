const express = require("express")
const bodyParser = require("body-parser")
const { Sequelize } = require("sequelize")
const routes = require(`./routes`)
const connection = require("./config/database")

const app = express()
const port = 3000

const sequelize = new Sequelize(connection.development)

app.use(bodyParser.json())
app.use("/api", routes)

sequelize
    .sync()
    .then(() => {
        console.log(`Database connected successfully!`)

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error(`Error connecting to the database: ${err}`)
    })
