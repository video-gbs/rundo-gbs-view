<template>
  <div class="control-group-container">
    <!-- horizontal模式 -->
    <template v-if="controlGroupData.layout == 'horizontal'">
      <el-row>
        <!-- controls -->
        <el-col :span="controlGroupData.layoutConfig.contentSpan">
          <el-form :model="ruleForm" :rules="rules" :inline="true" :ref="formRef">
            <el-row>
              <template v-for="item in controlGroupData.controls">
                <el-col :span="item.span || 8" v-if="!item.hideControl">
                  <el-form-item :label="item.label + '：'" :prop="item.key">
                    <template v-if="item.type === 'input'">
                      <el-input
                        v-model="ruleForm[item.key]"
                        :placeholder="item.placeholder || '请输入'"
                        :disabled="item.disabled"
                      ></el-input>
                    </template>
                    <template v-if="item.type === 'password'">
                      <el-input
                        v-if="!item.showFlag"
                        class="hidePwd"
                        v-model="ruleForm[item.key]"
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
                        <el-option v-if="!item.hideDefault" label="请选择" value=""></el-option>
                        <el-option
                          v-for="o in item.options"
                          :label="o.label"
                          :value="o.value"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-if="item.type === 'date'">
                      <el-date-picker
                        v-model="ruleForm[item.key]"
                        :type="item.dateType || 'date'"
                        :placeholder="item.placeholder || '请选择'"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </template>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </el-col>
        <!-- buttons -->
        <el-col :span="controlGroupData.layoutConfig.buttonSpan">
          <div :style="{ textAlign: controlGroupData.layoutConfig.buttonAlign }">
            <el-button
              v-for="item in controlGroupData.bottons"
              :icon="item.icon"
              :type="item.type"
              @click="handleBtnClick(item)"
            >
              {{ item.text }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </template>

    <!-- vertical 模式 -->
    <template v-else>
      <div class="vertical-form-control">
        <el-form :model="ruleForm" :rules="rules" :ref="formRef">
          <template v-for="item in controlGroupData.controls">
            <el-form-item :label="item.label + '：'" :prop="item.key" v-if="!item.hideControl">
              <template v-if="item.type === 'input'">
                <el-input
                  v-model="ruleForm[item.key]"
                  :placeholder="item.placeholder || '请输入'"
                  :disabled="item.disabled"
                ></el-input>
              </template>
              <template v-if="item.type === 'password'">
                <el-input
                  v-if="!item.showFlag"
                  class="hidePwd"
                  v-model="ruleForm[item.key]"
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
                  <el-option v-if="!item.hideDefault" label="请选择" value=""></el-option>
                  <el-option
                    v-for="o in item.options"
                    :label="o.label"
                    :value="o.value"
                  ></el-option>
                </el-select>
              </template>
              <template v-if="item.type === 'date'">
                <el-date-picker
                  v-model="ruleForm[item.key]"
                  :type="item.dateType || 'date'"
                  :placeholder="item.placeholder || '请选择'"
                ></el-date-picker>
              </template>
            </el-form-item>
          </template>
        </el-form>
        <div
          class="vertical-form-button"
          :style="{ textAlign: controlGroupData.layoutConfig.buttonAlign }"
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
  </div>
</template>

<script>
import RegCheck from '@/utils/regCheck';

export default {
  data() {
    return {
      controlGroupData: {},
      ruleForm: {},
      rules: {},
      formRef: 'controlsForm' + Math.uuid(),
    };
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  created() {
    this.resetControl();
    Object.assign(this.controlGroupData, this.data);
    this.initControl();

    __dev(() => {
      window['thisControlGroup'] = this;
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
          rules[item.key].push({
            required: true,
            message: '不能为空',
            trigger: 'change',
          });
        }

        if (item.regKey) {
          const regKeyList = item.regKey.split(',');
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
              trigger: 'change',
            });
          });
        }

        if (typeof item.regCheck == 'function') {
          rules[item.key].push({
            validator: (rule, value, callback) => {
              const { success, msg } = item.regCheck(value, this.ruleForm);
              if (success) {
                callback();
              } else {
                callback(new Error(msg));
              }
            },
            trigger: 'change',
          });
        }

        // 密码框特殊处理，解决自动补全密码问题
        if (item.type == 'password') {
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
    },
    resetControl() {
      this.controlGroupData = {
        controls: [],
        bottons:
          this.data.layout === 'vertical'
            ? [
                {
                  type: 'default',
                  action: 'cancel',
                  text: '取消',
                },
                {
                  type: 'primary',
                  text: '确定',
                },
              ]
            : [
                {
                  icon: 'el-icon-search',
                  type: 'primary',
                  text: '查询',
                },
                {
                  icon: 'el-icon-refresh',
                  type: 'default',
                  action: 'reset',
                  text: '重置',
                },
              ],
        layout: 'horizontal', // 布局模式 'vertical' | 'horizontal'
        layoutConfig: {
          contentSpan: 18,
          buttonSpan: 6,
          buttonAlign: this.data.layout === 'vertical' ? 'right' : 'center',
        },
      };
    },
    resetForm() {
      this.controlGroupData.controls.forEach((item) => {
        this.ruleForm[item.key] = item.initValue || '';
      });
    },
    handleBtnClick(data) {
      if (data.action == 'reset') {
        this.resetForm();
        this.$emit('onBtnReset');
      } else if (data.action == 'cancel') {
        this.$emit('onBtnCancel');
      } else {
        this.$emit('onBtnClick', { btnData: data, formData: this.ruleForm });
      }
    },
    pwdShowChange(data) {
      data.showFlag = !data.showFlag;
      this.$forceUpdate();
    },
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
}
</style>
