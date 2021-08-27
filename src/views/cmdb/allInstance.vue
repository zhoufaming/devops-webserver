<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="addDialog">新增实例</el-button>
      <el-button type="success" @click="drawer=true">导入实例</el-button>
      <el-input v-model="search" style="width: 20%;float: right;margin-right: 5%" placeholder="请输入搜索信息" prefix-icon="el-icon-search" @change="getAllInstance" />
      <el-drawer
        title="实例导入"
        :visible.sync="drawer"
        :before-close="handleClose"
      >
        <div align="center">
          <el-upload
            ref="upload"
            drag
            action="#"
            accept=".xlsx"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :http-request="uploadExcel"
            :limit="1"
            :on-exceed="handleExceed"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击此处上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传Excel文件，且不超过10M</div>
          </el-upload>
          <br>
          <div>
            <el-link type="success" :href="downloadUrl" :download="fileName">点击下载模板<i class="el-icon-download el-icon--left" /> </el-link>
          </div>
          <div align="right" style="margin-right: 10px">
            <el-button type="primary" @click="submitUpload">上 传</el-button>
          </div>
        </div>

      </el-drawer>
    </div>
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="instances"
      border
      highlight-current-row
    >
      <el-table-column v-for="item in items" :key="item.item_id" :label="item.item_label">
        <template slot-scope="scope">
          <div v-if="tagFlag(item.item_name) && scope.row.cmdb_record_detail[item.item_name]">
            <el-tag v-for="info in scope.row.cmdb_record_detail[item.item_name].split(';')" :key="info">
              {{ info }}
            </el-tag>
          </div>
          <span v-else>
            {{ scope.row.cmdb_record_detail[item.item_name] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="editPerm" label="操作" width="100" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="editDialog(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteInstance(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column v-if="typeID==='1349534453021675520'" fixed="right" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-s-platform"
            round
            size="small"
            @click="openWebssh(scope.row)"
          >网页终端</el-button>
        </template>
      </el-table-column>
      <el-table-column v-else-if="typeID==='1349287493794664448'" fixed="right" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-s-platform"
            round
            size="small"
            @click="openReport(scope.row)"
          >查看报表</el-button>
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
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form :model="newInstance">
        <template v-for="item in items">
          <el-form-item :key="item.item_id" :label="item.item_label" :prop="item.item_name">
            <el-input v-model="newInstance[item.item_name]" autocomplete="off" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInstance">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addNewRecord, deleteRecord, editOldRecord, getInstance } from '@/api/cmdb'
import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      listLoading: true,
      show: false,
      dialogVisible: false,
      hidePage: false,
      title: '新增实例',
      instances: [],
      items: [],
      editPerm: true,
      typeID: this.$route.params.id,
      newInstance: { cmdb_type_id: this.$route.params.id },
      addFlag: true,
      drawer: false,
      downloadUrl: '',
      fileName: '',
      pagination: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      search: ''
    }
  },
  created() {
    this.getAllInstance()
    this.downloadTml()
  },
  methods: {
    tagFlag(name) {
      const tagNames = ['services', 'project', 'outer_ports', 'owner']
      // 如果在list内就用tag显示
      return tagNames.indexOf(name) >= 0
    },
    getAllInstance() {
      this.listLoading = true
      const { pagination } = this
      getInstance({ 'type_id': this.typeID, 'page_no': pagination.currentPage, 'page_size': pagination.pageSize, 'search_str': this.search }).then(response => {
        this.instances = response.instances
        this.items = response.items
        this.pagination.total = response.total
      })
      this.show = true
      this.listLoading = false
    },
    handlePageChange() {
      // table改变, 重新加载数据
      this.getAllInstance()
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
    editDialog(row) {
      row = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.title = '修改实例'
      this.addFlag = false
      this.newInstance = Object.assign(row.cmdb_record_detail, { cmdb_type_id: this.typeID, cmdb_record_id: row.cmdb_record_id })
    },
    addDialog() {
      this.dialogVisible = true
      this.title = '新增实例'
      this.newInstance = { cmdb_type_id: this.typeID }
      this.addFlag = true
    },
    addRecord() {
      addNewRecord(this.newInstance).then(response => {
        this.getAllInstance()
        this.dialogVisible = false
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    editRecord() {
      editOldRecord(this.newInstance).then(response => {
        this.getAllInstance()
        this.dialogVisible = false
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    submitInstance() {
      if (this.addFlag) {
        this.addRecord()
      } else {
        this.editRecord()
      }
    },
    deleteInstance(row) {
      const record_id = row.cmdb_record_id
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecord({ record_id: record_id }).then(response => {
          this.getAllInstance()
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
      })
    },
    openWebssh(row) {
      window.open(`/#/cmdb/web_ssh/${row.cmdb_record_id}`)
    },
    openReport(row) {
      window.open(row.cmdb_record_detail.report)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.upload.clearFiles()
          done()
        })
        .catch(_ => {})
    },
    beforeUpload(file) {
      const isEXCEL = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isEXCEL) {
        this.$message.error('上传文件只能是 Excel 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isEXCEL && isLt10M
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件')
    },
    uploadExcel(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('uploadType', param.file.type)
      request({
        url: `/cmdb/import_record/${this.typeID}`,
        method: 'post',
        data: formData
      }).then(response => {
        param.onSuccess()
        this.$message.success('导入成功')
        this.getAllInstance()
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    downloadTml() {
      axios({
        url: `${process.env.VUE_APP_BASE_API}/cmdb/create_cmdb_template/${this.typeID}`,
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        method: 'get',
        responseType: 'blob'
      }).then(response => {
        this.fileName = window.decodeURI(response.headers['content-disposition'].split('=')[1].split('\'\'')[1], 'UTF-8')
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        this.downloadUrl = URL.createObjectURL(blob)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
   :focus{
        outline:0;
    }
</style>
