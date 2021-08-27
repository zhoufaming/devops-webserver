<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="addVisible=true,newRole={}">新增角色</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="roles"
      border
      highlight-current-row
    >
      <el-table-column type="index" width="50" />
      <el-table-column label="角色名" property="role_name" />
      <el-table-column label="成员个数" property="user_count" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editRole(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加角色" :visible.sync="addVisible">
      <el-form ref="roleForm" :model="newRole" :rules="addRule">
        <el-form-item label="角色名" prop="role_name">
          <el-input v-model="newRole.role_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="role_desc">
          <el-input v-model="newRole.role_desc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, roleAdd } from '@/api/role'
export default {
  data() {
    return {
      roles: [],
      listLoading: true,
      addVisible: false,
      newRole: {},
      addRule: {
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        role_desc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadRole()
  },
  methods: {
    loadRole() {
      getRoles().then(response => {
        this.roles = response.roles
        this.listLoading = false
      })
    },
    editRole(row) {
      const roleId = row.role_id
      this.$router.push({ path: `/role/edit/${roleId}` })
    },
    addRole() {
      roleAdd(this.newRole).then(response => {
        this.loadRole()
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.addVisible = false
      })
    }
  }
}
</script>

