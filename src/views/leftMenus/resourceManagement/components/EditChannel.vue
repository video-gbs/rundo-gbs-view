<template>
  <div class="editChannel-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >编辑通道设备</span
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
              <el-form-item prop="channelCode" label="通道编号">
                <el-input
                  v-model="form.channelCode"
                  style="width: 436px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="channelName" label="通道名称">
                <el-input
                  v-model="form.channelName"
                  style="width: 436px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="channelType" label="通道类型">
                <el-select
                  v-model="form.channelType"
                  placeholder="请选择"
                  style="width: 436px"
                >
                  <el-option
                    v-for="o in channelTypeOptions"
                    :label="o.label"
                    :value="o.value"
                    :key="o.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="videoAreaId" label="安防区域">
                <el-select
                  ref="selectTree"
                  v-model="form.videoAreaId"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  style="width: 436px"
                  class="selectTree"
                >
                  <el-option :value="form.videoAreaId">
                    <el-tree
                      class="editEquipment-treeForm"
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
            <el-col :span="24"
              ><el-form-item label="国标编码">
                <el-input
                  v-model="form.gb28181Code"
                  style="width: 436px"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
          </el-row>

          <el-row>
            <el-col :span="12"
              ><el-form-item label="经度" prop="longitude">
                <el-input
                  v-model="form.longitude"
                  style="width: 436px"
                  clearable
                ></el-input> </el-form-item
            ></el-col>

            <el-col :span="12"
              ><el-form-item label="纬度" prop="latitude">
                <el-input
                  v-model="form.latitude"
                  style="width: 436px"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <!-- <el-row> </el-row> -->
          <el-row>
            <el-col :span="12"
              ><el-form-item label="朝向">
                <el-select
                  v-model="form.faceLocation"
                  placeholder="请选择"
                  style="width: 436px"
                >
                  <el-option
                    v-for="o in towardTypeOptions"
                    :label="o.label"
                    :value="o.value"
                    :key="o.value"
                  />
                </el-select> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="外观类型" prop="ptzType">
                <el-select
                  v-model="form.ptzType"
                  placeholder="请选择"
                  style="width: 436px"
                >
                  <el-option
                    v-for="o in appearanceTypeOptions"
                    :label="o.label"
                    :value="o.value"
                    :key="o.value"
                  />
                </el-select> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item label="安装地点" prop="installLocation">
                <el-input
                  v-model="form.installLocation"
                  style="width: 436px"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item prop="height" label="安装高度（米）">
                <el-input
                  v-model="form.height"
                  style="width: 436px"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"
              ><el-form-item prop="installTime" label="安装时间">
                <el-date-picker
                  v-model="form.installTime"
                  type="datetime"
                  style="width: 436px"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                >
                </el-date-picker> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
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
import { editChannel } from '@/api/method/encoder'
import { channelVideoAreaList } from '@/api/method/channel'
import { getAllNorthLists } from '@/api/method/moduleManagement'
import { getGroupDictLists } from '@/api/method/dictionary'
export default {
  name: '',
  components: {},
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    appearanceTypeOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    treeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    editChannelRow: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    const checkChannelName = (rule, value, cb) => {
      const regChannelName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regChannelName.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `
            )
          )
        }
      }, 500)
    }
    return {
      form: {
        channelCode: '',
        channelName: '',
        channelType: '',
        videoAreaId: '',
        gb28181Code: '',
        longitude: '',
        latitude: '',
        faceLocation: '',
        ptzType: '',
        installLocation: '',
        height: '',
        installTime: ''
      },
      // treeList: [],
      List: '',
      Ids: [],
      Id: '',
      editId: '',
      resName: '',
      pResourceValue: '',
      defaultProps: {
        children: 'childList',
        label: 'resourceName'
      },
      resEditChannelRow: {},
      channelTypeOptions: [],
      towardTypeOptions: [],
      rules: {
        channelType: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        videoAreaId: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        ptzType: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        channelCode: [
          { required: true, message: '1~128个字符。', trigger: 'blur' }
        ],
        channelName: {
          required: true,
          max: 32,
          validator: checkChannelName,

          // message: `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          // pattern: /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/,
          trigger: 'blur'
        },
        installLocation: [{ message: '1~128个字符。', trigger: 'blur' }],
        height: {
          message: '支持小数点后2位。',
          pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
          trigger: 'blur'
        },

        deviceId: [
          { required: true, message: '请填写设备端口', trigger: 'blur' }
        ],
        longitude: {
          message: '范围从-180~180的数字，支持小数点后6位。',
          pattern:
            /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
          trigger: 'blur'
        },
        latitude: {
          message: '范围从-180~180的数字，支持小数点后6位。',
          pattern:
            /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
          trigger: 'blur'
        }
      }
    }
  },
  watch: {
    editChannelRow(newValue, oldValue) {
      this.resEditChannelRow = newValue
      console.log('this.resEditChannelRow', this.resEditChannelRow)

      const {
        channelCode,
        channelName,
        channelType,
        videoAreaId,
        gb28181Code,
        longitude,
        latitude,
        faceLocation,
        ptzType,
        installLocation,
        height,
        installTime
      } = this.resEditChannelRow

      this.form.channelCode = channelCode
      this.form.channelName = channelName
      this.form.channelType = String(channelType)
      this.form.videoAreaId = videoAreaId
      this.form.gb28181Code = gb28181Code
      this.form.longitude = longitude
      this.form.latitude = latitude
      this.form.faceLocation = faceLocation
      this.form.ptzType = String(ptzType)
      this.form.installLocation = installLocation
      this.form.height = height
      this.form.installTime = installTime
      this.editId = this.resEditChannelRow.id
      this.$nextTick(() => {
        // console.log('this.treeList', this.treeList, this.form.videoAreaId)
        this.getTreeName(this.$props.treeList, this.form.videoAreaId)
        this.form.videoAreaId = this.resName
      })
    },
    deep: true
  },
  created() {},
  mounted() {
    // this.init()
    this.getTowardTypeOptionsList()
    this.getChannelTypeDictionaryList()
  },
  methods: {
    getTreeName(arr, id) {
      arr.map((item) => {
        if (item.id === id) {
          this.resName = item.resourceName
          this.pResourceValue = item.resourceValue
          this.Id = id
          return
        } else {
          if (item.childList && item.childList.length > 0) {
            this.getTreeName(item.childList, id)
          }
        }
      })
    },
    // async init(id) {
    //   await channelVideoAreaList()
    //     .then((res) => {
    //       if (res.data.code === 0) {
    //         this.treeList = [res.data.data]
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    async getTowardTypeOptionsList() {
      await getGroupDictLists('Toward').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.towardTypeOptions.push(obj)
          })
        }
      })
    },
    async getChannelTypeDictionaryList() {
      await getGroupDictLists('ChannelType').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj1 = {}
            obj1.label = item.itemName
            obj1.value = item.itemValue
            this.channelTypeOptions.push(obj1)
          })
        }
      })
    },
    // 点击节点选中
    nodeClickHandle(data) {
      this.form.videoAreaId = data.resourceName
      this.pResourceValue = data.resourceValue
      this.Id = data.id
      this.$refs.selectTree.blur()
    },
    save() {
      // console.log(1111,this.$refs.userTable.selection)
      Promise.all([this.$refs.form.validate()]).then(() => {
        this.form.videoAreaId = this.Id
        this.form.deviceType = Number(this.form.deviceType)

        editChannel({
          ...this.form,
          deviceExpansionId: this.resEditChannelRow.deviceExpansionId,
          pResourceValue: this.pResourceValue,
          id: this.resEditChannelRow.id
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.goback()
          } else {
            this.form.videoAreaId = this.resName
          }
        })
      })
    },
    goback() {
      this.$emit('changeIsShow', 'editChannel', false)
      this.$emit('initChannelList')
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

// 去掉顶部线条
::v-deep .editEquipment-treeForm > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .editEquipment-treeForm > .el-tree-node::before {
  border-left: none;
}
.editChannel-content {
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border-top: 1px solid #eaeaea;
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
    .panel-header-box-border {
      border-top: 1px solid #eaeaea;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #011f53;
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
