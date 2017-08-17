<template>
  <el-dialog title="Filter" :visible.sync="visible" size="large">
    <el-form>
      <el-form-item v-if = "!defaultValue" label="厂商(*):" :label-width="labelWidth">
        <el-input v-model="formData.manufacturer"></el-input>
      </el-form-item>
      <el-form-item v-if = "!defaultValue" label="机型(*):" :label-width="labelWidth">
        <el-input v-model="formData.model"></el-input>
      </el-form-item>
      <el-form-item v-if = "!defaultValue" label="手机版本(*):" :label-width="labelWidth">
        <el-input v-model="formData.version"></el-input>
      </el-form-item>
      <el-form-item v-if = "!defaultValue" label="区域:" :label-width="labelWidth">
        <el-input v-model="formData.region"></el-input>
      </el-form-item>
      <el-form-item label="url(*):" :label-width="labelWidth">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="MD5(*):" :label-width="labelWidth">
        <el-input v-model="formData.md5"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button v-show="state=='add'" type="primary" @click="add">确 定</el-button>
      <el-button v-show="state=='update'" type="primary" @click="update">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import UploadImg from '../common/UploadImg.vue';
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        url: '',
        labelWidth: '200px',
        formData: {
          manufacturer: '',
          model: '',
          version: '',
          region: '',
          url: '',
          md5 : ''
        },
        headers: {
          'X-CSRF-TOKEN': document.getElementsByTagName('meta')['csrf-token'].getAttribute('content')
        },
        state: '',
        visible: false,
        defaultValue : 0
      }
    },
    computed: {
      ...mapState({
      })
    },

    methods: {
      onAdd (defaultValue) {
        this.state = 'add';
        this.url = '/security/filter/add';
        this.visible = true;
        this.fileList = [];
        this.defaultValue = defaultValue ? defaultValue : 0;
        this.initForm();
      },

      onEdit (row) {
        this.state = 'update';
        this.url = '/security/filter/update';
        this.visible = true;
        this.defaultValue = 0;
        this.formData = Object.assign({}, row);
      },

      initForm () {
        this.formData = {
          manufacturer: '',
          model: '',
          version: '',
          region: '',
          url: '',
          md5 : ''
        };
      },

      add: function () {
        if (!this.defaultValue) {
          if (this.formData.manufacturer == '') {
            this.$message.error('厂商不能为空');
            return;
          }
          if (this.formData.model == '') {
            this.$message.error('机型不能为空');
            return;
          }
          if (this.formData.version == '') {
            this.$message.error('版本不能为空');
            return;
          }
        } else {
        }
        if (this.formData.url == '') {
          this.$message.error('url不能为空');
          return;
        }
        if (this.formData.md5 == '') {
          this.$message.error('md5不能为空');
          return;
        }
        this.$store.dispatch('filter_add', this.formData).then((result) => {
          this.$message.success('执行成功');
          this.visible = false;
        });
      },
      update: function () {
        var that = this;
        this.$http.post('/security/filter/update', this.formData).then(function (response) {
          that.initForm();
          that.$store.dispatch('filter_get', {page: 1});
          if (response.data.result) {
            that.$message.success('执行成功');
            that.visible = false;
          }
          else {
            that.$message.error('出错');
          }
        });
      },

    }
  }
</script>
