<template>
  <div class="home">
    <navbar class="homeNav">
      <div slot="center" class="centerContent">用户信息</div>
      <div slot="right" class="rightContent">
        <div class="modify" @click="modify">{{modifyText}}</div>
        <div class="info">
          <p class="infoName">您好 {{user.realname}}</p>[
          <span class="loginOut" @click="loginOut">退出</span>]
        </div>
      </div>
    </navbar>
    <div class="userInfo">
      <ul class="info">
        <li class="infoItem">
          <p class="infoTitle">用户名:</p>
          <div class="infoMessage">
            <span v-show="!ismodify">{{user.username}}</span>
            <input type="text" v-model="user.username" v-show="ismodify" readonly />
          </div>
        </li>
        <li class="infoItem">
          <p class="infoTitle">真实姓名:</p>
          <div class="infoMessage">
            <span v-show="!ismodify">{{user.realname}}</span>
            <input type="text" v-model="user.realname" v-show="ismodify" />
          </div>
        </li>
        <li class="infoItem">
          <p class="infoTitle">性别:</p>
          <div class="infoMessage">
            <span v-show="!ismodify">{{user.sex}}</span>
            <div class="sexBox" v-show="ismodify">
              <input type="radio" value="男" v-model="user.sex" />男
              <input type="radio" value="女" v-model="user.sex" />女
            </div>
          </div>
        </li>
        <li class="infoItem">
          <p class="infoTitle">邮箱:</p>
          <div class="infoMessage">
            <span v-show="!ismodify">{{user.email}}</span>
            <input type="text" v-model="user.email" v-show="ismodify" />
          </div>
        </li>
        <li class="infoItem">
          <p class="infoTitle">地址:</p>
          <div class="infoMessage">
            <span v-show="!ismodify">{{user.address}}</span>
            <input type="text" v-model="user.address" v-show="ismodify" />
          </div>
        </li>
      </ul>
    </div>
    <div class="sumbit" v-show="ismodify" @click="update">提交修改</div>
  </div>
</template>

<script>
import navbar from "../components/content/navbar";
//导入接口
import { updateUser } from "../network/user";
export default {
  name: "User",
  data() {
    return {
      user: {},
      modifyText: "修改",
      ismodify: false
    };
  },
  created() {
    //从sessionStorage中获取用户信息
    this.user = JSON.parse(sessionStorage.getItem("token"));
  },
  components: {
    navbar
  },
  methods: {
    //修改信息
    modify() {
      this.modifyText = this.modifyText === "修改" ? "取消" : "修改";
      this.ismodify = !this.ismodify;
    },
    //退出登录
    loginOut() {
      sessionStorage.removeItem("token");
      this.$tip.show("您已退出登录", "success");
      this.$router.push("/login");
    },
    //更新用户信息
    update() {
      updateUser({
        uid: this.user.uid,
        realname: this.user.realname,
        sex: this.user.sex,
        email: this.user.email,
        address: this.user.address
      }).then(res => {
        if (res) {
          sessionStorage.setItem("token", JSON.stringify(this.user));
          this.$tip.show("修改信息成功", "success");
          this.modifyText = "修改";
          this.ismodify = false;
        } else {
          this.$tip.show("未知错误，修改失败", "error");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  border: 1px solid #dfdfdf;
  width: 65%;
  position: relative;
  height: 365px;
  margin: 100px auto;
  .homeNav {
    background-color: #74759b;
    color: #fff;
    user-select: none;
    .leftContent {
      font-size: 20px;
      color: #92b3a5;
      cursor: pointer;
    }
    .centerContent {
      font-size: 22px;
      height: 50px;
      line-height: 50px;
    }
    .rightContent {
      display: flex;
      align-items: center;
      vertical-align: middle;
      .modify {
        width: 30%;
        font-size: 18px;
        cursor: pointer;
        user-select: none;
      }
      .info {
        display: flex;
        flex: 1;
        align-items: center;
        user-select: none;
        .infoName {
          margin-right: 15px;
        }
        .loginOut {
          cursor: pointer;
          padding: 0 5px;
          &:hover {
            color: #126bae;
            text-decoration: underline;
          }
        }
      }
    }
  }
  .userInfo {
    width: 80%;
    margin: 20px auto;
    .info {
      .infoItem {
        display: flex;
        height: 44px;
        line-height: 44px;
        font-size: 18px;
        border-bottom: 1px solid #dfdfdf;
        align-items: center;
        &:first-child {
          .infoTitle {
            position: relative;
            right: 9px;
          }
          .infoMessage {
            input {
              color: #ccc;
              border: 1px solid #ccc;
              &:focus {
                outline: none;
              }
            }
          }
        }
        &:nth-of-type(2) {
          .infoTitle {
            position: relative;
            right: 18px;
          }
        }
        .infoTitle {
          width: 30%;
          display: block;
          text-align: center;
        }
        .infoMessage {
          width: 70%;
          input {
            border: 1px solid #1772b4;
            width: 200px;
            height: 30px;
            font-size: 18px;
          }
          .sexBox {
            vertical-align: middle;
            input {
              width: 15px;
              height: 15px;
              border: none;
              vertical-align: middle;
              &:last-child {
                margin: 0 5px 0 15px;
              }
              &:first-child {
                margin: 0 5px;
              }
            }
          }
        }
      }
    }
  }
  .sumbit {
    width: 200px;
    height: 40px;
    line-height: 40px;
    background-color: #248067;
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    margin: 20px auto;
  }
}
</style>