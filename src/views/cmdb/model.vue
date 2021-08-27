<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="dialogVisible=true">新增模型</el-button>
    </div>
    <ul class="model-list clearfix">
      <li v-for="type in types" :key="type.type_name" class="model-item bgc-white">
        <div class="info-model" @click="typeEdit(type.type_id)">
          <div class="icon-box" align="center">
            <svg-icon :icon-class="type.type_icon" class-name="icon" />
          </div>
          <div class="model-details">
            <p class="model-name" :title="type.type_label">{{ type.type_label }}</p>
            <p class="model-id" :title="type.type_name">{{ type.type_name }}</p>
          </div>
        </div>
      </li>
    </ul>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form ref="typeForm" :model="newType" :rules="addRule">
        <el-form-item label="类型标识" prop="type_label">
          <el-input v-model="newType.type_label" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型名" prop="type_name">
          <el-input v-model="newType.type_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型图标" prop="type_icon">
          <el-select v-model="newType.type_icon" filterable placeholder="请选择图标..">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addType } from '@/api/cmdb'
export default {
  data() {
    return {
      types: [],
      dialogVisible: false,
      dialogTitle: '新增类型',
      newType: {
        type_label: null,
        type_name: null,
        type_icon: null
      },
      icons: [
        { 'icon_name': 'cc-activeMQ' }, { 'icon_name': 'cc-android' }, { 'icon_name': 'cc-apache' }, { 'icon_name': 'cc-apple' }, { 'icon_name': 'cc-architecture' }, { 'icon_name': 'cc-backstage' }, { 'icon_name': 'cc-balance' }, { 'icon_name': 'cc-broom' }, { 'icon_name': 'cc-business' }, { 'icon_name': 'cc-cabinet' }, { 'icon_name': 'cc-certificate' }, { 'icon_name': 'cc-clear' }, { 'icon_name': 'cc-cloud-host' }, { 'icon_name': 'cc-cloud-to-uploa' }, { 'icon_name': 'cc-collect' }, { 'icon_name': 'cc-cpu' }, { 'icon_name': 'cc-database' }, { 'icon_name': 'cc-db2' }, { 'icon_name': 'cc-del' }, { 'icon_name': 'cc-department' }, { 'icon_name': 'cc-domain' }, { 'icon_name': 'cc-elastic-search' }, { 'icon_name': 'cc-firewall' }, { 'icon_name': 'cc-hardware' }, { 'icon_name': 'cc-hide' }, { 'icon_name': 'cc-home' }, { 'icon_name': 'cc-idc' }, { 'icon_name': 'cc-iis' }, { 'icon_name': 'cc-influxdb' }, { 'icon_name': 'cc-ip' }, { 'icon_name': 'cc-kafka' }, { 'icon_name': 'cc-kubernetes' }, { 'icon_name': 'cc-linux' }, { 'icon_name': 'cc-list' }, { 'icon_name': 'cc-lock' }, { 'icon_name': 'cc-mail-server' }, { 'icon_name': 'cc-map' }, { 'icon_name': 'cc-market' }, { 'icon_name': 'cc-memory' }, { 'icon_name': 'cc-middleware' }, { 'icon_name': 'cc-module' }, { 'icon_name': 'cc-mongodb' }, { 'icon_name': 'cc-mysql' }, { 'icon_name': 'cc-net-port' }, { 'icon_name': 'cc-network-card' }, { 'icon_name': 'cc-network-equipment' }, { 'icon_name': 'cc-network-manage' }, { 'icon_name': 'cc-network-segment' }, { 'icon_name': 'cc-networks' }, { 'icon_name': 'cc-nginx' }, { 'icon_name': 'cc-oracle' }, { 'icon_name': 'cc-postgresql' }, { 'icon_name': 'cc-printer' }, { 'icon_name': 'cc-rabbitmq' }, { 'icon_name': 'cc-redis' }, { 'icon_name': 'cc-rocketmq' }, { 'icon_name': 'cc-router' }, { 'icon_name': 'cc-security' }, { 'icon_name': 'cc-security2' }, { 'icon_name': 'cc-server' }, { 'icon_name': 'cc-service' }, { 'icon_name': 'cc-setting' }, { 'icon_name': 'cc-sql-server' }, { 'icon_name': 'cc-sqlite' }, { 'icon_name': 'cc-star' }, { 'icon_name': 'cc-storage' }, { 'icon_name': 'cc-tomcat' }, { 'icon_name': 'cc-tree' }, { 'icon_name': 'cc-triangle' }, { 'icon_name': 'cc-unix' }, { 'icon_name': 'cc-ups' }, { 'icon_name': 'cc-user' }, { 'icon_name': 'cc-virtual' }, { 'icon_name': 'cc-vmware' }, { 'icon_name': 'cc-vsphere' }, { 'icon_name': 'cc-weblogic' }, { 'icon_name': 'cc-win7' }, { 'icon_name': 'cc-wireless' }, { 'icon_name': 'cc-aliyun' }, { 'icon_name': 'cc-huawei' }, { 'icon_name': 'cc-qing' }, { 'icon_name': 'cc-git' }
      ],
      addRule: {
        type_label: [
          { required: true, message: '请输入类型标识', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        type_name: [
          { required: true, message: '请输入类型名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        type_icon: [
          { required: true, message: '请输入类型图标', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCMDBList()
  },
  methods: {
    getCMDBList() {
      getList().then(response => {
        this.types = response.types
      })
    },
    addType() {
      addType(this.newType).then(response => {
        this.dialogVisible = false
        this.getCMDBList()
        this.newType = {
          type_label: null,
          type_name: null,
          type_icon: null
        }
        this.$message({
          message: response.message,
          type: 'success'
        }
        )
      })
    },
    typeEdit(typeId) {
      this.$router.push(`/cmdb/edit_type/${typeId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix {
  zoom: 1;
  &:before,
  &:after {
      content: "";
      display: table;
      clear: both;
  }
}
.bgc-white {
    background-color: #fff;
}
.model-list {
    padding-left: 12px;
    overflow: hidden;
    transition: height .2s;
    .model-item {
        display: flex;
        position: relative;
        float: left;
        margin: 10px 10px 0 0;
        width: calc((100% - 10px * 4) / 5);
        height: 70px;
        border: 1px solid #dde4eb;
        border-radius: 4px;
        background-color: #ffffff;
        cursor: pointer;
        &:nth-child(5n) {
            margin-right: 0;
        }
        &.ispaused {
            background: #fcfdfe;
            border-color: #dde4eb;
            .icon-box {
                color: #96c2f7;
            }
            .model-name {
                color: #bfc7d2;
            }
        }
        &.ispre {
            .icon-box {
                color: #798aad;
            }
        }
        &:hover {
            border-color: #dde4eb;
            .info-instance {
                display: block;
            }
        }
        .icon-box {
            float: left;
            width: 66px;
            height: 68px;
            font-size: 32px;
            color: #3a84ff;
            .icon {
                height: 68px;
            }
        }
        .model-details {
            padding: 0 4px 0 0;
            overflow: hidden;
        }
        .model-name {
            margin-top: 16px;
            line-height: 14px;
            font-size: 14px;
        }
        .model-id {
            line-height: 14px;
            font-size: 12px;
            color: #bfc7d2;
        }
        .info-model {
            flex: 1;
            width: 0;
            border-radius: 4px 0 0 4px;
            &:hover {
                background-color: #f0faff;
              p {
                        color: #3a84ff;
                    }
            }
            &.radius {
                border-radius: 4px;
            }
        }
        .info-instance {
            display: none;
            width: 70px;
            padding: 0 8px 0 6px;
            text-align: center;
            color: #c3cdd7;
            border-radius: 0 4px 4px 0;
            &:hover {
                background-color: #f0f5ff;
                p {
                    color: #3a84ff;
                }
            }
            p {
                font-size: 16px;
                padding-top: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
