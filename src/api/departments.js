import request from '@/utils/request'

/**
 * 获取-部门列表方法
 * @returns Promise对象
 */
export function getDepartmentsList() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

/**
 * 组织架构 - 部门负责人列表数据
 * @returns
 */
export function getEmployeeSimpleAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 组织架构 - 新增子部门
 * @description: 新增子部门
 * @param {object} data 发送参数： name, code, manager, introduce, pid
 * @param {object} data 发送参数： 部门名称, 部门编码, 部门管理者, 部门介绍, 新增的这个子部门的上级部门
 * @returns
 */
export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data // 前端form表单的参数名, 直接和接口的对应, 这里可以少写很多属性名代码
  })
}

/**
 * 组织架构 - 获取部门详情
 * @description: 获取部门详情
 * @param {*} id 表示当前要编辑项的id值(部门id)
 * @return {*}
 */
export function getDepartDetailAPI(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 组织架构 - 更新部门详情
  * @description: 更新部门数据
  * @param {*} data: form表单数据 但是要有id, 父级的频道id
  * @return {*}
  */
export function updateDepartmentsAPI(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 组织架构 - 删除部门
 * @description: 删除部门 - 注意: 有子部门不能删除
 * @param {*} id 当前点击的操作按钮 所在的项的id(部门id)
 * @return {*}
 */
export function delDepartmentAPI(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
