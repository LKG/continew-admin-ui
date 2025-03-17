<template>
  <div class="gi_table_page">
    <GiTable
      row-key="id"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
      :pagination="pagination"
      :disabled-tools="['size']"
      :disabled-column-keys="['name']"
      @refresh="search"
    >
            <template #toolbar-top>
	    <a-input-search v-model="queryForm.poolName" placeholder="请输入公海名称" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.adminUserId" placeholder="请输入管理员 “,”分割" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.status" placeholder="请输入状态 0 停用 1启用" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.preOwnerSetting" placeholder="请输入前负责人领取规则 0不限制 1限制" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.receiveSetting" placeholder="请输入是否限制领取频率 0不限制 1限制" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.remindSetting" placeholder="请输入是否设置提前提醒 0不开启 1开启" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.putInRule" placeholder="请输入收回规则 0不自动收回 1自动收回" allow-clear @search="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-left>
        <a-button v-permission="['crm:customerPool:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['crm:customerPool:export']" @click="onExport">
          <template #icon><icon-upload /></template>
          <template #default>导入</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['crm:customerPool:detail']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['crm:customerPool:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['crm:customerPool:delete']"
            status="danger"
            :disabled="record.disabled"
            :title="record.disabled ? '不可删除' : '删除'"
            @click="onDelete(record)"
          >
            删除
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <CustomerPoolAddDrawer ref="CustomerPoolAddDrawerRef" @save-success="search" />
    <CustomerPoolDetailDrawer ref="CustomerPoolDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import CustomerPoolAddModal from './CustomerPoolAddModal.vue'
import CustomerPoolDetailDrawer from './CustomerPoolDetailDrawer.vue'
import { type CustomerPoolResp, type CustomerPoolQuery, deleteCustomerPool, exportCustomerPool, listCustomerPool } from '@/apis/crm/customerPool'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'CustomerPool' })


const queryForm = reactive<CustomerPoolQuery>({
  poolName: undefined,
  adminUserId: undefined,
  status: undefined,
  preOwnerSetting: undefined,
  receiveSetting: undefined,
  remindSetting: undefined,
  putInRule: undefined,
  sort: ['id,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listCustomerPool({ ...queryForm, ...page }), { immediate: true })
const columns = ref<TableInstanceColumns[]>([
  { title: '公海名称', dataIndex: 'poolName', slotName: 'poolName' },
  { title: '状态 0 停用 1启用', dataIndex: 'status', slotName: 'status' },
  { title: '前负责人领取规则 0不限制 1限制', dataIndex: 'preOwnerSetting', slotName: 'preOwnerSetting' },
  { title: '前负责人领取规则限制天数', dataIndex: 'preOwnerSettingDay', slotName: 'preOwnerSettingDay' },
  { title: '是否限制领取频率 0不限制 1限制', dataIndex: 'receiveSetting', slotName: 'receiveSetting' },
  { title: '领取频率规则', dataIndex: 'receiveNum', slotName: 'receiveNum' },
  { title: '是否设置提前提醒 0不开启 1开启', dataIndex: 'remindSetting', slotName: 'remindSetting' },
  { title: '提醒规则天数', dataIndex: 'remindDay', slotName: 'remindDay' },
  { title: '收回规则 0不自动收回 1自动收回', dataIndex: 'putInRule', slotName: 'putInRule' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['crm:customerPool:detail', 'crm:customerPool:update', 'crm:customerPool:delete'])
  }
]);

// 重置
const reset = () => {
  queryForm.poolName = undefined
  queryForm.adminUserId = undefined
  queryForm.status = undefined
  queryForm.preOwnerSetting = undefined
  queryForm.receiveSetting = undefined
  queryForm.remindSetting = undefined
  queryForm.putInRule = undefined
  search()
}

// 删除
const onDelete = (record: CustomerPoolResp) => {
  return handleDelete(() => deleteCustomerPool(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportCustomerPool(queryForm))
}

const CustomerPoolAddDrawer = ref<InstanceType<typeof CustomerPoolAddModal>>()
// 新增
const onAdd = () => {
  CustomerPoolAddDrawer.value?.onAdd()
}

// 修改
const onUpdate = (record: CustomerPoolResp) => {
  CustomerPoolAddDrawer.value?.onUpdate(record.id)
}

const CustomerPoolDetailDrawerRef = ref<InstanceType<typeof CustomerPoolDetailDrawer>>()
// 详情
const onDetail = (record: CustomerPoolResp) => {
  CustomerPoolDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
