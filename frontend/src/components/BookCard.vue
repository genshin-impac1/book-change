<template>
  <el-card class="book-card" shadow="hover" @click.native="toDetail">
    <div class="cover-wrapper">
      <img :src="firstImage" class="cover" alt="封面" />
      <div class="degree-tag">
        <el-tag size="mini" type="success">{{ book.degree }}</el-tag>
      </div>
    </div>

    <div class="info">
      <h3 class="title">{{ book.title }}</h3>
      <p class="author">{{ book.author || '佚名' }}</p>

      <div class="bottom">
        <div class="price">¥{{ book.price }}</div>
        <div class="seller">
          <el-avatar :src="book.User.avatar" size="small" />
          <span class="username">{{ book.User.username }}</span>
          <span class="credit">信用{{ book.User.credit }}</span>
        </div>
      </div>

      <div class="actions">
        <el-button
          type="primary"
          size="mini"
          round
          @click.stop="openChat(book.User.id)"
        >
          联系卖家
        </el-button>
        <el-button
          type="danger"
          size="mini"
          round
          @click.stop="addToCart"
        >
          加入购物车
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  computed: {
    firstImage() {
      if (!this.book.images || this.book.images.length === 0) {
        return '/default.jpg'
      }
      try {
        const arr = JSON.parse(this.book.images)
        return arr[0] || '/default.jpg'
      } catch (e) {
        return '/default.jpg'
      }
    }
  },
  methods: {
    toDetail() {
      this.$router.push(`/book/${this.book.id}`)
    },
    openChat(userId) {
      this.$emit('open-chat', userId)
    },
    addToCart() {
      this.$http.post('/cart', { bookId: this.book.id }).then(() => {
        this.$message.success('已加入购物车')
      }).catch(() => {
        this.$message.error('加入失败')
      })
    }
  }
}
</script>

<style scoped>
.book-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.15) !important;
}

.cover-wrapper {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .cover {
  transform: scale(1.05);
}

.degree-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.author {
  color: #999;
  font-size: 13px;
  margin: 4px 0 12px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  margin-bottom: 12px;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: #E74C3C;
}

.seller {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.username {
  margin: 0 8px;
}

.credit {
  color: #67C23A;
  font-weight: bold;
}

.actions {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.actions button + button {
  margin-left: 12px;
}
</style>