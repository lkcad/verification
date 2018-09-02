const a = require('../index')
// console.log(a.rules)

var obj = {
    phone: '13439876544'
}

console.log(a.formValidation(a.rules,obj, (...args) => {
    console.log(args)
}))
