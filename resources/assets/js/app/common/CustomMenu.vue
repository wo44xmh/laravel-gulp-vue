<template>
  <div id="app" style="text-align: center">
    <el-menu mode="horizontal" @select="handleSelect" :default-active="active">
      <el-menu-item index="filter">
        <router-link :to="{name: 'filter'}">黑白名单配置</router-link>
      </el-menu-item>
      <el-menu-item v-if="role.indexOf('test')!==-1" index="notice">
        <router-link :to="{name: 'test'}">test</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {Request} from '../../Utils/Utils';
  import {mapState} from 'vuex'

  export default {
    name: 'CustomMenu',

    data () {
      return {
        active: 'filter',
      }
    },

    computed: {
      ...mapState(['role'])
    },

    methods: {
      handleSelect: function (index) {
        this.$router.push(index);
      },
    },

    watch: {
      '$route' (route) {
        this.active = route.name
      }
    },

    mounted () {
      this.active = this.$router.currentRoute.name;
      //this.$store.commit('getRole');
    }
  }
</script>


<style>
  .el-menu-item a {
    text-decoration: none;
  }
</style>