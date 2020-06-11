<template>
  <div class="navbar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar"
};
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  text-align: center;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  .left {
    width: 25%;
  }
  .right {
    width: 25%;
  }
  .center {
    flex: 1;
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
  }
}
</style>