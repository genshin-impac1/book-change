<template>
  <el-menu
    :default-active="$route.path"
    class="header-menu"
    mode="horizontal"
    background-color="#409EFF"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/upload">发布书籍</el-menu-item>
    <el-menu-item index="/cart">购物车</el-menu-item>
    <el-menu-item index="/orders">我的订单</el-menu-item>
    <el-menu-item index="/admin" v-if="user && user.isAdmin">管理后台</el-menu-item>

    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ user ? `${user.username}（信用：${user.credit}）` : '未登录' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        localStorage.removeItem('token')
        this.$store.commit('setUser', null)
        this.$router.push('/login')
        this.$message.success('已退出')
      }
    }
  }
}
</script>

<style scoped>
.header-menu { position: relative; }
.user-info {
  position: absolute;
  right: 20px;
  top: 0;
  height: 60px;
  line-height: 60px;
  color: white;
  cursor: pointer;
}
</style>