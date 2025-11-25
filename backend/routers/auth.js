const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = 'your-secret-key-2025'; // 必须和 auth 中间件一致
const TOKEN_EXPIRE = '7d';

// 注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ code: 1, msg: '用户名和密码不能为空' });
  }

  try {
    const exist = await User.findOne({ where: { username } });
    if (exist) {
      return res.json({ code: 1, msg: '用户名已存在' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashed,
      credit: 100,
      isAdmin: username === 'admin' ? 1 : 0  // 方便测试，正式环境删掉
    });

    res.json({ code: 0, msg: '注册成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, msg: '服务器错误' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'password', 'avatar', 'credit', 'isAdmin']
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ code: 1, msg: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRE }
    );

    res.json({
      code: 0,
      msg: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        credit: user.credit,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 1, msg: '服务器错误' });
  }
});

module.exports = router;