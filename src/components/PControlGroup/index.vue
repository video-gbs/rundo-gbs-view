<template>
  <div class="control-group-container">
    <!-- horizontal模式 -->
    <template v-if="controlGroupData.layout == 'horizontal'">
      <el-row>
        <!-- controls -->
        <el-col :span="layoutConfig.hideButton ? 24 : layoutConfig.contentSpan">
          <el-form
            :ref="formRef"
            :model="ruleForm"
            :rules="rules"
            :inline="true"
          >
            <el-row>
              <template v-for="item in controlGroupData.controls">
                <el-col v-if="!item.hideControl" :span="item.span || 8">
                  <el-form-item :label="item.label + colonStr" :prop="item.key">
                    <template v-if="item.type === 'input'">
                      <el-input
                        v-model="ruleForm[item.key]"
                        :placeholder="item.placeholder || '请输入'"
                        :disabled="item.disabled"
                      />
                    </template>
                    <template v-if="item.type === 'password'">
                      <el-input
                        v-if="!item.showFlag"
                        v-model="ruleForm[item.key]"
                        class="hidePwd"
                        :disabled="item.disabled"
                        :placeholder="item.placeholder || '请输入'"
                      >
                        <svg-icon
                          slot="suffix"
                          :icon-class="'login-hide'"
                          class="pwd-icon"
                          @click="pwdShowChange(item)"
                        />
                      </el-input>
                      <el-input
                        v-else
                        v-model="ruleForm[item.key]"
                        :disabled="item.disabled"
                        :placeholder="item.placeholder || '请输入'"
                      >
                        <svg-icon
                          slot="suffix"
                          :icon-class="'login-show'"
                          class="pwd-icon"
                          @click="pwdShowChange(item)"
                        />
                      </el-input>
                    </template>
                    <template v-if="item.type === 'select'">
                      <el-select
                        v-model="ruleForm[item.key]"
                        :placeholder="item.placeholder || '请选择'"
                        :disabled="item.disabled"
                      >
                        <el-option
                          v-if="!item.hideDefault"
                          label="请选择"
                          value=""
                        />
                        <el-option
                          v-for="o in item.options"
                          :label="o.label"
                          :value="o.value"
                        />
                      </el-select>
                    </template>
                    <template v-if="item.type === 'date'">
                      <el-date-picker
                        v-model="ruleForm[item.key]"
                        :type="item.dateType || 'date'"
                        :format="item.format || ''"
                        :value-format="item.valueFormat || ''"
                        :placeholder="item.placeholder || '请选择'"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      />
                    </template>
                    <template v-if="item.type === 'radio'">
                      <el-radio-group v-model="ruleForm[item.key]">
                        <el-radio v-for="o in item.options" :label="o.value">{{
                          o.label
                        }}</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-if="item.type === 'textarea'">
                      <el-input
                        v-model="ruleForm[item.key]"
                        type="textarea"
                        :autosize="item.autosize || { minRows: 2, maxRows: 4 }"
                        :placeholder="item.placeholder || '请输入'"
                        :maxlength="item.maxlength || 120"
                        show-word-limit
                      />
                    </template>
                    <template v-if="item.type === 'transfer'">
                      <div>
                        <el-button
                          type="primary"
                          size="small"
                          @click="showTransfer(item)"
                          >{{ item.btnText }}</el-button
                        >
                      </div>
                      <div
                        class="transfer-control-text"
                        :title="ruleForm[item.key] | transferDict(item.options)"
                      >
                        {{ ruleForm[item.key] | transferDict(item.options) }}
                      </div>
                    </template>
                    <template v-if="item.type === 'text'">
                      <div class="control-text" :class="item.textClass || ''">
                        {{ item.value }}
                      </div>
                    </template>
                    <template v-if="item.type === 'upload'">
                      <el-upload
                        action="#"
                        :class="{ noAdd: !item.canAdd }"
                        list-type="picture-card"
                        :file-list="item.value"
                        :on-remove="
                          (file, fileList) => handleRemove(file, item)
                        "
                      >
                        <i class="el-icon-plus" />
                        <div slot="file" slot-scope="{ file }">
                          <img
                            class="el-upload-list__item-thumbnail"
                            :src="file.url"
                            alt=""
                          />
                          <span class="el-upload-list__item-actions">
                            <span
                              class="el-upload-list__item-preview"
                              @click="handlePictureCardPreview(file, item)"
                            >
                              <i class="el-icon-zoom-in" />
                            </span>
                            <span
                              v-if="item.canDown"
                              class="el-upload-list__item-delete"
                              @click="handleDownload(file)"
                            >
                              <i class="el-icon-download" />
                            </span>
                            <span
                              v-if="item.canDel"
                              class="el-upload-list__item-delete"
                              @click="handleRemove(file, item)"
                            >
                              <i class="el-icon-delete" />
                            </span>
                          </span>
                        </div>
                      </el-upload>
                    </template>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </el-col>
        <!-- buttons -->
      </el-row>
      <div
        v-if="!layoutConfig.hideButton"
        :style="{ textAlign: layoutConfig.buttonAlign }"
      >
        <el-button
          v-for="item in controlGroupData.bottons"
          :icon="item.icon"
          :type="item.type"
          @click="handleBtnClick(item)"
        >
          {{ item.text }}
        </el-button>
      </div>
    </template>

    <!-- vertical 模式 -->
    <template v-else>
      <div class="vertical-form-control">
        <el-form :ref="formRef" :model="ruleForm" :rules="rules">
          <template v-for="item in controlGroupData.controls">
            <el-form-item
              v-if="!item.hideControl"
              :label="item.label + colonStr"
              :prop="item.key"
            >
              <template v-if="item.type === 'input'">
                <el-input
                  v-model="ruleForm[item.key]"
                  :placeholder="item.placeholder || '请输入'"
                  :disabled="item.disabled"
                />
              </template>
              <template v-if="item.type === 'password'">
                <el-input
                  v-if="!item.showFlag"
                  v-model="ruleForm[item.key]"
                  class="hidePwd"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder || '请输入'"
                >
                  <svg-icon
                    slot="suffix"
                    :icon-class="'login-hide'"
                    class="pwd-icon"
                    @click="pwdShowChange(item)"
                  />
                </el-input>
                <el-input
                  v-else
                  v-model="ruleForm[item.key]"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder || '请输入'"
                >
                  <svg-icon
                    slot="suffix"
                    :icon-class="'login-show'"
                    class="pwd-icon"
                    @click="pwdShowChange(item)"
                  />
                </el-input>
              </template>
              <template v-if="item.type === 'select'">
                <el-select
                  v-model="ruleForm[item.key]"
                  :placeholder="item.placeholder || '请选择'"
                  :disabled="item.disabled"
                >
                  <el-option v-if="!item.hideDefault" label="请选择" value="" />
                  <el-option
                    v-for="o in item.options"
                    :label="o.label"
                    :value="o.value"
                  />
                </el-select>
              </template>
              <template v-if="item.type === 'date'">
                <el-date-picker
                  v-model="ruleForm[item.key]"
                  :type="item.dateType || 'date'"
                  :format="item.format || ''"
                  :value-format="item.valueFormat || ''"
                  :placeholder="item.placeholder || '请选择'"
                />
              </template>
              <template v-if="item.type === 'radio'">
                <el-radio-group v-model="ruleForm[item.key]">
                  <el-radio v-for="o in item.options" :label="o.value">{{
                    o.label
                  }}</el-radio>
                </el-radio-group>
              </template>
              <template v-if="item.type === 'textarea'">
                <el-input
                  v-model="ruleForm[item.key]"
                  type="textarea"
                  :autosize="item.autosize || { minRows: 2, maxRows: 4 }"
                  :placeholder="item.placeholder || '请输入'"
                  :maxlength="item.maxlength || 120"
                  show-word-limit
                />
              </template>
              <template v-if="item.type === 'transfer'">
                <div>
                  <el-button
                    type="primary"
                    size="small"
                    @click="showTransfer(item)"
                    >{{ item.btnText }}</el-button
                  >
                </div>
                <div
                  class="transfer-control-text"
                  :title="ruleForm[item.key] | transferDict(item.options)"
                >
                  {{ ruleForm[item.key] | transferDict(item.options) }}
                </div>
              </template>
            </el-form-item>
          </template>
        </el-form>
        <div
          class="vertical-form-button"
          :style="{ textAlign: layoutConfig.buttonAlign }"
        >
          <el-button
            v-for="item in controlGroupData.bottons"
            :icon="item.icon"
            :type="item.type"
            @click="handleBtnClick(item)"
          >
            {{ item.text }}
          </el-button>
        </div>
      </div>
    </template>

    <el-dialog
      :title="transferPopData.title"
      :visible.sync="transferPopData.show"
      custom-class="transferPop"
      append-to-body
      width="50%"
    >
      <PTransfer v-if="transferPopData.show" :data="transferPopData.data" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferPopData.show = false">取 消</el-button>
        <el-button type="primary" @click="comfirmTransfer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="uploadPop.show">
      <img v-if="uploadPop.show" width="100%" :src="uploadPop.url" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import RegCheck from "@/utils/regCheck";
import PTransfer from "@/components/PTransfer";

export default {
  components: {
    PTransfer,
  },
  filters: {
    transferDict(valList, dict) {
      return valList
        .map((val) => {
          const data = (dict || []).find((o) => o.key == val);
          return data ? data.label : val;
        })
        .join("、");
    },
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      controlGroupData: {},
      ruleForm: {},
      rules: {},
      formRef: "controlsForm" + Math.uuid(),
      layoutConfig: {},
      transferPopData: {
        show: false,
        data: null,
        title: "",
      },
      uploadPop: {
        show: false,
        url: null,
      },
    };
  },
  computed: {
    colonStr() {
      const flag = this.layoutConfig && !this.layoutConfig.showColon;
      return flag ? "" : "：";
    },
  },
  created() {
    this.resetControl();
    if (this.data.layoutConfig) {
      Object.assign(this.layoutConfig, this.data.layoutConfig);
    }

    Object.assign(this.controlGroupData, this.data);
    this.initControl();

    __dev(() => {
      window["thisControlGroup"] = this;
    });
  },
  mounted() {
    this.extendControl();
  },
  methods: {
    initControl() {
      const ruleForm = {};
      const rules = {};

      this.controlGroupData.controls.forEach((item) => {
        ruleForm[item.key] = item.initValue || item.value;
        rules[item.key] = [];
        if (item.isRequired) {
          if (item.type === "transfer") {
            rules[item.key].push({
              validator: (rule, value, callback) => {
                if (value.length) {
                  callback();
                } else {
                  callback(new Error("不能为空"));
                }
              },
              trigger: "change",
            });
          } else {
            rules[item.key].push({
              required: true,
              message: "不能为空",
              trigger: "change",
            });
          }
        }

        if (item.regKey) {
          const regKeyList = item.regKey.split(",");
          regKeyList.forEach((key) => {
            rules[item.key].push({
              validator: (rule, value, callback) => {
                const { success, msg } = RegCheck.simpleCheck(value, key);
                if (success) {
                  callback();
                } else {
                  callback(new Error(msg));
                }
              },
              trigger: "change",
            });
          });
        }

        if (typeof item.regCheck === "function") {
          rules[item.key].push({
            validator: (rule, value, callback) => {
              const { success, msg } = item.regCheck(value, this.ruleForm);
              if (success) {
                callback();
              } else {
                callback(new Error(msg));
              }
            },
            trigger: "change",
          });
        }

        // 密码框特殊处理，解决自动补全密码问题
        if (item.type == "password") {
          item.showFlag = false;
        }
      });

      this.ruleForm = ruleForm;
      this.rules = rules;
    },
    extendControl() {
      this.data.getData = () => {
        return this.ruleForm;
      };

      this.data.regCheck = async () => {
        try {
          return await this.$refs[this.formRef].validate();
        } catch (e) {
          return false;
        }
      };

      this.data.updateControls = (controls) => {
        controls.forEach((control) => {
          this.controlGroupData.controls.forEach((target) => {
            if (target.key === control.key) {
              Object.keys(control).forEach((key) => {
                target[key] = control[key];
                if (key === "value") {
                  this.ruleForm[target.key] = control[key];
                }
              });
            }
          });
        });
      };
    },
    resetControl() {
      this.controlGroupData = {
        controls: [],
        bottons:
          this.data.layout === "vertical"
            ? [
                {
                  type: "default",
                  action: "cancel",
                  text: "取消",
                },
                {
                  type: "primary",
                  text: "确定",
                },
              ]
            : [
                {
                  icon: "el-icon-search",
                  type: "primary",
                  text: "查询",
                },
                {
                  icon: "el-icon-refresh",
                  type: "default",
                  action: "reset",
                  text: "重置",
                },
              ],
        layout: "horizontal", // 布局模式 'vertical' | 'horizontal'
      };

      this.layoutConfig = {
        contentSpan: 18,
        buttonSpan: 6,
        buttonAlign: this.data.layout === "vertical" ? "right" : "center",
        showColon: true, // 默认显示冒号
        hideButton: false,
      };
    },
    resetForm() {
      this.controlGroupData.controls.forEach((item) => {
        this.ruleForm[item.key] = item.initValue || "";
      });
    },
    handleBtnClick(data) {
      if (data.action == "reset") {
        this.resetForm();
        this.$emit("onBtnReset");
      } else if (data.action == "cancel") {
        this.$emit("onBtnCancel");
      } else {
        this.$emit("onBtnClick", { btnData: data, formData: this.ruleForm });
      }
    },
    pwdShowChange(data) {
      data.showFlag = !data.showFlag;
      this.$forceUpdate();
    },
    showTransfer(data) {
      this.transferPopData.title = data.btnText;
      this.transferPopData.data = data;
      this.transferPopData.show = true;
    },
    comfirmTransfer() {
      const result = this.transferPopData.data.getData();
      if (this.transferPopData.data.isRequired && !result.length) {
        this.$message.error("不能为空，至少选择一个");
        return;
      }

      this.transferPopData.data.value = JSON.parse(JSON.stringify(result));
      this.ruleForm[this.transferPopData.data.key] = JSON.parse(
        JSON.stringify(result)
      );
      this.$refs[this.formRef].validateField(this.transferPopData.data.key);
      this.transferPopData.show = false;
    },
    handlePictureCardPreview(file, item) {
      this.uploadPop.url = file.url;
      this.uploadPop.show = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleDownload(file) {},
  },
};
</script>

<style lang="scss">
.control-group-container {
  .el-form--inline {
    .el-form-item {
      display: flex;
    }
    .el-form-item__label {
      white-space: nowrap;
    }
    .el-form-item__content {
      width: 100%;
      margin-right: 1.2rem;
    }
    .el-select {
      width: 100%;
    }
  }

  .el-form-item__label {
    font-weight: normal;
  }
}
.vertical-form-control {
  .el-form-item {
    display: flex;
  }
  .el-form-item__label {
    min-width: 6rem;
  }
  .el-form-item__content {
    width: 100%;
  }
  .el-select,
  .el-input {
    width: 100%;
  }
}

.control-group-container {
  .pwd-icon {
    cursor: pointer;
    &.svg-icon {
      font-size: 1.2rem;
      margin-right: 0.5rem;
    }
  }

  .hidePwd .el-input__inner {
    -webkit-text-security: disc !important;
  }
  .transfer-control-text {
    line-height: 2;
    font-size: 12px;
  }
  .control-text {
    line-height: 1.5;
  }

  .el-upload-list--picture-card {
    display: flex;
    margin-top: 16px;
    .el-upload-list__item,
    .el-upload-list__item-thumbnail {
      width: 80px;
      height: 80px;
    }
  }

  .noAdd .el-upload--picture-card {
    display: none !important;
  }

  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: none;
  }
}

.transferPop {
  z-index: 1000;
  .el-transfer-panel {
    width: calc((100% - 182px) / 2);
  }
}
</style>
