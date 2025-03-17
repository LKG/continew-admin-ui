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
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-left>
        <a-button v-permission="['crm:ownerRecord:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['crm:ownerRecord:export']" @click="onExport">
          <template #icon><icon-upload /></template>
          <template #default>导入</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['crm:ownerRecord:detail']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['crm:ownerRecord:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['crm:ownerRecord:delete']"
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

    <OwnerRecordAddDrawer ref="OwnerRecordAddDrawerRef" @save-success="search" />
    <OwnerRecordDetailDrawer ref="OwnerRecordDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import OwnerRecordAddModal from './OwnerRecordAddModal.vue'
import OwnerRecordDetailDrawer from './OwnerRecordDetailDrawer.vue'
import { type OwnerRecordResp, type OwnerRecordQuery, deleteOwnerRecord, exportOwnerRecord, listOwnerRecord } from '@/apis/crm/ownerRecord'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'OwnerRecord' })


const queryForm = reactive<OwnerRecordQuery>({
  sort: ['id,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listOwnerRecord({ ...queryForm, ...page }), { immediate: true })
const columns = ref<TableInstanceColumns[]>([
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['crm:ownerRecord:detail', 'crm:ownerRecord:update', 'crm:ownerRecord:delete'])
  }
]);

// 重置
const reset = () => {
  search()
}

// 删除
const onDelete = (record: OwnerRecordResp) => {
  return handleDelete(() => deleteOwnerRecord(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportOwnerRecord(queryForm))
}

const OwnerRecordAddDrawer = ref<InstanceType<typeof OwnerRecordAddModal>>()
// 新增
const onAdd = () => {
  OwnerRecordAddDrawer.value?.onAdd()
}

// 修改
const onUpdate = (record: OwnerRecordResp) => {
  OwnerRecordAddDrawer.value?.onUpdate(record.id)
}

const OwnerRecordDetailDrawerRef = ref<InstanceType<typeof OwnerRecordDetailDrawer>>()
// 详情
const onDetail = (record: OwnerRecordResp) => {
  OwnerRecordDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
