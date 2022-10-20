import request from '@/utils/request'
/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/sys/user',
    methods: 'get',
    params
  })
}

/**
 * @description: 添加员工
 * @param {*} data 员工的信息对象(7对key+value有些不是必须)
 * @return {*}
 */
export function addEmployeeAPI(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployeeAPI(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
