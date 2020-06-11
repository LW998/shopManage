<template>
  <form class="loginFrom">
    <div class="title">
      <div class="userLogin" :class="{active:loginType=='user'}" @click="userLogin">
        <span>用户登录</span>
      </div>
      <div class="manageLogin" :class="{active:loginType=='manage'}" @click="manageLogin">
        <span>管理员登录</span>
      </div>
    </div>
    <div class="loginContent">
      <label for="username" class="loginItem">
        <p class="loginLeft">用户名</p>
        <div class="loginRight">
          <input type="text" value v-model="username" />
        </div>
      </label>
      <label for="username" class="loginItem">
        <p class="loginLeft">密码</p>
        <div class="loginRight">
          <input type="password" value v-model="password" autocomplete="off" />
        </div>
      </label>
      <label for="role" class="loginItem" v-if="loginType=='manage'">
        <p class="loginLeft">权限</p>
        <div class="loginRight">
          <div class="roleContent">
            <div class="user">
              管理员
              <input type="radio" value="1" v-model="role" />
            </div>
            <div class="manger">
              超级管理员
              <input type="radio" value="0" v-model="role" />
            </div>
          </div>
        </div>
      </label>
    </div>
    <div class="loginBottom">
      <div class="button" @click="login">立即登录</div>
    </div>
  </form>
</template>

<script>
import { toLogin } from "../network/user";
export default {
  name: "Login",
  data() {
    return {
      username: null,
      password: null,
      loginType: "user",
      role: "1"
    };
  },
  methods: {
    //用户登录
    login() {
      //判断用户名密码是否为空
      if (this.username && this.password) {
        toLogin({
          username: this.username,
          password: this.password,
          role: this.loginType == "user" ? 2 : Number(this.role)
        }).then(res => {
          //登录成功
          if (res !== null && res !== "405") {
            this.$tip.show("登录成功", "success");
            sessionStorage.setItem("token", JSON.stringify(res));
            if (res.role === 2) {
              this.$router.push("/user");
            } else {
              this.$router.push("/manage");
            }
          } else if (res === "405") {
            this.$tip.show("您已被限制登录，请联系管理员", "waring");
            this.username = "";
            this.password = "";
          } else {
            this.password = "";
            this.$tip.show("用户名或密码错误", "error");
          }
        });
      } else {
        //用户名密码为空
        this.$tip.show("请输入用户名和密码", "error");
      }
    },
    userLogin() {
      this.loginType = "user";
      this.username = "";
      this.password = "";
      this.role = "1";
    },
    manageLogin() {
      this.loginType = "manage";
      this.username = "";
      this.password = "";
      this.role = "1";
    }
  }
};
</script>

<style lang="less" scoped>
.loginFrom {
  display: flex;
  width: 400px;
  height: 300px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  flex-flow: column;
  box-sizing: border-box;
  border-radius: 15px;
  box-sizing: border-box;
  background-color: #e2e1e4;
  .title {
    height: 50px;
    line-height: 52px;
    font-size: 20px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    align-items: center;
    .userLogin {
      width: 50%;
      text-align: center;
      border-top-left-radius: 15px;
      border-bottom-right-radius: 50px 80px;
      background-color: #815c94;
      border-bottom: 5px solid #fff;
      cursor: pointer;
    }
    .manageLogin {
      width: 50%;
      text-align: center;
      border-top-right-radius: 15px;
      border-bottom-left-radius: 50px 80px;
      background-color: #815c94;
      border-bottom: 5px solid #fff;
      cursor: pointer;
    }
    .active {
      background-color: #e2e1e4;
      border-bottom: none;
      color: brown;
    }
  }
  .loginContent {
    display: flex;
    flex-flow: column;
    align-items: center;
    background-color: #e2e1e4;
    justify-content: center;
    height: 150px;
    margin: 10px 0;
    .loginItem {
      display: flex;
      width: 80%;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
      height: 40px;
      line-height: 40px;
      .loginLeft {
        width: 30%;
        margin: 0;
        text-align: center;
      }
      .loginRight {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 70%;
        input[type="text"],
        input[type="password"] {
          height: 28px;
          line-height: 28px;
          font-size: 16px;
          width: 200px;
          outline: none;
          border: 1px solid #000;
          border-radius: 2px;
          background: none;
        }
        .roleContent {
          font-size: 13px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          width: 80%;
          input[type="radio"] {
            vertical-align: middle;
            margin-top: 0;
          }
        }
      }
    }
  }
  .loginBottom {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    .button {
      width: 300px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #a7a8bd;
      color: #fff;
      user-select: none;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>