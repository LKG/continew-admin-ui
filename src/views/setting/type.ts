export interface ModeItem {
  title: string
  icon: string | Component
  subtitle: string
  value?: string
  type: 'phone' | 'email' | 'gitee' | 'github' | 'qq' | 'wechat' | 'weibo' | 'lark' | 'tiktok' | 'baidu'
  jumpMode?: 'link' | 'modal'
  status: boolean
  statusString?: string
}
