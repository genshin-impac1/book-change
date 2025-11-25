const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = 'your-secret-key-2025'; // 必须和登录时完全一致！

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 1, msg: '请提供有效的登录凭证' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // 验证 token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 查询用户（包含管理员标志）
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'avatar', 'credit', 'isAdmin']
    });

    if (!user) {
      return res.status(401).json({ code: 1, msg: '用户不存在' });
    }

    // 挂载到 req 上，后面路由直接用 req.user
    req.user = user;
    next();
  } catch (err) {
    console.log('Token 验证失败:', err.message);
    return res.status(401).json({ code: 1, msg: '登录已过期，请重新登录' });
  }
};