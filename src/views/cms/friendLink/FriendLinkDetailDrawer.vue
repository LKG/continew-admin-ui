<template>
  <a-drawer v-model:visible="visible" title="友情链接详情" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="id 主键">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="友链名称">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item label="友链地址">{{ dataDetail?.url }}</a-descriptions-item>
      <a-descriptions-item label="">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="审核状态">{{ dataDetail?.checkStatus }}</a-descriptions-item>
      <a-descriptions-item label="">{{ dataDetail?.expiryTime }}</a-descriptions-item>
      <a-descriptions-item label="状态">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item label="备注">{{ dataDetail?.remark }}</a-descriptions-item>
      <a-descriptions-item label="logo">{{ dataDetail?.logo }}</a-descriptions-item>
      <a-descriptions-item label="上链地址">{{ dataDetail?.requestUrl }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type FriendLinkDetailResp, getFriendLink as getDetail } from '@/apis/cms/friendLink'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<FriendLinkDetailResp>()
const visible = ref(false)

// 查询详情
const getDataDetail = async () => {
  const { data } = await getDetail(dataId.value)
  dataDetail.value = data
}

// 打开
const onOpen = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style scoped lang="scss"></style>
