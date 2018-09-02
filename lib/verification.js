/**
 * 表单验证
 * @param rules：表单验证的规则对象，key为需要验证的key，value为验证规则数组,必须
 * @param formData：被验证的表单/对象，必须
 * @param triggerOrigion：类型为字符串，与rules的验证规则的trigger相对应，用于筛选验证规则，如果为函数，则为验证失败调用函数。
 * @param errorCallbackOrigion:验证失败时调用的函数，value为当前验证的值，rule为当前的规则，
 * @returns {boolean}：验证成功返回true，否则位false
 */
const formValidation = (rules, formData = {}, triggerOrigion, errorCallbackOrigion) => {
    let trigger
    let errorCallback
    // 校验传入的参数
    if (!rules || !formData) {
        throw Error('rule or formData need is a Object')
    }
    if (typeof triggerOrigion === 'function') {
        if (errorCallbackOrigion !== undefined) {
            throw Error('when the third argument is function,the fourth should is undefined')
        }
        [trigger, errorCallback] = [errorCallbackOrigion, triggerOrigion]
    } else {
        [trigger, errorCallback] = [triggerOrigion, errorCallbackOrigion]
    }
    const jiaoyanhanshu = (rule, value) => {
        if (!rule.validate(value)) {
            if (typeof errorCallback === 'function') {
                errorCallback({rule, value})
            }
            // if (rule.message) {
            //   xng.showToast(rule.message)
            // }
            return false
        }
    }
    const keys = Object.keys(rules)
    for (let i = 0; i < keys.length; i++) {
        // 遍历规则对象，取出规则数组和需要校验的对象的值
        if (!formData.hasOwnProperty(keys[i])) {
            continue
        }
        const value = formData[keys[i]]
        const ruleArray = rules[keys[i]]
        for (let j = 0; j < ruleArray.length; j++) {
            // 遍历规则的数组，对每条规则校验
            const rule = ruleArray[j]
            // 如果规则不是函数，抛出错误
            if (typeof rule.validate !== 'function') {
                throw Error('rule need is function')
            }
            if (trigger) {
                if (typeof rule.trigger === 'string') {
                    if (rule.trigger.split(',')
                        .includes(trigger) && jiaoyanhanshu(rule, value) === false) {
                        return false
                    }
                } else {
                    continue
                }
            } else if (jiaoyanhanshu(rule, value) === false) {
                return false
            }
        }
    }
    return true
}
const rules = {
    phone: [{
        validate: value => /^[1][3,4,5,6,7,8][0-9]{9}$/.test(value),
        message: '请填写正确的电话号码',
        trigger: 'blur'
    }, {
        validate: value => value.length <= 11,
        trigger: 'change',
        message: '手机号码，位数太长'
    }]
}

module.exports = {rules: rules, formValidation: formValidation}
