<template>
  <div class="cart container">
    <h1 class="page-title">我的购物车</h1>

    <el-card v-if="items.length === 0" class="empty-cart">
      <div class="empty-text">
        <i class="el-icon-shopping-cart-2" style="font-size: 80px; color: #ddd;"></i>
        <p>购物车空空如也</p>
        <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
      </div>
    </el-card>

    <el-card v-else class="cart-card">
      <el-table :data="items" style="width: 100%">
        <el-table-column label="书籍" width="400">
          <template slot-scope="scope">
            <div class="book-info">
              <img :src="getFirstImage(scope.row.Book.images)" class="book-thumb" />
              <div>
                <h4>{{ scope.row.Book.title }}</h4>
                <p>{{ scope.row.Book.degree }} · {{ scope.row.Book.category }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="Book.price" label="单价" width="120" align="center">
          <template slot-scope="scope">¥{{ scope.row.Book.price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="150" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.quantity"
              :min="1"
              size="small"
              @change="updateQuantity(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            <strong style="color: #E74C3C">¥{{ (scope.row.Book.price * scope.row.quantity).toFixed(2) }}</strong>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="removeItem(scope.row.bookId)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="cart-footer">
        <div class="total">
          总计：<span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <el-button type="danger" size="large" @click="checkout">去结算</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return { items: [] }
  },
  computed: {
    totalPrice() {
      return this.items.reduce((sum, item) => sum + item.Book.price * item.quantity, 0)
    }
  },
  created() {
    this.loadCart()
  },
  methods: {
    async loadCart() {
      const res = await this.$http.get('/cart')
      this.items = res.data.data || []
    },
    async updateQuantity(item) {
      await this.$http.post('/cart', { bookId: item.bookId, quantity: item.quantity })
    },
    async removeItem(bookId) {
      await this.$http.delete(`/cart/${bookId}`)
      this.$message.success('已移除')
      this.loadCart()
    },
    getFirstImage(images) {
      if (!images) return '/default.jpg'
      try {
        const arr = JSON.parse(images)
        return arr[0] || '/default.jpg'
      } catch {
        return '/default.jpg'
      }
    },
    checkout() {
      const cartIds = this.items.map(i => i.id)
      this.$router.push({
        path: '/orders',
        query: { fromCart: true, cartIds: cartIds.join(',') }
      })
    }
  }
}
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
}
.empty-cart {
  text-align: center;
  padding: 60px;
}
.empty-text p {
  font-size: 18px;
  color: #999;
  margin: 20px 0;
}
.cart-card {
  border-radius: 12px;
}
.book-info {
  display: flex;
  align-items: center;
}
.book-thumb {
  width: 60px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;
}
.cart-footer {
  margin-top: 30px;
  text-align: right;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 0 0 12px 12px;
}
.total-price {
  font-size: 24px;
  color: #E74C3C;
  font-weight: bold;
}
</style>