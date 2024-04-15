module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define("employee", {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        role_type: {
            type: DataTypes.ENUM,
            values: ["QA", "Frontend", "Backend"],
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        deleted_At: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
    },
        {
            paranoid: true,
            timestamps: true,
            deletedAt: 'deleted_At'
        }
    )
    return employee
}