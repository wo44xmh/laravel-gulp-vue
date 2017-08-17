<template>
  <div class="panel">
    <div class="panel-header">
      <el-form :inline="true" class="">
        <el-form-item>
          <el-button size="small" type="primary" @click="openNewDialog">新增</el-button>
          <el-button size="small" type="primary" @click="openNewDefaultDialog">新增默认</el-button>
        </el-form-item>
        <div style="">
          <el-form-item label="厂商：">
            <el-input placeholder="请输入搜索内容"
                      icon="search"
                      v-model="pageQuery.manufacturer"
                      @keyup.enter.native="query"
                      :on-icon-click="query">
            </el-input>
          </el-form-item>
          <el-form-item label="机型：">
          <el-input placeholder="请输入搜索内容"
                    icon="search"
                    v-model="pageQuery.model"
                    @keyup.enter.native="query"
                    :on-icon-click="query">
          </el-input>
          </el-form-item>
          <el-form-item label="手机版本：">
            <el-input placeholder="请输入搜索内容"
                      icon="search"
                      v-model="pageQuery.version"
                      @keyup.enter.native="query"
                      :on-icon-click="query">
            </el-input>
          </el-form-item>
          <el-form-item label="url：">
              <el-input placeholder="请输入搜索内容"
                        icon="search"
                        v-model="pageQuery.url"
                        @keyup.enter.native="query"
                        :on-icon-click="query">
              </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="panel-body">
      <el-table :data="list" class="pagination-list"
                stripe
                highlight-current-row>

        <el-table-column
          prop="manufacturer"
          label="厂商">
          <template scope="scope">
            <span @click="onShowDetail(scope.row)">{{scope.row.manufacturer}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="model"
          label="机型">
          <template scope="scope">
            <span >{{scope.row.model}}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="version"
                label="手机版本">
          <template scope="scope">
            <span>{{scope.row.version}}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="url"
                label="url">
          <template scope="scope">
            <span>{{scope.row.url}}</span>
          </template>
        </el-table-column>
        <el-table-column
              prop="region"
              label="区域">
        <template scope="scope">
          <span >{{scope.row.region}}</span>
        </template>
      </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间">
        </el-table-column>
        <el-table-column
          label="操作"
          :width="260">
          <template scope="scope">
            <el-button type="success" size="small" @click="openUpdateDialog(scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click="deleteFilter(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="bottom-fix-pagination"
                     v-bind:current-page="pageQuery.page"
                     v-bind:page-sizes="[20, 50, 100]"
                     v-bind:page-size="pageQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     v-bind:total="pageQuery.total">
      </el-pagination>
      <FilterDialog ref="FilterDialog"></FilterDialog>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import JsonEditor from './../common/JsonEditor'
  import FilterDialog from './FilterDialog.vue'

  export default {
    mounted(){
      this._loadData();
    },

    data () {
      return {}
    },

    computed: {
      ...mapState({
        pageQuery: state => state.filter.pageQuery,
        list: state => state.filter.list
      })
    },

    components: {
      JsonEditor,
      FilterDialog
    },

    methods: {

      query: function () {
        this._loadData();
      },

      changeModule: function () {
        this._loadData();
      },

      openNewDialog: function () {
        this.$refs.FilterDialog.onAdd(0);
        this.initForm();
      },

      openNewDefaultDialog: function () {
        this.$refs.FilterDialog.onAdd(1);
        this.initForm();
      },

      initForm: function () {
        this.formData = {
          manufacturer : '',
          version : '',
          model : '',
          url : '',
          region : '',
        };
      },

      openUpdateDialog: function (row) {
        this.$refs.FilterDialog.onEdit(row);
      },

      deleteFilter: function (row) {
        var that = this;
        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          that.$store.dispatch('filter_delete', {id: row});
        },function(){})
      },

      closeDialog: function () {
        this.dialog = false;
      },

      _loadData: function () {
        this.$store.dispatch('filter_get', {page: 1});
      },

      handleSizeChange: function (pageSize) {
        this.$store.dispatch('filter_get', {pageSize: pageSize});
      },

      handleCurrentChange: function (page) {
        this.$store.dispatch('filter_get', {page: page});
      },
      onShowDetail (row) {
        this.$router.push({name: 'filterDetail', params: {id: row.id}})
      },

    }
  }
</script>

<style scoped="">
  .panel-body {
  }
</style>
