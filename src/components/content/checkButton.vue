<template>
  <div class="checkBtn" :class="{checked:isChecked}"></div>
</template>

<script>
export default {
  name: "checkButton",
  props: {
    isChecked: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.checkBtn {
  width: 20px;
  height: 20px;
  background-image: url("../../assets/img/unckecked.svg");
  background-size: 100% 100%;
}
.checked {
  background-image: url("../../assets/img/checked.svg");
  background-size: 100% 100%;
}
</style>