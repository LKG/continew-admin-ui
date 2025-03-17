import http from '@/utils/http'

const BASE_URL = '/crm/ownerRecord'

export interface OwnerRecordResp {
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface OwnerRecordDetailResp {
  id: string
  typeId: string
  type: string
  preOwnerUserId: string
  postOwnerUserId: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface OwnerRecordQuery {
  sort: Array<string>
}
export interface OwnerRecordPageQuery extends OwnerRecordQuery, PageQuery {}

/** @desc 查询负责人变更记录列表 */
export function listOwnerRecord(query: OwnerRecordPageQuery) {
  return http.get<PageRes<OwnerRecordResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询负责人变更记录详情 */
export function getOwnerRecord(id: string) {
  return http.get<OwnerRecordDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增负责人变更记录 */
export function addOwnerRecord(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改负责人变更记录 */
export function updateOwnerRecord(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除负责人变更记录 */
export function deleteOwnerRecord(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出负责人变更记录 */
export function exportOwnerRecord(query: OwnerRecordQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
