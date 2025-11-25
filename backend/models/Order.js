module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('orders', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNo: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
      comment: '订单号，如 OD202512251234567'
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '买家ID'
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '卖家ID'
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','paid','shipped','completed','canceled'),
      defaultValue: 'pending',
      comment: 'pending=待付款, paid=已付款, shipped=已发货, completed=已完成'
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '收货地址 {province, city, detail, name, phone}'
    }
  }, {
    tableName: 'orders',
    timestamps: false
  });

  return Order;
};