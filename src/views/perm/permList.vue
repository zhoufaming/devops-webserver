<template>
  <div class="app-container">
    <div>
      <el-button type="primary" style="float:right" @click="handleAdd">新增权限</el-button>
      <el-input v-model="search" style="width: 20%;float: right;margin-right: 5%" placeholder="请输入搜索权限" prefix-icon="el-icon-search" @change="loadPerm" />
    </div>
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="perms"
      border
      highlight-current-row
    >
      <el-table-column type="index" :index="indexMethod" width="50" />
      <el-table-column label="权限名" property="perm_name" />
      <el-table-column label="对应接口" property="perm_interface" />
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editPerm(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        class="mt-20 text-right"
        align="right"
        :hide-on-single-page="hidePage"
        background
        layout="total,sizes,prev,pager,next,jumper"
        :current-page.sync="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
    <el-dialog :title="title" :visible.sync="addVisible">
      <el-form ref="permForm" :model="newPerm" :rules="addRule">
        <el-form-item label="权限名" prop="perm_name">
          <el-input v-model="newPerm.perm_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="对应接口" prop="perm_interface">
          <el-input v-model="newPerm.perm_interface" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPerm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPerms, addPerm, editPerm } from '@/api/perm'
export default {
  data() {
    return {
      perms: [],
      listLoading: true,
      addVisible: false,
      newPerm: {},
      search: '',
      addFlag: true,
      hidePage: true,
      title: '添加权限',
      pagination: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      addRule: {
        perm_name: [
          { required: true, message: '请输入权限名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        perm_interface: [
          { required: true, message: '请输入接口', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadPerm()
  },
  methods: {
    loadPerm() {
      const params = {
        page_no: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        search_perm: this.search
      }
      this.listLoading = true
      getPerms(params).then(response => {
        this.perms = response.perms
        this.listLoading = false
        this.pagination.total = response.total
      })
    },
    handlePageChange() {
      // table改变, 重新加载数据
      this.loadPerm()
    },
    handleSizeChange(newPageSize) {
      // 页数大小改变
      const { pagination } = this
      pagination.pageSize = newPageSize
      this.handlePageChange(pagination.currentPage = 1)
    },
    indexMethod(index) {
      // 索引改变
      return index + (this.pagination.currentPage - 1) * this.pagination.pageSize + 1
    },
    handleAdd() {
      this.addVisible = true
      this.newPerm = {}
      this.addFlag = true
      this.title = '新增权限'
    },
    editPerm(row) {
      this.newPerm = JSON.parse(JSON.stringify(row))
      this.title = '修改权限'
      this.addVisible = true
      this.addFlag = false
    },
    addPerm() {
      // addFlag为true就是add否则为edit
      if (this.addFlag) {
        addPerm(this.newPerm).then(response => {
          this.listLoading = true
          this.loadPerm()
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
      } else {
        editPerm(this.newPerm).then(response => {
          this.listLoading = true
          this.loadPerm()
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
      }
      this.addVisible = false
    }
  }
}
</script>

