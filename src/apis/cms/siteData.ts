import http from '@/utils/http'

const BASE_URL = '/cms/siteData'

export interface SiteDataResp {
  fieldId: string
  code: string
  name: string
  value: string
  createTime: string
  createUser: string
  updateTime: string
  updateUser: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface SiteDataDetailResp {
  id: string
  fieldId: string
  code: string
  name: string
  value: string
  createTime: string
  createUser: string
  updateTime: string
  updateUser: string
  siteId: string
  createUserString: string
  updateUserString: string
}
export interface SiteDataQuery {
  fieldId: string | undefined
  name: string | undefined
  createTime: string | undefined
  sort: Array<string>
}
export interface SiteDataPageQuery extends SiteDataQuery, PageQuery {}

/** @desc 查询站点自定义字段存值列表 */
export function listSiteData(query: SiteDataPageQuery) {
  return http.get<PageRes<SiteDataResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询站点自定义字段存值详情 */
export function getSiteData(id: string) {
  return http.get<SiteDataDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增站点自定义字段存值 */
export function addSiteData(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改站点自定义字段存值 */
export function updateSiteData(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除站点自定义字段存值 */
export function deleteSiteData(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出站点自定义字段存值 */
export function exportSiteData(query: SiteDataQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
