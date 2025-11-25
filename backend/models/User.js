module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { len: [2, 20] }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      defaultValue: '/uploads/default.jpg'
    },
    credit: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      comment: '信用分，交易成功+1~2，举报扣分'
    },
    isAdmin: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '1=管理员'
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};