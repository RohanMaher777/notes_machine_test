require('dotenv').config()
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } = process.env
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
})

try {
    sequelize.authenticate()
    console.log("Connection has been establised successfully")
} catch (error) {
    console.error("Unable to connect to the database", error)
}

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

db.sequelize.sync({alter: true})

db.user = require("../src/model/user_model/user.model")(sequelize, DataTypes)
db.notes = require("../src/model/notes_model/notes.model")(sequelize, DataTypes)
db.employee = require("../src/model/employee_model/employee.model")(sequelize, DataTypes)


// User and notes have one to many relationship 
db.user.hasMany(db.notes,
    {
        foreignkey: "userId",
        as: "notes",
    }
);
db.notes.belongsTo(db.user,
    {
        foreignkey: "userId",
        as: "user"
    }
)


// User and employee have one to many relationship 
db.user.hasMany(db.employee,
    {
        foreignkey: "userId",
        as: "employee",
    }
);
db.employee.belongsTo(db.user,
    {
        foreignkey: "userId",
        as: "user"
    }
)
module.exports = db