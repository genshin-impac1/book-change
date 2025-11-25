<template>
  <div class="admin container">
    <h1 class="page-title">管理后台</h1>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="待审核书籍" name="books">
        <el-table :data="pendingBooks" v-loading="loading">
          <el-table-column prop="title" label="书名" width="300" />
          <el-table-column prop="User.username" label="发布者" width="150" />
          <el-table-column prop="price" label="价格" width="100">
            <template slot-scope="scope">¥{{ scope.row.price }}</template>
          </el-table-column>
          <el-table-column prop="degree" label="成色" width="100" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="approve(scope.row.id)">
                通过
              </el-button>
              <el-button size="mini" type="danger" @click="reject(scope.row.id)">
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="举报处理" name="reports">
        <el-table :data="reports">
          <el-table-column prop="reporter.username" label="举报人" />
          <el-table-column prop="reported.username" label="被举报人" />
          <el-table-column prop="reason" label="理由" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'success'">
                {{ scope.row.status === 'pending' ? '待处理' : '已处理' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === 'pending'"
                size="mini"
                type="danger"
                @click="handleReport(scope.row.id)"
              >
                扣除信用分
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'books',
      pendingBooks: [],
      reports: [],
      loading: false
    }
  },
  created() {
    this.loadPendingBooks()
    this.loadReports()
  },
  methods: {
    async loadPendingBooks() {
      this.loading = true
      const res = await this.$http.get('/admin/books/pending')
      this.pendingBooks = res.data.data || []
      this.loading = false
    },
    async loadReports() {
      const res = await this.$http.get('/admin/reports')
      this.reports = res.data.data || []
    },
    approve(id) {
      this.$http.put(`/admin/books/${id}/approve`).then(() => {
        this.$message.success('已通过上架')
        this.loadPendingBooks()
      })
    },
    reject(id) {
      this.$http.put(`/admin/books/${id}/reject`).then(() => {
        this.$message.success('已拒绝')
        this.loadPendingBooks()
      })
    },
    handleReport(id) {
      this.$http.put(`/admin/reports/${id}/approve`).then(() => {
        this.$message.success('已扣除信用分')
        this.loadReports()
      })
    }
  }
}
</script>

<style scoped>
.admin {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
}
</style>