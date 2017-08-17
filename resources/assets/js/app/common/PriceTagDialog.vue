<template>
  <el-dialog title="价格标签"
             v-model="visible"
             class="price-dialog"
             size="large">
    <el-form :inline="true" v-if="!priceTagList || !priceTagList.length">
      <el-form-item>
        <el-input v-model.trim="priceTag" placeholder="请输入价格标签"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="priceTagList" style="width: 100%" v-if="visible">
      <el-table-column prop="rid" label="rid"></el-table-column>
      <el-table-column prop="name" label="资源名"></el-table-column>
      <el-table-column prop="cooltype" label="资源类型">
        <template scope="scope">{{scope.row.cooltype | resTypeTransform}}</template>
      </el-table-column>
      <el-table-column label="价格标签">
        <template scope="scope">
          <el-input v-model="scope.row.price" placeholder="请输入价格标签" @keyup.enter.native="onSave(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="上线状态">
        <template scope="scope">
          <el-button type="success" icon="circle-check" size="mini" v-if="scope.row.valid" @click="onToggleOnline(scope.row)">已上线</el-button>
          <el-button type="warning" icon="circle-close" size="mini" v-if="!scope.row.valid" @click="onToggleOnline(scope.row)">已下线</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="insert_time" label="录入时间"></el-table-column>
      <el-table-column label="基本操作" width="120px">
        <template scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="onSave(scope.row)">保存</el-button>
            <el-button type="danger" size="mini" @click="onDelete(scope.row, scope.$index)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import mix from '../common/mix'
  export default {
    props: ['value', 'theme', 'type'],
    data () {
      return {
        visible: false,
        priceTag: '',
        priceTagList: []
      }
    },

    mixins: [mix],

    filters: {
      resTypeTransform (value) {
        switch (value) {
          case 0:
            return '主题';
          case 2:
            return '壁纸';
          case 5:
            return '字体';
          case 6:
            return '锁屏'
        }
        return '其他'
      }
    },

    methods: {
      open() {
        this.priceTagList = [];
        this.value.forEach(item => {
          this.priceTagList.push(Object.assign({}, item))
        })
        this.visible = true
      },

      onAdd () {
        var params = {
          name: this.theme.name || this.theme.zhName,
          rid: this.theme.rid,
          cooltype: this.constants['type_' + this.type],
          price: this.priceTag
        }
        this.$store.dispatch('common_addPriceTag', params).then(resp => {
          this.priceTagList.push(resp.data);
          this.$emit('input', this.priceTagList);
          this.$message.success('添加成功！')
        })
      },

      onToggleOnline (row) {
        this.$store.dispatch('common_changePriceTag', {id: row.id}).then(data => {
          row.valid = !row.valid
          this.$emit('input', this.priceTagList);
        })
      },

      onSave (row) {
        this.$store.dispatch('common_updatePriceTag', {
          id: row.id,
          price: row.price
        }).then(data => {
          this.$message.success('价格标签修改成功！')
          this.$emit('input', this.priceTagList);
        })
      },

      onDelete (row, index) {
        this.$store.dispatch('common_deletePriceTag', {id: row.id}).then(data => {
            this.priceTagList.splice(index, 1);
            this.$emit('input', this.priceTagList);
            this.$message.success('删除成功！')
        })
      }
    }
  }
</script>