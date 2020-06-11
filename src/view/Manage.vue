<template>
  <Layout style="width:1000px; margin:100px auto; height:400px">
    <LayoutPanel region="north" style="height:50px;" class="navTitle">
      <div class="title">
        <div class="info">
          <p class="infoName">您好 {{user.username}}</p>[
          <span class="loginOut" @click="loginOut">退出</span>]
        </div>
      </div>
    </LayoutPanel>
    <LayoutPanel region="west" style="width:120px;">
      <div class="leftTitle">
        <div class="letftNav">
          <div class="userMenue" @click="userMenue" :class="{active:show==='user'}">
            <img src="../assets/img/menue.svg" alt />
            <span>用户列表</span>
          </div>
          <div
            class="manageMenue"
            @click="manageMenue"
            v-show="this.role===0"
            :class="{active:show==='manage'}"
          >
            <img src="../assets/img/menue.svg" alt />
            <span>管理员列表</span>
          </div>
        </div>
      </div>
    </LayoutPanel>
    <LayoutPanel region="center" style="height:100%">
      <div class="title">
        <div class="welcome" v-show="show===''">
          <p class="text">欢迎使用权限管理系统</p>
        </div>
        <div class="manageInfo" v-show="show==='manage'">
          <div class="manageNav">
            <div class="navBox">
              <div @click="addManage">
                <img src="../assets/img/add.svg" alt />
                <span>添加管理员</span>
              </div>
              <div @click="modifyManage">
                <img src="../assets/img/edit.svg" alt />
                <span>{{modifyText}}</span>
              </div>
            </div>
          </div>
          <table class="manageTable">
            <tr>
              <th>登录名</th>
              <th>密码</th>
              <th>角色</th>
              <th v-show="showModify">权限</th>
              <th v-show="showModify">操作</th>
            </tr>
            <manageItem
              v-for="(item,index) in manageData"
              :key="index"
              :manage="item"
              :show="showModify"
            ></manageItem>
            <tr v-show="addShow">
              <td>
                <input type="text" v-model="manageName" class="addInp" />
              </td>
              <td>
                <input type="text" v-model="managePassword" class="addInp" />
              </td>
              <td>管理员</td>
              <div class="operate">
                <div class="save" @click="add">保存</div>
                <div class="cancel" @click="cancelAdd">取消</div>
              </div>
            </tr>
          </table>
        </div>
        <div class="userInfo" v-show="show==='user'">
          <div class="userNav">
            <div @click="openUser">
              <img src="../assets/img/edit.svg" alt />
              <span>启用用户</span>
            </div>
            <div @click="closeUser">
              <img src="../assets/img/ban.svg" alt />
              <span>禁用用户</span>
            </div>
          </div>
          <table class="userTable">
            <tr>
              <th>
                <checkButton class="checkBox" :isChecked="checkAll" @click.native="allCheck"></checkButton>
              </th>
              <th>用户名</th>
              <th>真实姓名</th>
              <th>性别</th>
              <th>邮箱</th>
              <th>地址</th>
              <th>注册时间</th>
              <th>用户状态</th>
            </tr>
            <tr v-for="(item,index) in userData" :key="index">
              <td>
                <checkButton
                  class="checkBox"
                  :isChecked="item.checked"
                  @click.native="userClick(index)"
                ></checkButton>
              </td>
              <td>{{item.username}}</td>
              <td>{{item.realname}}</td>
              <td>{{item.sex}}</td>
              <td>{{item.email}}</td>
              <td>{{item.address}}</td>
              <td>{{item.registerdate}}</td>
              <td>{{item.status==='enable'?'启用':'禁用'}}</td>
            </tr>
          </table>
          <Pagination
            :total="total"
            :pageSize="pageSize"
            :pageNumber="pageNumber"
            @pageChange="onPageChange($event)"
          ></Pagination>
        </div>
      </div>
    </LayoutPanel>
  </Layout>
</template>

<script>
import {
  queryManage,
  manageFormat,
  queryUser,
  modifyUser,
  addManage
} from "../network/user";
import manageItem from "./ManageItem";
import checkButton from "../components/content/checkButton";
export default {
  name: "manage",
  data() {
    return {
      manageData: [],
      // checkAll: false,
      userData: [],
      totalUserData: [],
      all: false,
      user: JSON.parse(sessionStorage.getItem("token")),
      role: null,
      // JSON.parse(sessionStorage.getItem("token")).role
      power: null,
      total: null,
      pageNumber: 1,
      pageSize: 5,
      show: "",
      addShow: false,
      showModify: false,
      modifyText: "设置/修改管理员权限",
      manageName: "",
      managePassword: ""
    };
  },
  components: {
    manageItem,
    checkButton
  },
  methods: {
    //退出登录
    loginOut() {
      sessionStorage.removeItem("token");
      this.$tip.show("您已退出登录", "success");
      this.$router.push("/login");
    },
    //用户列表单选
    userClick(index) {
      this.userData[index].checked = !this.userData[index].checked;
    },
    //用户列表全选
    allCheck() {
      this.all = !this.all;
      this.userData.forEach((item, index) => {
        this.userData[index].checked = this.all;
      });
    },
    //显示用户列表
    userMenue() {
      this.show = "user";
    },
    //显示管理员列表
    manageMenue() {
      this.show = "manage";
    },
    //修改用户权限方法
    changeUser(staStr, str) {
      if (this.power !== 1) {
        this.$tip.show("您没有修改用户的权限", "waring");
      } else {
        let arr = [],
          nameArr = [];
        this.userData.forEach(item => {
          if (item.checked) {
            arr.push(item.uid);
            nameArr.push(item.realname);
          }
        });
        if (arr.length === 0) {
          this.$tip.show("请选择用户再进行操作", "error");
        } else {
          modifyUser({
            status: staStr,
            uids: arr.toString()
          }).then(res => {
            this.queryUserdata();
            if (res) {
              this.$tip.show(
                `${str}用户 ${nameArr.toString()} 成功`,
                "success"
              );
            } else {
              this.$tip.show(
                `未知错误，${str}用户 ${nameArr.toString()} 失败`,
                "error"
              );
            }
          });
        }
      }
    },
    //启用用户权限
    openUser() {
      this.changeUser("enable", "启用");
    },
    //禁用用户权限
    closeUser() {
      this.changeUser("unenable", "禁用");
    },
    //修改管理员按钮
    modifyManage() {
      if (this.addShow) {
        this.$tip.show("请先完成添加后设置权限", "info");
      } else {
        this.showModify = !this.showModify;
        this.manageData.forEach((item, index) => {
          if (item.role !== 0) {
            this.manageData[index].show = true;
          }
        });
        if (this.showModify) {
          this.modifyText = "返回管理员列表";
        } else {
          this.modifyText = "设置/修改管理员权限";
        }
      }
    },
    //添加用户按钮
    addManage() {
      if (this.showModify) {
        this.$tip.show("请先设置完权限后再添加用户", "info");
      } else {
        this.addShow = !this.addShow;
      }
    },
    add() {
      if (this.manageName.length === 0 || this.managePassword.length === 0) {
        this.$tip.show("请输入管理员登录名和密码", "error");
      } else {
        addManage({
          username: this.manageName,
          password: this.managePassword
        }).then(res => {
          if (res) {
            this.queryManageData();
            this.$tip.show(`添加管理员${this.manageName}成功`, "success");
            this.manageName = "";
            this.managePassword = "";
            this.addShow = false;
          } else {
            this.$tip.show(
              "添加管理员失败，请检查是否与其他管理员重名",
              "error"
            );
            this.manageName = "";
            this.managePassword = "";
            this.addShow = false;
          }
        });
      }
    },
    //取消添加
    cancelAdd() {
      this.addShow = false;
    },
    //分页点击
    onPageChange(event) {
      this.pageNumber = event.pageNumber;
      this.pageSize = event.pageSize;
      this.userData = this.totalUserData.slice(
        (this.pageNumber - 1) * this.pageSize,
        this.pageNumber * this.pageSize
      );
      // this.totalUserData.forEach((item, index) => {
      //   this.totalUserData[index].checked = false;
      // });
    },
    //查询用户数据方法
    queryUserdata() {
      queryUser().then(res => {
        res.forEach(item => {
          item.registerdate = new Date(item.registerdate)
            .toLocaleDateString()
            .replace(/\//g, "-");
          item.checked = false;
        });
        this.totalUserData = res;
        this.userData = this.totalUserData.slice(
          (this.pageNumber - 1) * this.pageSize,
          this.pageNumber * this.pageSize
        );
        this.total = res.length;
      });
    },
    //查询管理员数据方法
    queryManageData() {
      queryManage().then(res => {
        res.forEach((item, index) => {
          this.$set(this.manageData, index, new manageFormat(item));
        });
      });
    }
  },
  computed: {
    checkAll() {
      this.all = this.userData.every(item => item.checked);
      return this.userData.every(item => item.checked);
    }
  },
  created() {
    this.power = this.user.permissions;
    this.role = this.user.role;
    if (this.role === 0) {
      this.queryManageData();
    }
    this.queryUserdata();
  }
};
</script>

<style lang="less" scoped>
.title {
  .info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20px;
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
.welcome {
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 18px;
    color: #ec2c64;
    transform: translate(-50%, -100%);
  }
}
.manageInfo {
  .manageNav {
    width: 100%;
    border-bottom: 1px solid #ddd;
    .navBox {
      display: flex;
      align-items: center;
      width: 30%;
      user-select: none;
      div {
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        &:first-child {
          border-right: 1px solid #ddd;
          padding-right: 10px;
          width: 40%;
          text-align: center;
        }
        &:last-child {
          width: 60%;
          text-align: center;
        }
      }
    }

    img {
      width: 12px;
      height: 12px;
      vertical-align: baseline;
      margin-right: 2px;
    }
  }
  .manageTable {
    border-collapse: collapse;
    border-spacing: 0;
    tr {
      line-height: 40px;
      height: 40px;
      th {
        border: 1px solid #dddddd;
        border-top: none;
        text-align: center;
        width: 13%;
        &:nth-child(4) {
          width: 55%;
        }
      }
      td {
        border: 1px solid #dddddd;
        text-align: center;
        &:nth-child(3) {
          color: #999;
        }
        .addInp {
          width: 100%;
          height: 40px;
        }
      }
      .operate {
        display: flex;
        height: 40px;
        align-items: center;
        width: 160px;
        justify-content: space-around;
        div {
          width: 60px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          border-radius: 5px;
        }
        .save {
          background-color: cadetblue;
        }
        .cancel {
          background-color: #c02c38;
        }
      }
    }
  }
}
.userInfo {
  .userNav {
    display: flex;
    justify-content: space-around;
    width: 20%;
    align-items: center;
    user-select: none;
    div {
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      &:first-child {
        border-right: 1px solid #ddd;
        padding-right: 10px;
      }
    }
    img {
      width: 12px;
      height: 12px;
      vertical-align: baseline;
      margin-right: 2px;
    }
  }
  .userTable {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    tr {
      line-height: 40px;
      height: 40px;
      th {
        border: 1px solid #dddddd;
        width: 12.5%;
        text-align: center;
        &:nth-child(1) {
          width: 5%;
        }
      }
      td {
        border: 1px solid #dddddd;
        text-align: center;
      }
      .checkBox {
        margin: 0 auto;
      }
    }
  }
  .pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.leftTitle {
  background-color: #ddd;
  height: 100%;
  width: 100%;
  .letftNav {
    position: absolute;
    top: 30px;
    left: 0;
    height: 40px;
    width: 100%;
    line-height: 40px;
    cursor: pointer;
    user-select: none;
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin: 0 5px;
    }
    div {
      &:hover {
        background-color: #f1939c;
      }
    }
    .userMenue {
      border-top: 1px solid #95b8e7;
      border-bottom: 1px solid #95b8e7;
    }
    .manageMenue {
      border-bottom: 1px solid #95b8e7;
    }
    .active {
      background-color: #f1939c;
    }
  }
}
</style>
