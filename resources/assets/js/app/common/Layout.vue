<template>
  <div class="panel">
    <div class="panel-header">
      <slot name="header"></slot>
    </div>
    <div class="panel-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
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
</style>
