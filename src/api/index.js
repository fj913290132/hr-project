//! api里统一出口。这样逻辑页面直接引入api，不需要考虑接口方法具体在哪个名字文件里
//! 导入user.js所有方法并导出
export * from './user.js'
export * from './departments.js'
export * from './setting.js'
export * from './employees.js'
