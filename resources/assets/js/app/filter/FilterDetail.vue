<template>
  <layout class="banner-detail">
    <el-row slot="header">
      <el-col :span="16">Filter详情</el-col>
      <el-col :span="8" class="ar">
        <el-button size="small" type="primary" icon="arrow-left" @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
    <div class="banner-detail-main" slot="body">
      <el-row class="info-list">
        <el-col :span="4" class="preview-column">
          <div class="img">
            <el-upload
              action="/zhuti/banner/updateImage"
              name="img"
              :show-file-list="false"
              :headers="headers"
              :data="updateImageData"
              :on-success="onUpdateFilterImage"
              :on-error="onUploadError">
              <img :src="cdn + banner.url" class="preview-img"/></el-upload>
            <span>点击上传图片,文件格式：jpg,jpeg,png;</span>
          </div>
          <div class="btns ac">
          </div>
        </el-col>
        <el-col :span="20" class="info-column">
          <table width="100%;">
            <tr>
              <td style="width: 120px;">名称</td>
              <td>{{banner.name}}</td>
              <td style="width: 120px;">rid</td>
              <td>{{banner.rid}}</td>
            </tr>
            <tr>
              <td>模块</td>
              <td>{{modules[banner.cooltype]}}</td>
              <td>展现形式</td>
              <td>{{bannerType[banner.bannertype]}}</td>
            </tr>
            <tr>
              <td>是否上线</td>
              <td>{{valid[banner.valid]}}</td>
              <td>H5</td>
              <td v-if="banner.H5">{{banner.H5Url}}</td>
              <td v-else>-</td>
            </tr>
            <tr>
              <td>是否专辑</td>
              <td>{{album[banner.album]}}</td>
              <td>展现位置</td>
              <td>{{positions[banner.istop]}}</td>
            </tr>
            <tr>
              <td>上传人员</td>
              <td>{{banner.insert_user}}</td>
              <td>最后修改人员</td>
              <td>{{banner.update_user}}</td>
            </tr>
            <tr>
              <td>上传时间</td>
              <td>{{banner.insert_time}}</td>
              <td>最后修改时间</td>
              <td>{{banner.update_time}}</td>
            </tr>
            <tr>
              <td>图片大小</td>
              <td>{{banner.size}}</td>
              <td>图片名</td>
              <td>{{banner.filename}}</td>
            </tr>
            <tr>
              <td>推荐理由</td>
              <td colspan="3">{{banner.rectext}}</td>
            </tr>
            <tr>
              <td>
                <el-button type="primary" size="small" @click="showDeepLink=!showDeepLink">deeplink地址</el-button>
              </td>
              <!--<td>deeplink地址</td>-->
              <td colspan="3" v-if="showDeepLink">{{deepLink}}</td>
              <td colspan="3" v-else></td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3">
              </td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <div class="panel">
        <div class="panel-header">
          <el-form :inline="true" class="">
            <el-form-item>
              <el-button size="small" type="primary" @click="addResource">新增关联资源</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="panel-body">
          <el-table :data="list" class="pagination-list"
                    stripe
                    highlight-current-row>
            <el-table-column
              label="预览图">
              <template scope="scope">
                <img style="max-width: 200px;" v-bind:src="scope.row.url" @click="onShowDetail(scope.row)">
              </template>
            </el-table-column>
            <el-table-column
              prop="cooltype"
              label="模块">
              <template scope="scope">{{modules[scope.row.cooltype]}}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="资源名称">
            </el-table-column>
            <el-table-column
              prop="rid"
              label="资源rid">
            </el-table-column>
            <el-table-column
              prop="valid"
              label="上线">
              <template scope="scope">
                <el-button v-if="scope.row.valid" type="success" icon="circle-check" size="mini" @click="changeStatus(scope.row)">上线</el-button>
                <el-button v-else icon="circle-close" type="warning" size="mini" @click="changeStatus(scope.row)">下线</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="insert_user"
              label="录入者">
            </el-table-column>
            <el-table-column
              prop="insert_time"
              label="创建时间">
            </el-table-column>
            <el-table-column
                    label="操作">
              <template scope="scope">
                <el-button @click="editResource(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <FilterResourceSearchDialog ref="dialog"></FilterResourceSearchDialog>
        <FilterResourceDialog ref="resourceDialog"></FilterResourceDialog>
      </div>
    </div>
  </layout>
</template>

<script>
  import {mapState} from 'vuex'
  import layout from '../common/Layout.vue'
  import FilterResourceSearchDialog from './FilterResourceSearchDialog.vue';
  import FilterResourceDialog from './FilterResourceDialog.vue';

  export default {
    name: 'bannerDetail',

    mounted () {
      this.$store.dispatch('banner_resource', {id: this.$router.currentRoute.params.id}).then(data => {
      });
      this.updateImageData.id = this.$router.currentRoute.params.id;
    },

    data () {
      return {
        showDeepLink: false,
        album: {
          0: 'banner',
          1: '专辑'
        },
        valid: {
          0: '下线',
          1: '上线'
        },
        updateImageData: {
          id: '',
        },
        headers: {
          'X-CSRF-TOKEN': document.getElementsByTagName('meta')['csrf-token'].getAttribute('content')
        },
      }
    },

    computed: {
      ...mapState({
        banner: state => state.banner.banner,
        modules: state => state.banner.modules,
        positions: state => state.banner.positions,
        bannerType: state => state.banner.bannerType,
        list: state => state.banner.bannerResource,
        cdn: state => state.banner.cdn,
        modules: state => state.banner.modules
      }),
      deepLink () {
        var deepLink = 'coolshow://theme/startactivity?adFilterId=' + this.banner.id +
          '&thumb=' + this.cdn + this.banner.url +
          '&moduleType=' + this.banner.cooltype + '&isSupportH5=' + (this.banner.H5 ? 'true' : 'false') +
          '&h5PageUrl=' + (this.banner.H5 ? this.banner.H5Url : '') + '&recommendText=' + (this.banner.recText ? this.banner.recText : '') + '&bannertype=' + this.banner.bannertype;
        return deepLink;
      }
    },

    components: {
      layout,
      FilterResourceSearchDialog,
      FilterResourceDialog
    },

    methods: {

      changeStatus (row) {
        var data = {
          id: row.id
        };
        this.$http.post('/zhuti/banner/resource/changeStatus', data).then((response) => {
          var data = response.data;
          if (data.result) {
            row.valid = 1 - row.valid;
            this.$message.success('执行成功');
          }
          else {
            this.$message.error(data.error);
          }
        });
      },

      addResource () {
        var data = {
          id: this.$router.currentRoute.params.id
        };
        this.$refs.dialog.open(data);
      },
      editResource (row) {
        this.$refs.resourceDialog.onEdit({
          rid : row.rid, type :row.cooltype, album_id : row.albumid,
          name : row.name, valid: row.valid, id : row.id,
          prodToExclude : row.rule[11], prodToInclude : row.rule[1], countriesToExclude : row.rule[12], countriesToInclude : row.rule[2]
        });
      },
      onUpdateFilterImage (resp) {
        if (resp.result) {
          this.$message.success('执行成功');
          this.banner.url = resp.url;
        }
        else {
          this.$message.error(resp.error);
        }
      },

      onUploadError (err) {
        this.$message.error('错误！')
      },
    },


  }
</script>

<style scoped>
  .preview-column > .img {
    margin: 0 20px;
    position: relative;
    text-align: center;
  }

  .preview-column .preview-img {
    max-width: 100%;
    width: 218px;
    height: 80px;
  }

  .preview-column .mark-img {
    position: absolute;
    top: 0;
  }

  .preview-column .btns {
    margin-top: 10px;
  }

  .info-column > table {
    width: 100%;
    line-height: 30px;
    border-collapse: collapse;
    border: 1px solid #ddd;
  }

  .info-column > table > tr:nth-of-type(2n+1) {
    background-color: #eef1f6;
  }

  .info-column > table > tr > td {
    padding: 0 5px;
    border-left: 1px solid #ddd;
  }

  .resolution {
    margin-top: 20px;
  }

  .resolution .title {
    color: #333;
    font-size: 14px;
    padding: 10px;
    background-color: #eef1f6;
  }
</style>