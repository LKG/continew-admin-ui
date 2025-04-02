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
	    <a-input-search v-model="queryForm.fieldId" placeholder="请输入fieldId" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.name" placeholder="请输入字段名称" allow-clear @search="search" />
	    <a-input-search v-model="queryForm.createTime" placeholder="请输入创建时间" allow-clear @search="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['cms:siteData:create']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['cms:siteData:export']" @click="onExport">
          <template #icon><icon-upload /></template>
          <template #default>导入</template>
        </a-button>
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['cms:siteData:get']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['cms:siteData:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['cms:siteData:delete']"
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

    <SiteDataAddDrawer ref="SiteDataAddDrawerRef" @save-success="search" />
    <SiteDataDetailDrawer ref="SiteDataDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import type { TableInstance } from '@arco-design/web-vue'
import SiteDataAddModal from './SiteDataAddModal.vue'
import SiteDataDetailDrawer from './SiteDataDetailDrawer.vue'
import { type SiteDataResp, type SiteDataQuery, deleteSiteData, exportSiteData, listSiteData } from '@/apis/cms/siteData'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'SiteData' })


const queryForm = reactive<SiteDataQuery>({
  fieldId: undefined,
  name: undefined,
  createTime: undefined,
  sort: ['id,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listSiteData({ ...queryForm, ...page }), { immediate: true })
const columns: TableInstance['columns'] = [
  { title: 'fieldId', dataIndex: 'fieldId', slotName: 'fieldId' },
  { title: '字段编码', dataIndex: 'code', slotName: 'code' },
  { title: '字段名称', dataIndex: 'name', slotName: 'name' },
  { title: '', dataIndex: 'value', slotName: 'value' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  { title: '', dataIndex: 'createUserString', slotName: 'createUser' },
  { title: '修改时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  { title: '', dataIndex: 'updateUserString', slotName: 'updateUser' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['cms:siteData:get', 'cms:siteData:update', 'cms:siteData:delete'])
  }
]

// 重置
const reset = () => {
  queryForm.fieldId = undefined
  queryForm.name = undefined
  queryForm.createTime = undefined
  search()
}

// 删除
const onDelete = (record: SiteDataResp) => {
  return handleDelete(() => deleteSiteData(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportSiteData(queryForm))
}

const SiteDataAddDrawer = ref<InstanceType<typeof SiteDataAddModal>>()
// 新增
const onAdd = () => {
  SiteDataAddDrawer.value?.onAdd()
}

// 修改
const onUpdate = (record: SiteDataResp) => {
  SiteDataAddDrawer.value?.onUpdate(record.id)
}

const SiteDataDetailDrawerRef = ref<InstanceType<typeof SiteDataDetailDrawer>>()
// 详情
const onDetail = (record: SiteDataResp) => {
  SiteDataDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
