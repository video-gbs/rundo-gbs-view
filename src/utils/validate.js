/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['adminsuper', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return true
}

// el-form表单验证
import state from '@/store/modules/verify'
const s = state.state

export function mobileReg(rule, value, callback) {
  if (!rule.required && value === '') {
    return callback()
  } else {
    if (s.mobileReg.test(value)) {
      callback()
    } else {
      callback(new Error('手机号格式错误。'))
    }
  }
}

export function emailReg(rule, value, callback) {
  if (!rule.required && value === '') {
    return callback()
  } else {
    if (s.emailReg.test(value)) {
      callback()
    } else {
      callback(new Error('电子邮箱格式错误。'))
    }
  }
}

export function linkReg(rule, value, callback) {
  if (!rule.required && value === '') {
    return callback()
  } else {
    if (s.linkReg.test(value)) {
      callback()
    } else {
      callback(new Error('电子邮箱格式错误。'))
    }
  }
}
export function pwdReg(rule, value, callback) {
  if (!rule.required && value === '') {
    return callback()
  } else {
    if (s.pwdReg.test(value)) {
      callback()
    } else {
      callback(new Error('密码格式错误。'))
    }
  }
}
