<template>
  <el-dialog title="主题预览" v-model="visible" size="full" class="theme-preview">
    <div class="panel-header">
      <el-form :inline="true" class="fetch-inline-form">
        <el-form-item label="分辨率">
          <el-select v-model="currentPreview" placeholder="请选择">
            <el-option v-for="item in theme.theme_info"
                       :label="(item.width/2) + '*' + item.height" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-body">
      <div class="block">
        <h2 class="preview-title">{{theme.name}}</h2>
        <p class="author">{{theme.author}}</p>
        <div class="img-list" v-if="currentPreview.previews">
          <img v-for="preview in currentPreview.previews" :src="showUrl + preview.url"/>
        </div>
        <p v-if="!currentPreview.previews || !currentPreview.previews.length">暂无预览图片</p>
      </div>
      <div class="block">
        <h3>资源简介</h3>
        <p>{{theme.intro}}</p>
        <p v-if="!theme.intro">无资源简介</p>
      </div>
      <div class="block">
        <h3 class="relate">相关推荐</h3>
        <div class="img-list">
          <img v-for="recommend in recommends" :src="showUrl + recommend.previews[0].url"/>
          <p v-if="!recommends.length">无相关推荐！</p>
        </div>
      </div>
      <div class="btns">
        <el-button type="default" @click="visible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'themePreviewDialog',
    data () {
      return {
        showUrl: '',
        theme: {},
        resolutionId: '',
        currentPreview: {},
        visible: false,
        recommends: []
      }
    },

    methods: {
      open (row, res_id) {
        this.$store.dispatch('theme_preview', {id: row.id}).then(data => {
          this.theme = data.theme;
          this.showUrl = data.showUrl;
          if (res_id) {
            var currentPreview = this.theme.theme_info.filter(item => {
              return item.id === res_id
            })
            this.currentPreview = currentPreview.length ? currentPreview[0] : this.theme.theme_info[0] ? this.theme.theme_info[0] : {}
          } else {
            this.currentPreview = this.theme.theme_info[0] ? this.theme.theme_info[0] : {}
          }
          this.recommends = data.recommends
        })
        this.visible = true
      }
    }
  }
</script>

<style scoped>
  .img-list > img {
    width: 180px;
    margin: 0 10px 0 0;
  }

  .theme-preview .btns {
    text-align: center;
  }

  .theme-preview .block {
    margin-bottom: 20px;
  }
</style>