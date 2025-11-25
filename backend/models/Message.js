module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '发送者'
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '接收者'
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '关联的书籍（可为空）'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '0=未读, 1=已读'
    }
  }, {
    tableName: 'messages',
    timestamps: false,
    indexes: [
      { fields: ['fromUserId'] },
      { fields: ['toUserId'] },
      { fields: ['fromUserId', 'toUserId'] }
    ]
  });

  return Message;
};