<template>
  <a-drawer v-model:visible="visible" title="线索详情" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="主键id">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="1已转化 0 未转化">{{ dataDetail?.isTransform }}</a-descriptions-item>
      <a-descriptions-item label="跟进状态 0未跟进1已跟进">{{ dataDetail?.followup }}</a-descriptions-item>
      <a-descriptions-item label="线索名称">{{ dataDetail?.leadsName }}</a-descriptions-item>
      <a-descriptions-item label="客户id">{{ dataDetail?.customerId }}</a-descriptions-item>
      <a-descriptions-item label="下次联系时间">{{ dataDetail?.nextTime }}</a-descriptions-item>
      <a-descriptions-item label="电话">{{ dataDetail?.telephone }}</a-descriptions-item>
      <a-descriptions-item label="手机号">{{ dataDetail?.mobile }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ dataDetail?.email }}</a-descriptions-item>
      <a-descriptions-item label="地址">{{ dataDetail?.address }}</a-descriptions-item>
      <a-descriptions-item label="备注">{{ dataDetail?.remark }}</a-descriptions-item>
      <a-descriptions-item label="负责人ID">{{ dataDetail?.ownerUserId }}</a-descriptions-item>
      <a-descriptions-item label="创建人ID">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="更新时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item label="批次 比如附件批次">{{ dataDetail?.batchId }}</a-descriptions-item>
      <a-descriptions-item label="1 分配">{{ dataDetail?.isReceive }}</a-descriptions-item>
      <a-descriptions-item label="最后跟进时间">{{ dataDetail?.lastTime }}</a-descriptions-item>
      <a-descriptions-item label="最后一条跟进记录">{{ dataDetail?.lastContent }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type LeadsDetailResp, getLeads as getDetail } from '@/apis/crm/leads'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<LeadsDetailResp>()
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
