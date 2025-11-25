const express = require('express');
const router = express.Router();
const { Message } = require('../models');
const auth = require('../middleware/auth');

// 获取与某人的聊天记录（自动标记已读）
router.get('/:otherUserId', auth, async (req, res) => {
  const otherId = parseInt(req.params.otherUserId);

  const messages = await Message.findAll({
    where: {
      [require('sequelize').Op.or]: [
        { fromUserId: req.user.id, toUserId: otherId },
        { fromUserId: otherId, toUserId: req.user.id }
      ]
    },
    order: [['createdAt', 'ASC']]
  });

  // 把自己收到的消息标记为已读
  await Message.update(
    { isRead: 1 },
    {
      where: {
        fromUserId: otherId,
        toUserId: req.user.id,
        isRead: 0
      }
    }
  );

  res.json({ code: 0, data: messages });
});

module.exports = router;