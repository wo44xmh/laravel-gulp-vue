<template>
  <el-upload :action="uploadUrl"
             :file-list="fileList"
             :on-success="onSuccess"
             :on-remove="onRemove"
             :before-upload="beforeUpload"
             list-type="picture-card">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，最好不超过4.5MB</div>
  </el-upload>
</template>

<script>
  import {Message} from 'element-ui'
  const UPLOAD_URL = '/api/uploadImg'
  export default {
    name: 'UploadImg',
    props: ['value'],
    data () {
      return {
        uploadUrl: UPLOAD_URL,
//                imgurl: this.value
      }
    },
    computed: {
      imgurl: function () {
        return this.value;
      },
      fileList () {
        return this.imgurl ? [{name: this.imgurl, url: this.imgurl}] : []
      },

    },
    methods: {
      beforeUpload (file) {
        const size = file.size / 1024 / 1024
        if (size > 4.5) {
          Message.error('最好不要超过4.5MB')
          return false
        }
        const names = file.name.split('.')
        if (names.length < 2) {
          return false
        }
        const ext = names[names.length - 1]
        if (ext === 'jpg' || ext === 'png') {
          return true
        }
        Message.error('只能上传jpg/png文件')
        return false
      },
      onSuccess (res, file, fileList) {
        if (res.result === false) {
          Message.error(res.error)
          this.imgurl = this.value
          file = null
          return
        }
        !this.fileList.length && this.fileList.push({name: res.data.url, url: res.data.url})
        fileList.splice(0, fileList.length - 1)
        this.$emit('input', res.data.url)
        this.$emit('upload-success', res.data)
      },
      onRemove (res, file, fileList) {
        this.$emit('input', '')
      }
    }
  }
</script>
