<template>
  <div class="home">
    <div class="container">
      <!-- 搜索栏 -->
      <el-card class="search-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="search.keyword" placeholder="搜索书名/作者" clearable />
          </el-col>
          <el-col :span="4">
            <el-select v-model="search.degree" placeholder="成色" clearable>
              <el-option
                v-for="item in degrees"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="search.category" placeholder="分类" clearable>
              <el-option label="小说" value="小说" />
              <el-option label="计算机" value="计算机" />
              <el-option label="教材" value="教材" />
              <el-option label="文学" value="文学" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input v-model.number="search.minPrice" placeholder="最低价" type="number" />
          </el-col>
          <el-col :span="3">
            <el-input v-model.number="search.maxPrice" placeholder="最高价" type="number" />
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="loadBooks(1)">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-card>

      <!-- 书籍列表 -->
      <el-row :gutter="20" class="book-list">
        <el-col :span="6" v-for="book in books" :key="book.id">
          <book-card :book="book" @open-chat="openChat" />
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :total="total"
          :page-size="12"
          :current-page.sync="currentPage"
          @current-change="loadBooks"
        />
      </div>
    </div>

    <!-- 聊天弹窗 -->
    <chat-dialog ref="chatDialog" />
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue'
import ChatDialog from '@/components/ChatDialog.vue'

export default {
  components: { BookCard, ChatDialog },
  data() {
    return {
      books: [],
      total: 0,
      currentPage: 1,
      degrees: ['95成新','9成新','85成新','8成新','7成新以下'],
      search: {
        keyword: '',
        degree: '',
        category: '',
        minPrice: null,
        maxPrice: null
      }
    }
  },
  created() {
    this.loadBooks(1)
  },
  methods: {
    async loadBooks(page = 1) {
      this.currentPage = page
      const params = {
        page,
        limit: 12,
        ...this.search
      }
      const res = await this.$http.get('/books', { params })
      this.books = res.data.data
      this.total = res.data.total || 0
    },
    resetSearch() {
      this.search = {
        keyword: '',
        degree: '',
        category: '',
        minPrice: null,
        maxPrice: null
      }
      this.loadBooks(1)
    },
    openChat(userId) {
      this.$refs.chatDialog.open(userId)
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px 0;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
.search-card {
  margin-bottom: 30px;
  border-radius: 12px;
}
.book-list {
  margin-bottom: 40px;
}
.pagination-wrapper {
  text-align: center;
  padding: 20px 0;
}
</style>