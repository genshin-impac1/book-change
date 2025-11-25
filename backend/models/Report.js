module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('reports', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '举报人'
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '被举报人'
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '关联订单（可选）'
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '举报理由：虚假描述、不发货、态度恶劣等'
    },
    description: {
      type: DataTypes.TEXT,
      comment: '详细描述'
    },
    status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      defaultValue: 'pending',
      comment: 'pending=待处理, approved=已通过（扣分）, rejected=已拒绝'
    }
  }, {
    tableName: 'reports',
    timestamps: false
  });

  return Report;
};