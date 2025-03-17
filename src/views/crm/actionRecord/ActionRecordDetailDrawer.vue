<template>
  <a-drawer v-model:visible="visible" title="字段操作记录详情" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="操作人ID">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="ip地址">{{ dataDetail?.ipAddress }}</a-descriptions-item>
      <a-descriptions-item label="模块类型">{{ dataDetail?.types }}</a-descriptions-item>
      <a-descriptions-item label="被操作对象ID">{{ dataDetail?.actionId }}</a-descriptions-item>
      <a-descriptions-item label="对象">{{ dataDetail?.object }}</a-descriptions-item>
      <a-descriptions-item label="行为">{{ dataDetail?.behavior }}</a-descriptions-item>
      <a-descriptions-item label="内容">{{ dataDetail?.content }}</a-descriptions-item>
      <a-descriptions-item label="详情">{{ dataDetail?.detail }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type ActionRecordDetailResp, getActionRecord as getDetail } from '@/apis/crm/actionRecord'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<ActionRecordDetailResp>()
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
