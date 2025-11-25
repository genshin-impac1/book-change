const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Book, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// 上传配置（保存到 uploads 文件夹）
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

// 发布书籍（支持最多9张图）
router.post('/', auth, upload.array('images', 9), async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const book = await Book.create({
      title: req.body.title,
      author: req.body.author || '',
      price: req.body.price,
      degree: req.body.degree || '9成新',
      category: req.body.category || '小说',
      description: req.body.description || '',
      images: JSON.stringify(images),
      userId: req.user.id,
      status: req.user.isAdmin ? 'onsale' : 'pending'  // 管理员直接上架
    });

    res.json({ code: 0, data: book, msg: '发布成功，待审核' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, msg: '发布失败' });
  }
});

// 获取书籍列表（支持高级筛选）
router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 12,
    keyword,
    degree,
    category,
    minPrice,
    maxPrice
  } = req.query;

  let where = { status: 'onsale' };
  if (keyword) where.title = { [Op.like]: `%${keyword}%` };
  if (degree) where.degree = degree;
  if (category) where.category = category;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  const { rows, count } = await Book.findAndCountAll({
    where,
    include: [{
      model: User,
      attributes: ['id', 'username', 'avatar', 'credit']
    }],
    offset: (page - 1) * limit,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']]
  });

  res.json({
    code: 0,
    data: rows,
    total: count,
    pages: Math.ceil(count / limit)
  });
});

// 获取单本图书详情
router.get('/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id, {
    include: [{
      model: User,
      attributes: ['id', 'username', 'avatar', 'credit']
    }]
  });

  if (!book || book.status !== 'onsale') {
    return res.json({ code: 1, msg: '书籍不存在或已下架' });
  }

  res.json({ code: 0, data: book });
});

module.exports = router;