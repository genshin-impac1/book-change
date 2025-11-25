const { Sequelize } = require('sequelize');

// 请修改下面的密码为你自己的 MySQL root 密码
const sequelize = new Sequelize('book_change', 'root', '你的MySQL密码', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,                    // 关闭SQL日志（生产建议关闭）
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  define: {
    timestamps: false,               // 我们自己控制 createdAt
    freezeTableName: true            // 禁止自动复数表名
  }
});

// 测试连接
sequelize.authenticate()
  .then(() => console.log('MySQL 连接成功'))
  .catch(err => console.error('MySQL 连接失败:', err));

module.exports = sequelize;