import http from '@/utils/http'

const BASE_URL = '/crm/actionRecord'

export interface ActionRecordResp {
  createTime: string
  ipAddress: string
  types: string
  actionId: string
  object: string
  behavior: string
  content: string
  detail: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface ActionRecordDetailResp {
  id: string
  createUser: string
  createTime: string
  ipAddress: string
  types: string
  actionId: string
  object: string
  behavior: string
  content: string
  detail: string
  createUserString: string
  updateUserString: string
}
export interface ActionRecordQuery {
  ipAddress: string | undefined
  sort: Array<string>
}
export interface ActionRecordPageQuery extends ActionRecordQuery, PageQuery {}

/** @desc 查询字段操作记录列表 */
export function listActionRecord(query: ActionRecordPageQuery) {
  return http.get<PageRes<ActionRecordResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询字段操作记录详情 */
export function getActionRecord(id: string) {
  return http.get<ActionRecordDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增字段操作记录 */
export function addActionRecord(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改字段操作记录 */
export function updateActionRecord(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除字段操作记录 */
export function deleteActionRecord(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出字段操作记录 */
export function exportActionRecord(query: ActionRecordQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
