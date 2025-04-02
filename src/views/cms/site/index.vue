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
        <a-input-search v-model="queryForm.name" placeholder="请输入站点名称" allow-clear @search="search" />
        <a-input-search v-model="queryForm.domain" placeholder="请输入域名" allow-clear @search="search" />
        <a-input-search v-model="queryForm.parentId" placeholder="请输入上级站点id" allow-clear @search="search" />
        <a-input-search v-model="queryForm.createUser" placeholder="请输入创建人" allow-clear @search="search" />
        <a-input-search v-model="queryForm.createTime" placeholder="请输入创建时间" allow-clear @search="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['generator:site:create']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['generator:site:export']" @click="onExport">
          <template #icon><icon-upload /></template>
          <template #default>导入</template>
        </a-button>
      </template>
      <template #name="{ record }">
        <GiCellAvatar :avatar="record.logo" :name="record.name" />
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['generator:site:get']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['generator:site:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['generator:site:delete']"
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

    <SiteAddDrawer ref="SiteAddDrawerRef" @save-success="search" />
    <SiteDetailDrawer ref="SiteDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import type { TableInstance } from '@arco-design/web-vue'
import type SiteAddModal from './SiteAddModal.vue'
import SiteDetailDrawer from './SiteDetailDrawer.vue'
import { type SiteQuery, type SiteResp, deleteSite, exportSite, listSite } from '@/apis/cms/site'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'Site' })

const queryForm = reactive<SiteQuery>({
  name: undefined,
  domain: undefined,
  parentId: undefined,
  createUser: undefined,
  createTime: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listSite({ ...queryForm, ...page }), { immediate: true })
const columns: TableInstance['columns'] = [
  {
    title: '站点名称',
    dataIndex: 'name',
    slotName: 'name',
    minWidth: 140,
    ellipsis: true,
    tooltip: true,
    fixed: !isMobile() ? 'left' : undefined,
  },
  { title: '域名', dataIndex: 'domain', slotName: 'domain' },
  { title: '上级站点id', dataIndex: 'parentId', slotName: 'parentId' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  { title: '修改时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['generator:site:get', 'generator:site:update', 'generator:site:delete']),
  },
]

// 重置
const reset = () => {
  queryForm.name = undefined
  queryForm.domain = undefined
  queryForm.parentId = undefined
  queryForm.createUser = undefined
  queryForm.createTime = undefined
  search()
}

// 删除
const onDelete = (record: SiteResp) => {
  return handleDelete(() => deleteSite(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportSite(queryForm))
}

const SiteAddDrawer = ref<InstanceType<typeof SiteAddModal>>()
// 新增
const onAdd = () => {
  SiteAddDrawer.value?.onAdd()
}

// 修改
const onUpdate = (record: SiteResp) => {
  SiteAddDrawer.value?.onUpdate(record.id)
}

const SiteDetailDrawerRef = ref<InstanceType<typeof SiteDetailDrawer>>()
// 详情
const onDetail = (record: SiteResp) => {
  SiteDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
