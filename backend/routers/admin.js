const express = require('express');
const router = express.Router();
const { Book, Report, User } = require('../models');
const auth = require('../middleware/auth');

// 管理员权限中间件
const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ code: 1, msg: '权限不足' });
  }
  next();
};

// 获取待审核书籍
router.get('/books/pending', auth, adminOnly, async (req, res) => {
  const books = await Book.findAll({
    where: { status: 'pending' },
    include: [{ model: User, attributes: ['username'] }]
  });
  res.json({ code: 0, data: books });
});

// 审核通过
router.put('/books/:id/approve', auth, adminOnly, async (req, res) => {
  await Book.update({ status: 'onsale' }, { where: { id: req.params.id } });
  res.json({ code: 0, msg: '审核通过，上架成功' });
});

// 审核拒绝
router.put('/books/:id/reject', auth, adminOnly, async (req, res) => {
  await Book.update({ status: 'offline' }, { where: { id: req.params.id } });
  res.json({ code: 0, msg: '已拒绝上架' });
});

// 获取举报列表
router.get('/reports', auth, adminOnly, async (req, res) => {
  const reports = await Report.findAll({
    include: [
      { model: User, as: 'reporter', attributes: ['username'] },
      { model: User, as: 'reported', attributes: ['username'] }
    ]
  });
  res.json({ code: 0, data: reports });
});

// 处理举报（通过则扣分）
router.put('/reports/:id/approve', auth, adminOnly, async (req, res) => {
  const report = await Report.findByPk(req.params.id);
  if (!report) return res.json({ code: 1, msg: '举报不存在' });

  await Report.update({ status: 'approved' }, { where: { id: req.params.id } });
  await User.decrement('credit', { by: 10, where: { id: report.reportedUserId } });

  res.json({ code: 0, msg: '已处理，已扣除10信用分' });
});

module.exports = router;