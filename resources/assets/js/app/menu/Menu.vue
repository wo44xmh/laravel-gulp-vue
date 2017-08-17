<template>
  <div class="panel">
    <div class="panel-header">
      <el-form :inline="true">
        <el-form-item>
          <el-button size="small" type="success" @click="openNewDialog">新增</el-button>
        </el-form-item>
        <div class="right">
          <el-form-item label="描述">
            <el-input v-model="source.option.request.name" @keyup.enter.native="query"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="query">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="panel-body">
      <el-table :data="source.data" class="pagination-list"
                stripe
                highlight-current-row>
        <el-table-column
          prop="name"
          label="描述">
        </el-table-column>
        <el-table-column
          label="图片">
          <template scope="scope">
            <img style="max-height:80px" v-bind:src="scope.row.url">
          </template>
        </el-table-column>
        <el-table-column
          prop="module"
          label="模块"
          :formatter="moduleFormat">
        </el-table-column>
        <el-table-column
          prop="action"
          label="action">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          :width="260">
          <template scope="scope">
            <el-button type="success" size="small" @click="openUpdateDialog(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="bottom-fix-pagination"
                     v-bind:current-page="source.option.request.page"
                     v-bind:page-sizes="[20, 50, 100]"
                     v-bind:page-size="source.option.request.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     v-bind:total="source.option.total">
      </el-pagination>
      <el-dialog title="公告" :visible.sync="dialog" size="large">
        <el-form>
          <el-form-item label="描述(*):" :label-width="labelWidth">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="icon(*):" :label-width="labelWidth">
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="2">
                    <el-button type="primary" size="small" v-if="uploadImage" @click="uploadImage=false">转为填写URL</el-button>
                    <el-button v-else type="primary" size="small" @click="uploadImage=true">转为本地上传</el-button>
                  </el-col>
                  <el-col :span="22">
                    <UploadImg :value="formData.icon"
                               v-if="uploadImage"
                               @input="handleUploadSuccess"></UploadImg>
                    <el-input v-else v-model="formData.icon"></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="当前选中action(*):" :label-width="labelWidth" v-show="state=='update'">
            <el-input v-model="formData.action" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="配置方式:" :label-width="labelWidth">
            <el-radio-group v-model="configWay">
              <el-radio :label="'action'">action</el-radio>
              <el-radio :label="'banner'">banner</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="configWay=='banner'" label="匹配Banner动作:" :label-width="labelWidth">
            <el-row>
              <el-col :span="24">
                <el-form :inline="true">
                  <el-form-item label="资源类型">
                    <el-select v-model="banner.option.request.cooltype" @change="changeModule">
                      <el-option
                        v-for="item in bannerModule"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input v-model="bannerQueryName"></el-input>
                  </el-form-item>
                  <el-form-item v-show="searchOptions.length > 0" label="按">
                    <el-select size="small" v-model="optionValue" placeholder="请选择">
                      <el-option
                        v-for="item in searchOptions"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="queryBanner">查询</el-button>
                  </el-form-item>
                </el-form>
                <el-table :data="banner.data"
                          stripe
                          highlight-current-row>
                  <el-table-column :width="218" :header-align="'center'" label="预览图">
                    <template scope="scope">
                      <img style="max-height:80px;width: 217.5px;" v-bind:src="scope.row.url">
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="名字">
                  </el-table-column>
                  <el-table-column
                    prop="H5"
                    label="H5">
                    <template scope="scope">
                      <a v-if="scope.row.H5Url" :href="scope.row.H5Url" target="_blank"
                         style="text-decoration:none;color: #337ab7;">预览</a>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template scope="scope">
                      <el-button type="success" size="small" @click="configAction(scope.row)">配置action</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :current-page="banner.option.request.page"
                  :page-sizes="[5,10,20]"
                  :page-size="banner.option.request.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="bannerHandleSizeChange"
                  @current-change="bannerHandleCurrentChange"
                  :total="banner.option.total">
                </el-pagination>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="可选action模板:" :label-width="labelWidth">
            <el-select v-model="selectAction" placeholder="请选择" @change="changeAction">
              <el-option
                v-for="item in action.list"
                :key="item"
                :label="item.note"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="extra" prop="extra">
            <json-editor :value="extraJson" :showBtns="false" @json-change="onJsonChange"></json-editor>
            <div class="el-form-item__error" v-if="extraJson===null">请输入正确的JSON格式</div>
          </el-form-item>
          <el-form-item label="模块(*):" :label-width="labelWidth">
            <el-select v-model="formData.module" placeholder="请选择">
              <el-option
                v-for="item in module"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialog = false">取 消</el-button>
          <el-button v-show="state=='add'" type="primary" @click="add">确 定</el-button>
          <el-button v-show="state=='update'" type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import UploadImg from '../common/UploadImg.vue';
  import  '../../Utils/Utils';
  import {CONSTANT} from './../../constant';
  import JsonEditor from '../common/JsonEditor'
  import {Message, Loading} from 'element-ui';

  export default {
    components: {
      UploadImg,
      JsonEditor
    },
    mounted(){
      this.$store.dispatch('action_get', {page: 1, pageSize: 999});
      this._loadData();
    },
    data () {
      return {
        selectAction: {},
        uploadImage: true,
        configWay: '',
        source: {
          data: [],
          option: {
            request: {
              page: 1,
              pageSize: 20,
              desc: 'desc',
              order: 'id',
              name: ''
            },
            total: 0,
          }
        },
        formData: {
          name: '',
          icon: '',
          action: '',
          extra: '',
          module: '',
        },
        module: [
          {
            label: '主题',
            value: CONSTANT.MODULE_THEMES
          },
          {
            label: '壁纸',
            value: CONSTANT.MODULE_SINGLE_WALLPAPER
          },
          {
            label: '字体',
            value: CONSTANT.MODULE_FONT
          },
          {
            label: '动态壁纸',
            value: CONSTANT.MODULE_LIVE_WALLPAPER
          },
        ],

        banner: {
          data: [],
          option: {
            request: {
              page: 1,
              pageSize: 10,
              desc: 'desc',
              order: 'id',
              cooltype: '',
              name: '',
              valid: 1,
            },
            total: 0,
          }
        },
        bannerModule: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '主题',
            value: 0
          },
          {
            label: '双幅壁纸',
            value: 3
          },
          {
            label: '铃声',
            value: 4
          },
          {
            label: '字体',
            value: 5
          },
          {
            label: '锁屏',
            value: 6
          },
          {
            label: '动态壁纸',
            value: 13
          },
          {
            label: '单幅壁纸',
            value: 25
          },
          {
            label: '大师专栏',
            value: 50
          },
          {
            label: '大师子banner',
            value: 100
          },
        ],
        searchOptions: [
          {
            label: '名称',
            value: '名称',
          },
          {
            label: 'ID',
            value: 'ID',
          },
        ],
        bannerQueryName: '',
        optionValue: '名称',
        state: '',
        dialog: false,
        labelWidth: '200px',
        extraJson: {},
      }
    },
    computed: {
      action: function () {
        return this.$store.state.action;
      },
    },
    methods: {
      query: function () {
        this._loadData();
      },
      add: function () {
        var loadingInstance = null;
        var that = this;
        if (!!!this.formData.action) {
          that.$message.error('请填写Action');
          return;
        }
        if (!this.uploadImage) {
          this.formData.icon = this.formData.url;
          var options = {};
          loadingInstance = Loading.service(options);
        }
        else if (this.formData.icon != '') {
          var arr = this.formData.icon.split('/');
          this.formData.icon = arr[arr.length - 1];
        }
        this.$http.post('/zhuti/menu/add', this.formData).then(function (response) {
          that.dialog = false;
          that.uploadImage = true;
          if (loadingInstance)
            loadingInstance.close();
          that.initForm();
          that._loadData();
          if (response.data.result) {
            that.$message.success('执行成功');
          }
          else {
            that.$message.error('出错');
          }
        });
      },
      update: function () {
        var that = this;
        var loadingInstance = null;
        if (!!!this.formData.action) {
          that.$message.error('请填写Action');
          return;
        }
        if (!this.uploadImage) {
          this.formData.icon = this.formData.url;
          var options = {};
          loadingInstance = Loading.service(options);
        }
        else if (this.formData.icon != '') {
          var arr = this.formData.icon.split('/');
          this.formData.icon = arr[arr.length - 1];
        }
        this.$http.post('/zhuti/menu/update', this.formData).then(function (response) {
          that.dialog = false;
          that.uploadImage = true;
          if (loadingInstance)
            loadingInstance.close();
          that.initForm();
          that._loadData();
          if (response.data.result) {
            that.$message.success('执行成功');

          }
          else {
            that.$message.error('出错');
          }
        });
      },
      deleteItem: function (row) {
        var that = this;
        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          that.$http.post('/zhuti/menu/delete', {id: row.id}).then(function (response) {
            that.$message.success('执行成功');
            that._loadData();
          });
        });
      },
      openNewDialog: function () {
        this.state = 'add';
        this.dialog = true;
        this.extraJson = {};
        this.initForm();
        this.selectAction = {};
        this.initBannerData();
        this.configWay = 'action';

      },
      openUpdateDialog: function (row) {
        this.state = 'update';
        this.dialog = true;
        this.formData = row;
        this.selectAction = {};
        this.extraJson = row.extra;
        this.initBannerData();
        this.configWay = 'action';

      },
      closeDialog: function () {
        this.dialog = false;
      },
      handleUploadSuccess: function (url) {
        this.formData.icon = url;
      },
      initForm: function () {
        this.uploadImage = true;
        this.formData = {
          name: '',
          icon: '',
          action: '',
          extra: '',
          module: '',
        };
      },
      moduleFormat: function (row, col) {
        var output = '';
        switch (row.module) {
          case CONSTANT.MODULE_THEMES:
            output = '主题';
            break;
          case CONSTANT.MODULE_SINGLE_WALLPAPER:
            output = '壁纸';
            break;
          case CONSTANT.MODULE_FONT:
            output = '字体';
            break;
          case CONSTANT.MODULE_LIVE_WALLPAPER:
            output = '动态壁纸';
            break;
        }
        return output;
      },
      _loadData: function () {
        var that = this;
        this.$http.get('/zhuti/menu/get', {params: this.source.option.request}).then((response) => {
          if (response.data.result) {
            that.source.data = response.data.data;
            that.source.option.total = response.data.total;
          }
          else {
            that.$message.error("出错");
          }
        }, () => {
          that.$message.error("出错");
        });
      },
      handleSizeChange: function (pageSize) {
        if (this.source.option.request.pageSize != pageSize) {
          this.source.option.request.pageSize = pageSize;
          this._loadData(this.source);
        }
      },
      handleCurrentChange: function (page) {
        if (this.source.option.request.page != page) {
          this.source.option.request.page = page;
          this._loadData(this.source);
        }
      },

      changeAction: function (val) {
        if ($.isEmptyObject(val)) {
          return;
        }
        this.formData.action = val.action;
        this.extraJson = val.extra;
        this.formData.extra = val.extra;
      },
      onJsonChange: function (jsonObj) {
        if (jsonObj instanceof Object) {
          this.formData.extra = jsonObj;
        }
      },

      initBannerData () {
        this.banner.option.request = {
          page: 1,
          pageSize: 10,
          desc: 'desc',
          order: 'id',
          name: '',
          cooltype: '',
          valid: 1,
        };
        this.bannerLoadData();
      },
      bannerLoadData () {
        var that = this;
        this.$http.get('/zhuti/banner/get', {params: this.banner.option.request}).then((response) => {
          if (response.data.result) {
            that.banner.data = response.data.data;
            that.banner.option.total = response.data.total;
          }
          else {
            that.$message.error("出错");
          }
        }, () => {
          that.$message.error("出错");
        });
      },
      bannerHandleSizeChange: function (pageSize) {
        if (this.banner.option.request.pageSize != pageSize) {
          this.banner.option.request.pageSize = pageSize;
          this.bannerLoadData(this.banner);
        }
      },

      bannerHandleCurrentChange: function (page) {
        if (this.banner.option.request.page != page) {
          this.banner.option.request.page = page;
          this.bannerLoadData(this.banner);
        }
      },
      queryBanner: function () {
        if (this.optionValue == '名称') {
          this.banner.option.request.id = '';
          this.banner.option.request.name = this.bannerQueryName;
        }
        else {
          this.banner.option.request.id = this.bannerQueryName;
          this.banner.option.request.name = '';
        }
        this.bannerLoadData();
      },
      changeModule: function () {
        this.bannerLoadData();
      },

      configAction: function (row) {
        if (row.extra) {
          this.extraJson = row.extra;
          this.formData.extra = row.extra;
          this.formData.action = row.action;
          this.$message.success("配置成功");
        }
      }

    }
  }
</script>

<style scoped="">
</style>