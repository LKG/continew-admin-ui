import http from '@/utils/http'

const BASE_URL = '/crm/customerPool'

export interface CustomerPoolResp {
  poolName: string
  status: string
  preOwnerSetting: string
  preOwnerSettingDay: string
  receiveSetting: string
  receiveNum: string
  remindSetting: string
  remindDay: string
  putInRule: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface CustomerPoolDetailResp {
  id: string
  poolName: string
  adminUserId: string
  memberUserId: string
  memberDeptId: string
  status: string
  preOwnerSetting: string
  preOwnerSettingDay: string
  receiveSetting: string
  receiveNum: string
  remindSetting: string
  remindDay: string
  putInRule: string
  createUser: string
  createTime: string
  updateTime: string
  updateUser: string
  createUserString: string
  updateUserString: string
}
export interface CustomerPoolQuery {
  poolName: string | undefined
  adminUserId: string | undefined
  status: string | undefined
  preOwnerSetting: string | undefined
  receiveSetting: string | undefined
  remindSetting: string | undefined
  putInRule: string | undefined
  sort: Array<string>
}
export interface CustomerPoolPageQuery extends CustomerPoolQuery, PageQuery {}

/** @desc 查询公海列表 */
export function listCustomerPool(query: CustomerPoolPageQuery) {
  return http.get<PageRes<CustomerPoolResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询公海详情 */
export function getCustomerPool(id: string) {
  return http.get<CustomerPoolDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增公海 */
export function addCustomerPool(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改公海 */
export function updateCustomerPool(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除公海 */
export function deleteCustomerPool(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出公海 */
export function exportCustomerPool(query: CustomerPoolQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
