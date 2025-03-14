import http from '@/utils/http'

const BASE_URL = '/cms/friendLink'

export interface FriendLinkResp {
  id: string
  name: string
  url: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  checkStatus: string
  expiryTime: string
  status: string
  remark: string
  logo: string
  requestUrl: string
  createUserString: string
  updateUserString: string
  disabled: boolean
}
export interface FriendLinkDetailResp {
  id: string
  name: string
  url: string
  createUser: string
  createTime: string
  updateUser: string
  updateTime: string
  checkStatus: string
  expiryTime: string
  status: string
  remark: string
  logo: string
  requestUrl: string
  createUserString: string
  updateUserString: string
}
export interface FriendLinkQuery {
  name: string | undefined
  createTime: string | undefined
  checkStatus: string | undefined
  expiryTime: string | undefined
  status: string | undefined
  sort: Array<string>
}
export interface FriendLinkPageQuery extends FriendLinkQuery, PageQuery {}

/** @desc 查询友情链接列表 */
export function listFriendLink(query: FriendLinkPageQuery) {
  return http.get<PageRes<FriendLinkResp[]>>(`${BASE_URL}`, query)
}

/** @desc 查询友情链接详情 */
export function getFriendLink(id: string) {
  return http.get<FriendLinkDetailResp>(`${BASE_URL}/${id}`)
}

/** @desc 新增友情链接 */
export function addFriendLink(data: any) {
  return http.post(`${BASE_URL}`, data)
}

/** @desc 修改友情链接 */
export function updateFriendLink(data: any, id: string) {
  return http.put(`${BASE_URL}/${id}`, data)
}

/** @desc 删除友情链接 */
export function deleteFriendLink(id: string) {
  return http.del(`${BASE_URL}/${id}`)
}

/** @desc 导出友情链接 */
export function exportFriendLink(query: FriendLinkQuery) {
  return http.download(`${BASE_URL}/export`, query)
}
