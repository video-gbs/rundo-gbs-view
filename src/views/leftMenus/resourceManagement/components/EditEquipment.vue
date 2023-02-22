<template>
  <div class="addequipment-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >编辑设备</span
        >
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
        <span>基本信息</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="140px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备类型">
                <el-radio-group v-model="form.deviceType">
                  <el-radio label="1">DVR</el-radio>
                  <el-radio label="2">NVR</el-radio>
                  <el-radio label="3">CVR</el-radio>
                  <el-radio label="4">DVS</el-radio>
                  <el-radio label="5">IPS</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="desc" label="关联设备接入网关">
                <el-select
                  v-model="form.gatewayId"
                  placeholder="请选择"
                  style="width: 436px"
                >
                  <el-option
                    v-for="o in allNorthTypeOptions"
                    :label="o.label"
                    :value="o.value"
                    :key="o.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="设备名称">
                <el-input v-model="form.name" style="width: 436px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="desc" label="安防区域">
                <el-select
                  ref="selectTree"
                  v-model="form.videoAreaId"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  style="width: 436px"
                  class="selectTree"
                >
                  <el-option :value="List">
                    <el-tree
                      class="unit-tree"
                      :data="treeList"
                      node-key="id"
                      :props="defaultProps"
                      :default-expanded-keys="Ids"
                      ref="tree"
                      highlight-current
                      :expand-on-click-node="false"
                      @node-click="nodeClickHandle"
                    >
                    </el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item prop="desc" label="设备厂商">
                <el-select
                  v-model="form.manufacturer"
                  placeholder="请选择"
                  style="width: 436px"
                >
                  <el-option
                    v-for="o in manufacturerTypeOptions"
                    :label="o.label"
                    :value="o.value"
                    :key="o.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24"
              ><el-form-item prop="model" label="设备型号">
                <el-input
                  v-model="form.model"
                  style="width: 436px"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item prop="desc" label="用户名称">
                <el-input
                  v-model="form.username"
                  style="width: 436px"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item prop="desc" label="密码">
                <el-input
                  v-model="form.password"
                  style="width: 436px"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
      </div>
      <div class="box-card1">
        <div class="clearfix1">
          <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
          <span>参数信息</span>
        </div>
        <div class="text item">
          <el-form
            ref="form1"
            :model="form1"
            label-width="140px"
            :rules="rules"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item
                  prop="ip"
                  label="IP地址"
                  style="margin-left: 20px"
                >
                  <el-input v-model="form1.ip" style="width: 436px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="port" label="设备端口">
                  <el-input
                    v-model="form1.port"
                    style="width: 436px"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  prop="transport"
                  label="传输协议"
                  style="margin-left: 20px"
                >
                  <el-select
                    v-model="form1.transport"
                    placeholder="请选择"
                    style="width: 436px"
                  >
                    <el-option label="tcp" value="0"></el-option>
                    <el-option label="区域二" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                ><el-form-item label="经度" style="margin-left: 20px">
                  <el-input
                    v-model="form1.longitude"
                    style="width: 436px"
                  ></el-input> </el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="纬度">
                  <el-input
                    v-model="form1.latitude"
                    style="width: 436px"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
          </el-form>
        </div>
        <div class="dialog-footer">
          <el-button @click="goback()"
            ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
          >
          <el-button type="primary" @click="save()"
            ><svg-icon class="svg-btn" icon-class="save" />保存</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getVideoAraeTree } from '@/api/method/role'
import { editEncoder } from '@/api/method/encoder'
import { getAllNorthLists } from '@/api/method/moduleManagement'
import { getManufacturerDictionaryList } from '@/api/method/dictionary'
export default {
  name: '',
  components: {},
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        model: '',
        username: '',
        deviceType: '',
        manufacturer: '',
        videoAreaId: '',
        name: '',
        password: ''
      },
      form1: {
        ip: '',
        transport: '',
        latitude: '',
        longitude: '',
        port: ''
      },
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      editId: '',
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      allNorthTypeOptions: [],
      manufacturerTypeOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        ip: [{ required: true, message: '请填写ip', trigger: 'blur' }]
      }
    }
  },
  created() {
    console.log('this.$route.query.row', this.$route.query)
    const {
      model,
      userName,
      deviceType,
      manufacturer,
      videoAreaId,
      name,
      password,
      transport,
      latitude,
      longitude,
      port,
      ip
    } = this.$route.query.row
    this.form1.ip = ip
    this.form1.transport = transport
    this.form1.latitude = latitude
    this.form1.longitude = longitude
    this.form1.port = port
    this.form.password = password
    this.form.name = name
    this.form.password = password
    this.form.videoAreaId = videoAreaId
    this.form.manufacturer = manufacturer
    this.form.model = model
    this.form.userName = userName
    this.form.deviceType = deviceType + ''
    this.form.gatewayId = 7
    this.editId = this.$route.query.row.id
  },
  mounted() {
    this.init()
    this.getAllNorthLists()
    this.getManufacturerDictionaryList()
  },
  methods: {
    async init(id) {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getManufacturerDictionaryList() {
      await getManufacturerDictionaryList('EquipmentCompany').then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.manufacturerTypeOptions.push(obj)
          })
        }
      })
    },
    async getAllNorthLists() {
      await getAllNorthLists().then((res) => {
        if (res.code === 0) {
          res.data.map((item) => {
            let obj = {}
            obj.label = item.name
            obj.value = item.dispatchId
            this.allNorthTypeOptions.push(obj)
          })
        }
      })
    },
    // 点击节点选中
    nodeClickHandle(data) {
      this.form.videoAreaId = data.areaName
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    save() {
      // console.log(1111,this.$refs.userTable.selection)
      Promise.all([
        this.$refs.form.validate(),
        this.$refs.form1.validate()
      ]).then(() => {
        this.form.videoAreaId = this.Id
        this.form.deviceType = Number(this.form.deviceType)
        this.form.gatewayId = 7

        editEncoder({
          ...this.form,
          ...this.form1,
          deviceId: 1,
          id: this.editId
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.goback()
          }
        })
      })
    },
    goback() {
      if (this.$route.query.back === '1') {
        this.$router.push({ path: '/equipment' })
      } else {
        this.$router.push({ path: '/registrationList' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
::v-deep .el-card__header {
  padding: 0 16px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
}
.addequipment-content {
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .back-svg {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    .back-title {
      position: relative;
      top: 0px;
      left: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }
  }
  .box-card {
    margin: 20px 20px 0 20px;

    .clearfix {
      height: 80px;
      line-height: 62px;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
  }
  .box-card1 {
    margin: 0 -20px;

    .clearfix1 {
      height: 62px;
      line-height: 62px;
      padding-left: 20px;

      border-bottom: 1px solid #eaeaea;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
    .text {
      margin-top: 20px;
    }
  }
  .dialog-footer {
    width: 100%;
    height: 52px;
    line-height: 52px;
    position: relative;
    bottom: 0;
    right: 0px;
    text-align: right;
    border-top: 1px solid #eaeaea;
    > .el-button {
      margin-right: 20px;
    }
    .svg-btn {
      position: relative;
      top: 1px;
      left: -4px;
    }
  }
}
</style>
