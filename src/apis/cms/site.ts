import http from '@/utils/http'

const BASE_URL = '/cms/site'

export interface SiteResp {
  name: string
  domain: string
  logo: string
  parentId: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface SiteDetailResp {
  id: string
  name: string
  domain: string
  logo: string
  parentId: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  createUserString: string
  updateUserString: string
}
export interface SiteQuery {
  name: string | undefined
  domain: string | undefined
  parentId: string | undefined
  createUser: string | undefined
  createTime: string | undefined
  sort: Array<string>
}
export interface SitePageQuery extends SiteQuery, PageQuery {}

/** @desc 查询站点表列表 */
export function listSite(query: SitePageQuery) {
  return http.get<PageRes<SiteResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询站点表详情 */
export function getSite(id: string) {
  return http.get<SiteDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增站点表 */
export function addSite(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改站点表 */
export function updateSite(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除站点表 */
export function deleteSite(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出站点表 */
export function exportSite(query: SiteQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
