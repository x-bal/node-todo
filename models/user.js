"use strict"
const { Model } = require("sequelize")
const bcrypt = require("bcrypt")

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        async hashPassword() {
            if (this.password) {
                const salt = await bcrypt.genSalt(10)
                this.password = await bcrypt.hash(this.password, salt)
            }
        }

        async comparePassword(password) {
            return await bcrypt.compare(password, this.password)
        }
    }
    User.init(
        {
            username: {
                type: DataTypes.STRING,
                unique: true,
            },
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            foto: DataTypes.STRING,
        },
        {
            sequelize,
            tableName: "users",
            modelName: "User",
            hooks: {
                beforeCreate: async (user) => {
                    await user.hashPassword()
                },
                beforeUpdate: async (user) => {
                    await user.hashPassword()
                },
            },
        },
    )
    return User
}
