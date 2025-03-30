export interface ModeItem {
  title: string
  icon: string
  subtitle: string
  value?: string
  type: 'phone' | 'email' | 'gitee' | 'github' | 'qq' | 'wechat' | 'weibo' | 'lark' | 'tiktok'
  jumpMode?: 'link' | 'modal'
  status: boolean
  statusString?: string
}
