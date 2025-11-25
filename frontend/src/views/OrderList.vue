<template>
  <div class="orders container">
    <h1 class="page-title">我的订单</h1>

    <el-card v-if="orders.length === 0" class="empty">
      <p>暂无订单</p>
      <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
    </el-card>

    <div v-else>
      <el-table :data="orders" style="width: 100%">
        <el-table-column label="订单号" prop="orderNo" width="180" />
        <el-table-column label="书籍" width="300">
          <template slot-scope="scope">
            <div class="book-info">
              <img :src="getFirstImage(scope.row.Book.images)" class="thumb" />
              <div>
                <p><strong>{{ scope.row.Book.title }}</strong></p>
                <p>¥{{ scope.row.Book.price }} × {{ scope.row.quantity }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总金额" width="120">
          <template slot-scope="scope">
            <strong style="color: #E74C3C">¥{{ scope.row.totalPrice }}</strong>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="statusMap[scope.row.status].type">
              {{ statusMap[scope.row.status].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'paid'"
              type="primary"
              size="small"
              @click="confirmReceive(scope.row.id)"
            >
              确认收货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      statusMap: {
        pending: { text: '待付款', type: 'warning' },
        paid: { text: '待发货', type: 'primary' },
        shipped: { text: '运输中', type: 'info' },
        completed: { text: '已完成', type: 'success' },
        canceled: { text: '已取消', type: 'danger' }
      }
    }
  },
  created() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      const res = await this.$http.get('/orders')
      this.orders = res.data.data || []
    },
    getFirstImage(images) {
      if (!images) return '/default.jpg'
      try {
        return JSON.parse(images)[0] || '/default.jpg'
      } catch {
        return '/default.jpg'
      }
    },
    confirmReceive(id) {
      this.$http.put(`/orders/${id}/status`, { status: 'completed' }).then(() => {
        this.$message.success('已确认收货，交易完成！')
        this.loadOrders()
      })
    }
  }
}
</script>

<style scoped>
.orders {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
}
.empty {
  text-align: center;
  padding: 60px;
}
.book-info {
  display: flex;
  align-items: center;
}
.thumb {
  width: 50px;
  height: 70px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 4px;
}
</style>