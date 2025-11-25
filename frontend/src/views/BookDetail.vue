<template>
  <div class="detail container">
    <el-row :gutter="40">
      <!-- 图片轮播 -->
      <el-col :span="12">
        <el-carousel height="500px" v-if="book.images && book.images.length">
          <el-carousel-item v-for="img in JSON.parse(book.images)" :key="img">
            <img :src="img" class="detail-img" />
          </el-carousel-item>
        </el-carousel>
        <div v-else class="no-image">
          <img src="@/assets/no-image.png" alt="暂无图片" />
        </div>
      </el-col>

      <!-- 信息区 -->
      <el-col :span="12">
        <h1 class="title">{{ book.title }}</h1>
        <p class="author">作者：{{ book.author || '未知' }}</p>

        <div class="price-info">
          <span class="price">¥{{ book.price }}</span>
          <el-tag type="success" size="large">{{ book.degree }}</el-tag>
          <el-tag size="large">{{ book.category }}</el-tag>
        </div>

        <div class="seller-card">
          <el-avatar :src="book.User.avatar" size="large" />
          <div class="seller-info">
            <p><strong>{{ book.User.username }}</strong></p>
            <p>信用分：{{ book.User.credit }}</p>
          </div>
          <el-button type="primary" @click="openChat">联系卖家</el-button>
        </div>

        <div class="actions">
          <el-button type="danger" size="large" icon="el-icon-shopping-cart-2" @click="addToCart">
            加入购物车
          </el-button>
        </div>

        <div class="description">
          <h3>书籍描述</h3>
          <p>{{ book.description || '暂无描述' }}</p>
        </div>
      </el-col>
    </el-row>

    <chat-dialog ref="chatDialog" />
  </div>
</template>

<script>
import ChatDialog from '@/components/ChatDialog.vue'

export default {
  components: { ChatDialog },
  data() {
    return { book: {} }
  },
  created() {
    this.loadBook()
  },
  methods: {
    async loadBook() {
      const res = await this.$http.get(`/books/${this.$route.params.id}`)
      this.book = res.data.data
    },
    addToCart() {
      this.$http.post('/cart', { bookId: this.book.id }).then(() => {
        this.$message.success('已加入购物车')
      })
    },
    openChat() {
      this.$refs.chatDialog.open(this.book.User.id)
    }
  }
}
</script>

<style scoped>
.detail {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}
.detail-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.no-image {
  height: 500px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 28px;
  margin: 0 0 16px 0;
  color: #303133;
}
.author {
  color: #999;
  font-size: 16px;
  margin-bottom: 20px;
}
.price-info {
  margin: 30px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}
.price {
  font-size: 36px;
  color: #E74C3C;
  font-weight: bold;
}
.seller-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.seller-info p {
  margin: 4px 0;
}
.actions {
  margin: 40px 0;
}
.description {
  margin-top: 40px;
  line-height: 1.8;
  color: #666;
}
</style>