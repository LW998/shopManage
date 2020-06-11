<template>
  <tr>
    <td>{{manage.username}}</td>
    <td>{{manage.password}}</td>
    <td>{{manage.role===1?'管理员':'超级管理员'}}</td>
    <td v-show="show">
      <div class="power">
        <div class="powerItem">
          <input type="checkbox" value="product" v-model="manage.list" :disabled="manage.role===0" />产品管理
        </div>
        <div class="powerItem">
          <input
            type="checkbox"
            value="queryOrder"
            v-model="manage.list"
            :disabled="manage.role===0"
          />查询订单
        </div>
        <div class="powerItem">
          <input
            type="checkbox"
            value="makeOrder"
            v-model="manage.list"
            :disabled="manage.role===0"
          />创建订单
        </div>
        <div class="powerItem">
          <input
            type="checkbox"
            value="permissions"
            v-model="manage.list"
            :disabled="manage.role===0"
          />用户权限管理
        </div>
      </div>
    </td>
    <td v-show="show">
      <div @click="save" class="saveBtn" v-show="manage.show">保存修改</div>
    </td>
  </tr>
</template>

<script>
import { modifyManage } from "../network/user";

export default {
  name: "manageItem",
  data() {
    return {
      isSave: true
    };
  },
  props: {
    manage: {
      type: Object,
      default: {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    save() {
      modifyManage({
        uid: this.manage.uid,
        product: this.manage.list.some(item => item === "product") ? 1 : 0,
        queryOrder: this.manage.list.some(item => item === "queryOrder")
          ? 1
          : 0,
        makeOrder: this.manage.list.some(item => item === "makeOrder") ? 1 : 0,
        permissions: this.manage.list.some(item => item === "permissions")
          ? 1
          : 0
      }).then(res => {
        if (res) {
          this.$tip.show(
            `修改管理员 ${this.manage.username} 权限成功`,
            "success"
          );
          this.manage.show = false;
        } else {
          this.$tip.show(
            `修改管理员 ${this.manage.username} 权限失败`,
            "error"
          );
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
tr {
  td {
    border: 1px solid #dddddd;
    text-align: center;
    .saveBtn {
      width: 60px;
      height: 30px;
      background-color: cadetblue;
      border-radius: 5px;
      margin: 0 auto;
      line-height: 30px;
      cursor: pointer;
    }
    .power {
      display: flex;
      justify-content: space-around;
      .powerItem {
        width: 100%;
        height: 100%;
        border-right: 1px solid #ddd;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
</style>