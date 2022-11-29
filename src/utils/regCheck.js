const rules = {
  // 电话号码
  phone: {
    rule: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
    msg: '请输入正确的电话号码'
  },
  // 数字
  digital: {
    rule: /^\d+$/,
    msg: '请输入数字'
  },
  // 数字英文
  digitalEng: {
    rule: /^[a-z0-9]+$/i,
    msg: '请输入数字/英文'
  },
  // 浮点数
  floatNumber: {
    rule: /^(\d*|\d+\.\d{1,})$/,
    msg: '请输入数字'
  },
  // 用户名 4位以上数字英文下划线
  userName: {
    rule: /^\w{4,}$/,
    msg: '请输入4位以上数字英文下划线'
  },
  // 用户密码
  password: {
    rule: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*._?]{8,20}$/,
    msg: '长度为8-20个字符，由字母/数字以及特殊符号组成'
  }
};

/**
 *
 * @param verifyArr {
 *  rule: string; // 上面rules中的key
 *  value: unknow; // 校验值
 *  require?: Boolean; // 必填校验
 *  regMsg?: string; // 校验规则失败时，替换默认的报错msg
 * }[]
 *
 * @returns { success: Boolean; msg?: string; key?: string; }
 */
const check = (verifyArr) => {
  let result = { success: true };
  verifyArr.some((item) => {

    if (item.require && !item.value) {
      result = {
        success: false,
        msg: `【${item.name}】不能为空`,
        key: item.key,
      };
      return true;
    }

    if (item.value && item.rule) {
      const ruleItem = rules[item.rule];
      if (ruleItem) {
        if (!ruleItem.rule.test(item.value)) {
          result = {
            success: false,
            msg: item.regMsg || `【${item.name}】格式有误，${ruleItem.msg}`,
            key: item.key,
          };
          return true;
        }
      } else if(item.rule.includes('byteLength')) {
        const length = item.rule.substr(10);
        if(item.value.byteLength() > +length) {
          result = {
            success: false,
            msg: `【${item.name}】过长，至多为${length}个汉字`,
            key: item.key,
          };
          return true;
        }
      }
    }

    return false;
  });

  return result;
};

const simpleCheck = (value, rule) => {
  if (rule === 'required') {
    if (value === '' || value === undefined || value === null) {
      return { success: false, msg: '不能为空' };
    }
  }

  const curRule = rules[rule];
  if (curRule && value) {
    if (!curRule.rule.test(value)) {
      return { success: false, msg: `格式有误，${curRule.msg}` };
    }
  } else if(rule.includes('byteLength')) {
    const length = rule.substr(10);
    if(value.byteLength() > +length) {
      return {
        success: false,
        msg: `文字过长，至多为${Math.floor(length / 2)}个汉字`,
      };
    }
  }

  return { success: true };
};

export default {
  check,
  simpleCheck,
}
