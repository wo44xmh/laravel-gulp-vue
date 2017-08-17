<template>
  <el-dialog title="更改角标" v-model="visible" class="mask-dialog" size="large">
    <el-form label-width="150px">
      <el-form-item label="请选择角标">
        <el-select placeholder="请选择" v-model="markId" v-if="visible" @change="onSelectMark">
          <el-option v-for="item in markList"
                     :key="item.id"
                     :label="item.zhName"
                     :value="item.cpid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预览">
        <div class="preview-mark">
          <img :src="cdn + imgUrl" class="bg-img" v-if="cdn && imgUrl"/>
          <img :src="preview_url" v-if="cdn && editMark.url" class="mark-img"/>
        </div>
      </el-form-item>
    </el-form>
    <div class="btns ac">
      <el-button type="primary" @click="onConfirm">确定</el-button><el-button @click="visible=false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: ['markList', 'theme', 'value', 'cdn', 'imgUrl'],
    data () {
      return {
        visible: false,
        editMark: this.value,
        markId: ''
      }
    },

    computed: {
      preview_url () {
        return this.cdn + this.editMark.url
      }
    },

    methods: {
      open () {
        console.log('mark dialog :', this.markList)
        this.editMark = Object.assign({}, this.value)
        this.markId = this.editMark.cpid ? this.editMark.cpid: ''
        this.visible = true
      },

      onSelectMark (value) {
        console.log('value:', value)
        this.editMark = this.markList.filter(item => {
          return item.cpid === value;
        })[0]
        console.log('this.editMark:', this.editMark)
      },

      onConfirm () {
        this.$emit('confirm', {
          params: {
            mark_id: this.markId,
            position: 1,
            res_id: this.theme.rid,
            name: this.theme.name,
            cooltype: 'theme'
          },
          editMark: this.editMark
        })
      }
    }
  }
</script>

<style>
  .preview-mark {
    position: relative;
    width:300px;
  }

  .preview-mark > img.bg-img {
    width: 100%;
  }

  .preview-mark > img.mark-img {
    position: absolute;
    top:0;
  }
</style>