<template>
  <a-drawer v-model:visible="visible" title="公海详情" :width="width >= 600 ? 600 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="主键id">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="公海名称">{{ dataDetail?.poolName }}</a-descriptions-item>
      <a-descriptions-item label="管理员 “,”分割">{{ dataDetail?.adminUserId }}</a-descriptions-item>
      <a-descriptions-item label="公海规则员工成员 “,”分割">{{ dataDetail?.memberUserId }}</a-descriptions-item>
      <a-descriptions-item label="公海规则部门成员 “,”分割">{{ dataDetail?.memberDeptId }}</a-descriptions-item>
      <a-descriptions-item label="状态 0 停用 1启用">{{ dataDetail?.status }}</a-descriptions-item>
      <a-descriptions-item label="前负责人领取规则 0不限制 1限制">{{ dataDetail?.preOwnerSetting }}</a-descriptions-item>
      <a-descriptions-item label="前负责人领取规则限制天数">{{ dataDetail?.preOwnerSettingDay }}</a-descriptions-item>
      <a-descriptions-item label="是否限制领取频率 0不限制 1限制">{{ dataDetail?.receiveSetting }}</a-descriptions-item>
      <a-descriptions-item label="领取频率规则">{{ dataDetail?.receiveNum }}</a-descriptions-item>
      <a-descriptions-item label="是否设置提前提醒 0不开启 1开启">{{ dataDetail?.remindSetting }}</a-descriptions-item>
      <a-descriptions-item label="提醒规则天数">{{ dataDetail?.remindDay }}</a-descriptions-item>
      <a-descriptions-item label="收回规则 0不自动收回 1自动收回">{{ dataDetail?.putInRule }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUser }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUser }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type CustomerPoolDetailResp, getCustomerPool as getDetail } from '@/apis/crm/customerPool'

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<CustomerPoolDetailResp>()
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
