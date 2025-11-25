<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="title">二手书交易平台</h2>
      <el-form :model="form" :rules="rules" ref="form" label-width="0">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            size="large"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="tip">
          <span>默认账号：</span>
          <el-tag size="small" type="success">admin / 123456</el-tag>
          <el-tag size="small" type="info">张三 / 123456</el-tag>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    async login() {
      try {
        this.loading = true
        const res = await this.$http.post('/auth/login', this.form)
        if (res.code === 0) {
          localStorage.setItem('token', res.token)
          this.$store.commit('setUser', res.user)
          this.$message.success('登录成功')
          this.$router.push('/')
        } else {
          this.$message.error(res.msg || '登录失败')
        }
      } catch (err) {
        this.$message.error('网络错误')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  width: 400px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}
.title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}
.tip {
  text-align: center;
  color: #999;
  font-size: 14px;
}
.tip .el-tag + .el-tag {
  margin-left: 10px;
}
</style>