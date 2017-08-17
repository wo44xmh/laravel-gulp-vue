<template>
  <div id="app">
    <CustomMenu></CustomMenu>
    <article>
      <el-row>
        <el-col :span="24">
          <router-view ></router-view>
          <div class="forbidden">
            <div class="container">
              <div class="content">

              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </article>
  </div>
</template>

<script>
  import CustomMenu from './app/common/CustomMenu.vue';
  import {mapState} from 'vuex'

  export default {
    name: 'app',
    data () {
      return {
        activeIndex: '1'
      }
    },
    computed: {
      ...mapState(['role'])
    },
    components: {
      CustomMenu
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .forbidden {
    font-family: 'Lato';
    font-weight: 100;
    margin: 0;
    padding: 0;
    width: 100%;
    color: #B0BEC5;
    display: table;
    font-weight: 100;
    font-family: 'Lato';
    height: 600px;
  }

  .forbidden .container {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
  }

  .forbidden .content {
    text-align: center;
    display: inline-block;
  }

  .forbidden .title {
    font-size: 72px;
    margin-bottom: 40px;
  }

  html {
    font-size: 36px;
  }

  .right {
    float: right;
  }

  .ar {
    text-align: right;
  }

  .ac {
    text-align: center;
  }

  .panel {
    width: 100%;
    font-size: 14px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
  }

  .panel-header {
    padding: 10px;
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
  }

  .panel-header .el-form-item {
    margin-bottom: 0;
  }

  .panel-body {
    padding-top: 10px;
  }

  .bottom-fix-pagination {
    position: fixed;
    bottom: 0;
    z-index: 2;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    background-color: #fff;
  }

  .pagination-list {
    margin-bottom: 40px;
  }

  .draggable-list {
    list-style: none;
    overflow: hidden;
    margin-bottom: 40px;
  }

  .draggable-list .list-item,
  .card-list > .list-item {
    width: 150px;
    float: left;
    margin: 0 5px 10px;
  }

  .draggable-list .list-item .img,
  .card-list > .list-item .img {
    width: 100%;
    position: relative;
  }

  .draggable-list .list-item .img > img,
  .card-list .list-item .img > img {
    width: 100%;
  }

  .sort-input input {
    text-align: center;
  }
</style>