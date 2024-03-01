"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Todo.belongsTo(models.Category, {
                foreignKey: "category_id",
                onDelete: "CASCADE",
                as: "category",
            })
        }
    }
    Todo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            category_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            tableName: "todos",
            modelName: "Todo",
        },
    )
    return Todo
}
