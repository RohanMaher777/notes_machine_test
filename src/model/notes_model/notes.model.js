module.exports = (sequelize, DataTypes) => {
    const notes = sequelize.define("notes", {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creation_time: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        updation_time: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
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
    return notes
}