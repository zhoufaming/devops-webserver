<template>
  <div class="app-container">
    <el-form :inline="true" :model="editModel">
      <el-form-item label="类型标识" prop="type_label">
        <el-input v-model="editModel.type_label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型名" prop="type_name">
        <el-input v-model="editModel.type_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型图标" prop="type_icon">
        <el-select v-model="editModel.type_icon" filterable placeholder="请选择图标..">
          <el-option
            v-for="icon in icons"
            :key="icon.icon_name"
            :label="icon.icon_name"
            :value="icon.icon_name"
            align="center"
          >
            <svg-icon :icon-class="icon.icon_name" style="width: 60px;height: 30px" />
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-edit" round @click="modelEdit">
        修改
      </el-button>
    </el-form>
    <div>
      <el-button type="primary" @click="addModuleItem">新增属性</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="items"
      border
      highlight-current-row
    >
      <el-table-column label="标签名" property="item_label" />
      <el-table-column label="属性名" property="item_name" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="editModuleItem(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form :model="editItem" :rules="editRules">
        <el-form-item label="标签名" prop="item_label">
          <el-input v-model="editItem.item_label" autocomplete="off" />
        </el-form-item>
        <el-form-item label="属性名" prop="item_name">
          <el-input v-model="editItem.item_name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getItems, addItem, editItem, getItemInfo, getType, editType } from '@/api/cmdb'
export default {
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      title: '',
      items: [],
      typeID: this.$route.params.id,
      editModel: {},
      editItem: { cmdb_type_id: this.$route.params.id },
      editFlag: false,
      icons: [
        { 'icon_name': 'cc-activeMQ' }, { 'icon_name': 'cc-android' }, { 'icon_name': 'cc-apache' }, { 'icon_name': 'cc-apple' }, { 'icon_name': 'cc-architecture' }, { 'icon_name': 'cc-backstage' }, { 'icon_name': 'cc-balance' }, { 'icon_name': 'cc-broom' }, { 'icon_name': 'cc-business' }, { 'icon_name': 'cc-cabinet' }, { 'icon_name': 'cc-certificate' }, { 'icon_name': 'cc-clear' }, { 'icon_name': 'cc-cloud-host' }, { 'icon_name': 'cc-cloud-to-uploa' }, { 'icon_name': 'cc-collect' }, { 'icon_name': 'cc-cpu' }, { 'icon_name': 'cc-database' }, { 'icon_name': 'cc-db2' }, { 'icon_name': 'cc-del' }, { 'icon_name': 'cc-department' }, { 'icon_name': 'cc-domain' }, { 'icon_name': 'cc-elastic-search' }, { 'icon_name': 'cc-firewall' }, { 'icon_name': 'cc-hardware' }, { 'icon_name': 'cc-hide' }, { 'icon_name': 'cc-home' }, { 'icon_name': 'cc-idc' }, { 'icon_name': 'cc-iis' }, { 'icon_name': 'cc-influxdb' }, { 'icon_name': 'cc-ip' }, { 'icon_name': 'cc-kafka' }, { 'icon_name': 'cc-kubernetes' }, { 'icon_name': 'cc-linux' }, { 'icon_name': 'cc-list' }, { 'icon_name': 'cc-lock' }, { 'icon_name': 'cc-mail-server' }, { 'icon_name': 'cc-map' }, { 'icon_name': 'cc-market' }, { 'icon_name': 'cc-memory' }, { 'icon_name': 'cc-middleware' }, { 'icon_name': 'cc-module' }, { 'icon_name': 'cc-mongodb' }, { 'icon_name': 'cc-mysql' }, { 'icon_name': 'cc-net-port' }, { 'icon_name': 'cc-network-card' }, { 'icon_name': 'cc-network-equipment' }, { 'icon_name': 'cc-network-manage' }, { 'icon_name': 'cc-network-segment' }, { 'icon_name': 'cc-networks' }, { 'icon_name': 'cc-nginx' }, { 'icon_name': 'cc-oracle' }, { 'icon_name': 'cc-postgresql' }, { 'icon_name': 'cc-printer' }, { 'icon_name': 'cc-rabbitmq' }, { 'icon_name': 'cc-redis' }, { 'icon_name': 'cc-rocketmq' }, { 'icon_name': 'cc-router' }, { 'icon_name': 'cc-security' }, { 'icon_name': 'cc-security2' }, { 'icon_name': 'cc-server' }, { 'icon_name': 'cc-service' }, { 'icon_name': 'cc-setting' }, { 'icon_name': 'cc-sql-server' }, { 'icon_name': 'cc-sqlite' }, { 'icon_name': 'cc-star' }, { 'icon_name': 'cc-storage' }, { 'icon_name': 'cc-tomcat' }, { 'icon_name': 'cc-tree' }, { 'icon_name': 'cc-triangle' }, { 'icon_name': 'cc-unix' }, { 'icon_name': 'cc-ups' }, { 'icon_name': 'cc-user' }, { 'icon_name': 'cc-virtual' }, { 'icon_name': 'cc-vmware' }, { 'icon_name': 'cc-vsphere' }, { 'icon_name': 'cc-weblogic' }, { 'icon_name': 'cc-win7' }, { 'icon_name': 'cc-wireless' }, { 'icon_name': 'cc-aliyun' }, { 'icon_name': 'cc-huawei' }, { 'icon_name': 'cc-qing' }, { 'icon_name': 'cc-git' }
      ],
      editRules: {
        item_label: [
          { required: true, message: '请输入label', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        item_name: [
          { required: true, message: '请输入name', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getModel()
    this.getItemList()
  },
  methods: {
    getModel() {
      getType({ 'type_id': this.typeID }).then(response => {
        this.editModel = {
          type_id: response.type_id,
          type_label: response.type_label,
          type_name: response.type_name,
          type_icon: response.type_icon
        }
      })
    },
    modelEdit() {
      editType(this.editModel).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    getItemList() {
      getItems({ 'type_id': this.typeID }).then(response => {
        this.items = response.items
      })
      this.listLoading = false
    },
    addModuleItem() {
      this.title = '新增属性'
      this.editItem = { cmdb_type_id: this.typeID }
      this.dialogVisible = true
      this.editFlag = false
    },
    editModuleItem(row) {
      getItemInfo(row.item_id).then(response => {
        this.editItem = {
          cmdb_type_id: this.typeID,
          item_name: response.item_name,
          item_label: response.item_label,
          item_id: response.item_id
        }
      })
      this.dialogVisible = true
      this.title = '修改属性'
      this.editFlag = true
    },
    postItem() {
      if (this.editFlag) {
        this.editItemSubmit()
      } else {
        this.addItemSubmit()
      }
      this.dialogVisible = false
    },
    addItemSubmit() {
      addItem(this.editItem).then(response => {
        this.getItemList()
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    editItemSubmit() {
      editItem(this.editItem).then(response => {
        this.getItemList()
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    }
  }
}
</script>
