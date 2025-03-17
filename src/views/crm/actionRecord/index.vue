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
	    <a-input-search v-model="queryForm.ipAddress" placeholder="请输入ip地址" allow-clear @search="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-left>
        <a-button v-permission="['crm:actionRecord:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['crm:actionRecord:export']" @click="onExport">
          <template #icon><icon-upload /></template>
          <template #default>导入</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['crm:actionRecord:detail']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['crm:actionRecord:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['crm:actionRecord:delete']"
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

    <ActionRecordAddDrawer ref="ActionRecordAddDrawerRef" @save-success="search" />
    <ActionRecordDetailDrawer ref="ActionRecordDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import ActionRecordAddModal from './ActionRecordAddModal.vue'
import ActionRecordDetailDrawer from './ActionRecordDetailDrawer.vue'
import { type ActionRecordResp, type ActionRecordQuery, deleteActionRecord, exportActionRecord, listActionRecord } from '@/apis/crm/actionRecord'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'ActionRecord' })


const queryForm = reactive<ActionRecordQuery>({
  ipAddress: undefined,
  sort: ['id,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listActionRecord({ ...queryForm, ...page }), { immediate: true })
const columns = ref<TableInstanceColumns[]>([
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  { title: 'ip地址', dataIndex: 'ipAddress', slotName: 'ipAddress' },
  { title: '模块类型', dataIndex: 'types', slotName: 'types' },
  { title: '被操作对象ID', dataIndex: 'actionId', slotName: 'actionId' },
  { title: '对象', dataIndex: 'object', slotName: 'object' },
  { title: '行为', dataIndex: 'behavior', slotName: 'behavior' },
  { title: '内容', dataIndex: 'content', slotName: 'content' },
  { title: '详情', dataIndex: 'detail', slotName: 'detail' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['crm:actionRecord:detail', 'crm:actionRecord:update', 'crm:actionRecord:delete'])
  }
]);

// 重置
const reset = () => {
  queryForm.ipAddress = undefined
  search()
}

// 删除
const onDelete = (record: ActionRecordResp) => {
  return handleDelete(() => deleteActionRecord(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportActionRecord(queryForm))
}

const ActionRecordAddDrawer = ref<InstanceType<typeof ActionRecordAddModal>>()
// 新增
const onAdd = () => {
  ActionRecordAddDrawer.value?.onAdd()
}

// 修改
const onUpdate = (record: ActionRecordResp) => {
  ActionRecordAddDrawer.value?.onUpdate(record.id)
}

const ActionRecordDetailDrawerRef = ref<InstanceType<typeof ActionRecordDetailDrawer>>()
// 详情
const onDetail = (record: ActionRecordResp) => {
  ActionRecordDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
