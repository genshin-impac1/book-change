const express = require('express');
const router = express.Router();
const { Order, Cart, Book, User } = require('../models');
const auth = require('../middleware/auth');

// 提交订单（从购物车）
router.post('/', auth, async (req, res) => {
  const { cartIds, address } = req.body;
  if (!cartIds || cartIds.length === 0) {
    return res.json({ code: 1, msg: '购物车为空' });
  }

  const carts = await Cart.findAll({
    where: { id: cartIds, userId: req.user.id },
    include: [{ model: Book, where: { status: 'onsale' } }]
  });

  if (carts.length === 0) {
    return res.json({ code: 1, msg: '无有效商品' });
  }

  const orders = [];
  for (let c of carts) {
    const orderNo = 'OD' + Date.now() + Math.floor(Math.random() * 1000);
    const order = await Order.create({
      orderNo,
      buyerId: req.user.id,
      sellerId: c.Book.userId,
      bookId: c.Book.id,
      quantity: c.quantity,
      totalPrice: c.Book.price * c.quantity,
      address: JSON.stringify(address),
      status: 'paid'  // 模拟支付成功
    });

    // 信用分：买家+1，卖家+2
    await User.increment('credit', { by: 1, where: { id: req.user.id } });
    await User.increment('credit', { by: 2, where: { id: c.Book.userId } });

    await c.destroy(); // 清空购物车
    orders.push(order);
  }

  res.json({ code: 0, data: orders, msg: '下单成功，信用分已更新' });
});

// 获取我的订单
router.get('/', auth, async (req, res) => {
  const orders = await Order.findAll({
    where: { buyerId: req.user.id },
    include: [
      { model: Book, include: [{ model: User, attributes: ['username'] }] },
      { model: User, as: 'seller', attributes: ['username', 'credit'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.json({ code: 0, data: orders });
});

module.exports = router;