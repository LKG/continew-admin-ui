import http from '@/utils/http'

const BASE_URL = '/crm/leadsUserStar'

export interface LeadsUserStarResp {
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface LeadsUserStarDetailResp {
  id: string
  userId: string
  leadsId: string
  createTime: string
  createUserString: string
  updateUserString: string
}
export interface LeadsUserStarQuery {
  sort: Array<string>
}
export interface LeadsUserStarPageQuery extends LeadsUserStarQuery, PageQuery {}

/** @desc 查询用户线索标星关系 列表 */
export function listLeadsUserStar(query: LeadsUserStarPageQuery) {
  return http.get<PageRes<LeadsUserStarResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询用户线索标星关系 详情 */
export function getLeadsUserStar(id: string) {
  return http.get<LeadsUserStarDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增用户线索标星关系  */
export function addLeadsUserStar(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改用户线索标星关系  */
export function updateLeadsUserStar(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除用户线索标星关系  */
export function deleteLeadsUserStar(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出用户线索标星关系  */
export function exportLeadsUserStar(query: LeadsUserStarQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
