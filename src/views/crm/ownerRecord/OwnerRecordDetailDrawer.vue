<template>
  <a-drawer v-model:visible="visible" title="负责人变更记录详情" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="主键id">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="对象id">{{ dataDetail?.typeId }}</a-descriptions-item>
      <a-descriptions-item label="对象类型">{{ dataDetail?.type }}</a-descriptions-item>
      <a-descriptions-item label="上一负责人">{{ dataDetail?.preOwnerUserId }}</a-descriptions-item>
      <a-descriptions-item label="接手负责人">{{ dataDetail?.postOwnerUserId }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type OwnerRecordDetailResp, getOwnerRecord as getDetail } from '@/apis/crm/ownerRecord'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<OwnerRecordDetailResp>()
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
