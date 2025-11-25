<template>
  <div class="upload container">
    <h1 class="page-title">发布二手书</h1>

    <el-card class="upload-card">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="书名" prop="title">
              <el-input v-model="form.title" placeholder="请输入书名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="form.author" placeholder="可选" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price" :min="0.01" :step="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成色" prop="degree">
              <el-select v-model="form.degree" style="width: 100%">
                <el-option
                  v-for="d in degrees"
                  :key="d"
                  :label="d"
                  :value="d"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分类">
              <el-select v-model="form.category" style="width: 100%">
                <el-option label="小说" value="小说" />
                <el-option label="计算机" value="计算机" />
                <el-option label="教材" value="教材" />
                <el-option label="文学" value="文学" />
                <el-option label="社科" value="社科" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="描述书籍成色、使用痕迹等，越详细越好"
          />
        </el-form-item>

        <el-form-item label="上传图片（最多9张）">
          <el-upload
            action="http://localhost:3000/api/books"
            :headers="uploadHeaders"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :limit="9"
            multiple
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="el-upload__tip">建议上传清晰封面和细节图</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="submit" :loading="submitting">
            立即发布
          </el-button>
          <el-button @click="$router.push('/')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        author: '',
        price: 10,
        degree: '9成新',
        category: '小说',
        description: ''
      },
      degrees: ['95成新','9成新','85成新','8成新','7成新以下'],
      rules: {
        title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
      },
      fileList: [],
      submitting: false
    }
  },
  computed: {
    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.fileList = fileList
      this.$message.success('上传成功')
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return

        this.submitting = true
        try {
          await this.$http.post('/books', this.form)
          this.$message.success('发布成功！待管理员审核')
          this.$router.push('/')
        } catch (err) {
          this.$message.error('发布失败')
        } finally {
          this.submitting = false
        }
      })
    }
  }
}
</script>

<style scoped>
.upload {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}
.upload-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>