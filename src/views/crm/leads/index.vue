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
        <a-input-search v-model="queryForm.isTransform" placeholder="请输入1已转化 0 未转化" allow-clear @search="search" />
        <a-input-search v-model="queryForm.leadsName" placeholder="请输入线索名称" allow-clear @search="search" />
        <a-input-search v-model="queryForm.email" placeholder="请输入邮箱" allow-clear @search="search" />
        <a-input-search v-model="queryForm.batchId" placeholder="请输入批次 比如附件批次" allow-clear @search="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-left>
        <a-button v-permission="['crm:leads:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['crm:leads:export']" @click="onExport">
          <template #icon><icon-upload /></template>
          <template #default>导入</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['crm:leads:detail']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['crm:leads:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['crm:leads:delete']"
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
    <LeadsDetailDrawer ref="LeadsDetailDrawerRef" save-success="search" />
  </div>
</template>

<script setup lang="ts">
import LeadsDetailDrawer from './LeadsDetailDrawer.vue'
import { type LeadsQuery, type LeadsResp, deleteLeads, exportLeads, listLeads } from '@/apis/crm/leads'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'Leads' })

const queryForm = reactive<LeadsQuery>({
  isTransform: undefined,
  leadsName: undefined,
  email: undefined,
  batchId: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listLeads({ ...queryForm, ...page }), { immediate: true })
const columns = ref<TableInstanceColumns[]>([
  { title: '线索名称', dataIndex: 'leadsName', slotName: 'leadsName' },
  { title: '电话', dataIndex: 'telephone', slotName: 'telephone' },
  { title: '手机号', dataIndex: 'mobile', slotName: 'mobile' },
  { title: '邮箱', dataIndex: 'email', slotName: 'email' },
  { title: '地址', dataIndex: 'address', slotName: 'address' },
  { title: '备注', dataIndex: 'remark', slotName: 'remark' },
  { title: '是否转换', dataIndex: 'isTransform', slotName: 'isTransform' },
  { title: '跟进状态', dataIndex: 'followup', slotName: 'followup' },
  { title: '下次联系时间', dataIndex: 'nextTime', slotName: 'nextTime' },
  { title: '修改人', dataIndex: 'updateUserString', slotName: 'updateUser' },
  { title: '最后跟进时间', dataIndex: 'lastTime', slotName: 'lastTime' },
  { title: '最后跟进记录', dataIndex: 'lastContent', slotName: 'lastContent' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['crm:leads:detail', 'crm:leads:update', 'crm:leads:delete']),
  },
])

// 重置
const reset = () => {
  queryForm.isTransform = undefined
  queryForm.leadsName = undefined
  queryForm.email = undefined
  queryForm.batchId = undefined
  search()
}

// 删除
const onDelete = (record: LeadsResp) => {
  return handleDelete(() => deleteLeads(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportLeads(queryForm))
}

const LeadsAddDrawer = ref<InstanceType<typeof LeadsAddModal>>()
// 新增
const onAdd = () => {
  LeadsAddDrawer.value?.onAdd()
}

// 修改
const onUpdate = (record: LeadsResp) => {
  LeadsAddDrawer.value?.onUpdate(record.id)
}

const LeadsDetailDrawerRef = ref<InstanceType<typeof LeadsDetailDrawer>>()
// 详情
const onDetail = (record: LeadsResp) => {
  LeadsDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
