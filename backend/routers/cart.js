const express = require('express');
const router = express.Router();
const { Cart, Book, User } = require('../models');
const auth = require('../middleware/auth');

// 添加/更新购物车
router.post('/', auth, async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  const book = await Book.findByPk(bookId);
  if (!book || book.status !== 'onsale') {
    return res.json({ code: 1, msg: '书籍不可购买' });
  }

  await Cart.upsert({
    userId: req.user.id,
    bookId,
    quantity
  });

  res.json({ code: 0, msg: '已加入购物车' });
});

// 获取购物车列表
router.get('/', auth, async (req, res) => {
  const items = await Cart.findAll({
    where: { userId: req.user.id },
    include: [{
      model: Book,
      where: { status: 'onsale' },
      include: [{ model: User, attributes: ['username'] }]
    }],
    order: [['createdAt', 'DESC']]
  });

  res.json({ code: 0, data: items });
});

// 删除购物车项
router.delete('/:bookId', auth, async (req, res) => {
  await Cart.destroy({
    where: { userId: req.user.id, bookId: req.params.bookId }
  });
  res.json({ code: 0, msg: '已移除' });
});

module.exports = router;