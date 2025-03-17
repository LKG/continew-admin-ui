import http from '@/utils/http'

const BASE_URL = '/crm/leadsData'

export interface LeadsDataResp {
  id: string
  fieldId: string
  name: string
  value: string
  createTime: string
  batchId: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface LeadsDataDetailResp {
  id: string
  fieldId: string
  name: string
  value: string
  createTime: string
  batchId: string
  createUserString: string
  updateUserString: string
}
export interface LeadsDataQuery {
  sort: Array<string>
}
export interface LeadsDataPageQuery extends LeadsDataQuery, PageQuery {}

/** @desc 查询线索自定义字段存值列表 */
export function listLeadsData(query: LeadsDataPageQuery) {
  return http.get<PageRes<LeadsDataResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询线索自定义字段存值详情 */
export function getLeadsData(id: string) {
  return http.get<LeadsDataDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增线索自定义字段存值 */
export function addLeadsData(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改线索自定义字段存值 */
export function updateLeadsData(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除线索自定义字段存值 */
export function deleteLeadsData(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出线索自定义字段存值 */
export function exportLeadsData(query: LeadsDataQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
