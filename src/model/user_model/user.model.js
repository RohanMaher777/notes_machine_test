module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define ("user", {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM,
            values: ["user", "admin"],
            allowNull: false,
            defaultValue: "user"
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        remember_token: {
            type: DataTypes.STRING
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetTokenExpiration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deleted_At: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refreshToken_Expiration: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
        {
            paranoid: true,
            timestamps: true,
            deletedAt: 'deleted_At'
        }
    )

    return user
}