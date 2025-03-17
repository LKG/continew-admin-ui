import http from '@/utils/http'

const BASE_URL = '/crm/leads'

export interface LeadsResp {
  id: string
  isTransform: string
  followup: string
  leadsName: string
  nextTime: string
  telephone: string
  mobile: string
  email: string
  address: string
  remark: string
  updateUser: string
  batchId: string
  lastTime: string
  lastContent: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface LeadsDetailResp {
  id: string
  isTransform: string
  followup: string
  leadsName: string
  customerId: string
  nextTime: string
  telephone: string
  mobile: string
  email: string
  address: string
  remark: string
  ownerUserId: string
  createUser: string
  createTime: string
  updateTime: string
  updateUser: string
  batchId: string
  isReceive: string
  lastTime: string
  lastContent: string
  createUserString: string
  updateUserString: string
}
export interface LeadsQuery {
  isTransform: string | undefined
  leadsName: string | undefined
  email: string | undefined
  batchId: string | undefined
  sort: Array<string>
}
export interface LeadsPageQuery extends LeadsQuery, PageQuery {}

/** @desc 查询线索列表 */
export function listLeads(query: LeadsPageQuery) {
  return http.get<PageRes<LeadsResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询线索详情 */
export function getLeads(id: string) {
  return http.get<LeadsDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增线索 */
export function addLeads(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改线索 */
export function updateLeads(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除线索 */
export function deleteLeads(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出线索 */
export function exportLeads(query: LeadsQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
