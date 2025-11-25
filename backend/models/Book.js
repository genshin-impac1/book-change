module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(100)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    degree: {
      type: DataTypes.ENUM('95成新','9成新','85成新','8成新','7成新以下'),
      defaultValue: '9成新'
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: '小说'
    },
    description: {
      type: DataTypes.TEXT
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: '["/uploads/xxx.jpg"]'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','onsale','sold','offline'),
      defaultValue: 'pending',
      comment: '待审核、上架、已售、下架'
    }
  }, {
    tableName: 'books',
    timestamps: false
  });

  return Book;
};