const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// 引入所有模型
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Book = require('./Book')(sequelize, Sequelize.DataTypes);
const Cart = require('./Cart')(sequelize, Sequelize.DataTypes);
const Order = require('./Order')(sequelize, Sequelize.DataTypes);
const Message = require('./Message')(sequelize, Sequelize.DataTypes);
const Report = require('./Report')(sequelize, Sequelize.DataTypes);

// -------------------- 模型关联关系 --------------------

// 用户 → 书籍（一对多）
User.hasMany(Book, {
  foreignKey: 'userId',
  as: 'books'
});
Book.belongsTo(User, {
  foreignKey: 'userId',
  as: 'seller'
});

// 用户 → 购物车
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// 购物车 → 书籍
Cart.belongsTo(Book, { foreignKey: 'bookId' });

// 用户 → 订单（买家）
User.hasMany(Order, {
  foreignKey: 'buyerId',
  as: 'buyOrders'
});
// 用户 → 订单（卖家）
User.hasMany(Order, {
  foreignKey: 'sellerId',
  as: 'sellOrders'
});

Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Order.belongsTo(Book, { foreignKey: 'bookId' });

// 聊天消息
Message.belongsTo(User, { foreignKey: 'fromUserId', as: 'from' });
Message.belongsTo(User, { foreignKey: 'toUserId', as: 'to' });

// 举报
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
Report.belongsTo(User, { foreignKey: 'reportedUserId', as: 'reported' });

// 同步到数据库（开发时用，生产环境建议用 migration）
sequelize.sync({ alter: true })
  .then(() => console.log('所有模型已同步到数据库'))
  .catch(err => console.error('模型同步失败:', err));

module.exports = {
  sequelize,
  User,
  Book,
  Cart,
  Order,
  Message,
  Report
};