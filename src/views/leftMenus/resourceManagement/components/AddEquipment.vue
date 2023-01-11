<template>
  <div class="addequipment-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >添加设备</span
        >
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
        <span>基本信息</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备类型">
                <el-radio-group v-model="form.resource">
                  <el-radio label="DVR"></el-radio>
                  <el-radio label="NVR"></el-radio>
                  <el-radio label="CVR"></el-radio>
                  <el-radio label="DVS"></el-radio>
                  <el-radio label="IPS"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否国标">
                <el-radio-group v-model="form.resource">
                  <el-radio label="国标"></el-radio>
                  <el-radio label="非国标"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="desc" label="设备名称">
                <el-input v-model="form.name" style="width: 436px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="desc"
                label="所属行政区划"
                style="margin-left: 295px"
              >
                <el-select
                  v-model="form.region"
                  placeholder="请选择活动区域"
                  style="width: 436px"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item prop="desc" label="设备厂商">
                <el-select
                  v-model="form.region"
                  placeholder="请选择活动区域"
                  style="width: 436px"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12"></el-col> -->
          </el-row>
          <el-row>
            <el-col :span="24"
              ><el-form-item prop="desc" label="设备型号">
                <el-input
                  v-model="form.name"
                  style="width: 436px"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row>
            <el-col :span="8"
              ><el-form-item prop="desc" label="用户名称">
                <el-input
                  v-model="form.name"
                  style="width: 436px"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item
                prop="desc"
                label="用户密码"
                style="margin-left: 265px"
              >
                <el-input
                  v-model="form.name"
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
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="desc" label="IP地址">
                  <el-input v-model="form.name" style="width: 436px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="desc" label="设备端口">
                  <el-input v-model="form.name" style="width: 436px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="desc" label="连接协议">
                  <el-select
                    v-model="form.region"
                    placeholder="请选择活动区域"
                    style="width: 436px"
                  >
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="desc" label="传输协议">
                  <el-select
                    v-model="form.region"
                    placeholder="请选择活动区域"
                    style="width: 436px"
                  >
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="desc" label="关联PG模块">
                  <el-select
                    v-model="form.region"
                    placeholder="请选择活动区域"
                    style="width: 436px"
                  >
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12"></el-col> -->
            </el-row>
            <el-row>
              <el-col :span="12"
                ><el-form-item prop="desc" label="经度">
                  <el-input
                    v-model="form.name"
                    style="width: 436px"
                  ></el-input> </el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item prop="desc" label="纬度">
                  <el-input
                    v-model="form.name"
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
export default {
  name: '',
  components: {},
  data() {
    return {
      form: {},
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
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    goback() {
      this.$router.push({ path: '/equipment' })
    }
  }
}
</script>

<style lang="scss" scoped>
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
