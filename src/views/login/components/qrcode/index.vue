<template>
  <div v-if="isQr" class="login-right">
    <div>
      <h2>微信扫码 安全登录</h2>
    </div>
    <div class="qr-container">
      <div v-if="qrStatus === 'loading'" class="qrcode-mask">
        <a-button type="text" loading long>Loading...</a-button>
      </div>
      <div v-else-if="qrStatus === 'expired'" class="qrcode-mask">
        <a-alert type="error" style="background-color:transparent;width:auto;">二维码过期</a-alert>
        <a-link :hoverable="false" style="width: 100%;display: flex;" @click="loadQrCode">
          <template #icon>
            <icon-refresh />
          </template>刷新二维码
        </a-link>
      </div>
      <div v-else-if="qrStatus === 'scanned'" class="qrcode-mask">
        <a-alert type="success" style="background-color:transparent;width:auto;">已扫描</a-alert>
      </div>
      <vue-qr
        v-if="qrStatus !== 'active'"
        text="https://www.gongwk.com/"
        style="box-shadow: 0 0 8px #DDD;"
        :correct-level="3"
        logo-src="/logo.svg"
        :logo-scale="40"
        :size="196"
        :margin="5"
      />
      <vue-qr
        v-if="qrStatus === 'active'"
        style="box-shadow: 0 0 8px #DDD;"
        text="https://www.gongwk.com/"
        logo-src="/logo.svg"
        :correct-level="3"
        :logo-scale="40"
        :size="196"
        :margin="5"
      />
    </div>
    <a-space direction="vertical" style="width: 100%;">
      <a-link :hoverable="false" style="width: 100%;display: flex;color: #000;" @click="loadQrCode">
        <template #icon>
          <icon-refresh />
        </template>刷新二维码
      </a-link>
      <a-link :hoverable="false" style="width: 100%;display: flex;color: #000;">微信扫码关注登录注册</a-link>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { useStorage } from '@vueuse/core'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { getImageCaptcha } from '@/apis/common'
import { useTabsStore, useUserStore } from '@/stores'
// 定义二维码状态
const qrStatus = ref<'active' | 'expired' | 'loading' | 'scanned'>('loading')
// 模拟设置二维码状态的方法
const setQrStatus = (status: 'active' | 'expired' | 'loading' | 'scanned') => {
  qrStatus.value = status
}
const loadQrCode = () => {
  qrStatus.value = 'loading'
  // 模拟加载过程
  setTimeout(() => {
    setQrStatus('active')
  }, 1000)
}
const loginConfig = useStorage('login-config', {
  rememberMe: true,
})
// 是否启用验证码
const isCaptchaEnabled = ref(true)
// 验证码图片
const captchaImgBase64 = ref()

const formRef = ref<FormInstance>()
const form = reactive({
  captcha: '',
  uuid: '',
  expired: false,
})

// 验证码过期定时器
let timer
const startTimer = (expireTime: number, curTime = Date.now()) => {
  if (timer) {
    clearTimeout(timer)
  }
  const remainingTime = expireTime - curTime
  if (remainingTime <= 0) {
    form.expired = true
    return
  }
  timer = setTimeout(() => {
    form.expired = true
  }, remainingTime)
}
// 组件销毁时清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

// 获取验证码
const getCaptcha = () => {
  getImageCaptcha().then((res) => {
    const { uuid, img, expireTime, isEnabled } = res.data
    isCaptchaEnabled.value = isEnabled
    captchaImgBase64.value = img
    form.uuid = uuid
    form.expired = false
    startTimer(expireTime, Number(res.timestamp))
  })
}

// const userStore = useUserStore()
const tabsStore = useTabsStore()
const router = useRouter()
const loading = ref(false)
// 登录
const handleLogin = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return
    loading.value = true
    // await userStore.accountLogin({
    //   username: form.username,
    //   password: encryptByRsa(form.password) || '',
    //   captcha: form.captcha,
    //   uuid: form.uuid,
    // })
    tabsStore.reset()
    const { redirect, ...othersQuery } = router.currentRoute.value.query

    await router.push({
      path: (redirect as string) || '/',
      query: {
        ...othersQuery,
      },
    })
    Message.success('欢迎使用')
  } catch (error) {
    console.error(error)
    getCaptcha()
    form.captcha = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped lang="scss">
.arco-input-wrapper,
:deep(.arco-select-view-single) {
  height: 40px;
  border-radius: 4px;
  font-size: 13px;
}

.arco-input-wrapper.arco-input-error {
  background-color: rgb(var(--danger-1));
  border-color: rgb(var(--danger-3));
}

.arco-input-wrapper.arco-input-error:hover {
  background-color: rgb(var(--danger-1));
  border-color: rgb(var(--danger-6));
}

.arco-input-wrapper :deep(.arco-input) {
  font-size: 13px;
  color: var(--color-text-1);
}

.arco-input-wrapper:hover {
  border-color: rgb(var(--arcoblue-6));
}

.captcha {
  width: 111px;
  height: 36px;
  margin: 0 0 0 5px;
}

.btn {
  height: 40px;
}

.captcha-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay p {
  font-size: 12px;
  color: white;
}
</style>
