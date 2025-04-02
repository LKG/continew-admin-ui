<template>
  <a-drawer v-model:visible="visible" title="站点自定义字段存值详情" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="主键id">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="fieldId">{{ dataDetail?.fieldId }}</a-descriptions-item>
      <a-descriptions-item label="字段编码">{{ dataDetail?.code }}</a-descriptions-item>
      <a-descriptions-item label="字段名称">{{ dataDetail?.name }}</a-descriptions-item>
      <a-descriptions-item label="">{{ dataDetail?.value }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item label="siteId">{{ dataDetail?.siteId }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type SiteDataDetailResp, getSiteData as getDetail } from '@/apis/cms/siteData'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<SiteDataDetailResp>()
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
