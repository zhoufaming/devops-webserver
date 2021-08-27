<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="user" />
      <el-tab-pane label="菜单管理" name="menu" />
      <el-tab-pane label="权限管理" name="perm" />
    </el-tabs>
    <el-transfer v-model="transferValue" style="margin-left:10%;width: 80%" :data="transferData" :titles="titles" />
    <el-button style="margin-left: 80%" type="primary" @click="submitTrans">提交</el-button>
  </div>
</template>

<script>
import { getUsers, getMenus, getPerms, submitUsers, submitPerms, submitMenus } from '@/api/role'
export default {
  data() {
    return {
      activeName: 'user',
      roleId: this.$route.params.id,
      titles: [],
      transferValue: [],
      transferData: []
    }
  },
  created() {
    this.loadData('user')
  },
  methods: {
    // 加载数据
    loadData(name) {
      switch (name) {
        case 'user':
          getUsers({ role_id: this.roleId }).then(response => {
            this.titles = ['未选用户', '选中用户']
            this.transferData = response.users
            this.transferValue = response.choose_users
          })
          break
        case 'menu':
          getMenus({ role_id: this.roleId }).then(response => {
            this.titles = ['未选菜单', '选中菜单']
            this.transferData = response.menus
            this.transferValue = response.choose_menus
          })
          break
        case 'perm':
          getPerms({ role_id: this.roleId }).then(response => {
            this.titles = ['未选权限', '拥有权限']
            this.transferData = response.perms
            this.transferValue = response.choose_perms
          })
      }
    },
    handleClick(tab, event) {
      this.activeName = tab.name
      this.loadData(this.activeName)
    },
    submitTrans() {
      switch (this.activeName) {
        case 'user':
          submitUsers({ role_id: this.roleId, users: this.transferValue }).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
          })
          break
        case 'menu':
          submitMenus({ role_id: this.roleId, menus: this.transferValue }).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
          })
          break
        case 'perm':
          submitPerms({ role_id: this.roleId, perms: this.transferValue }).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
          })
          break
      }
    }
  }
}
</script>
