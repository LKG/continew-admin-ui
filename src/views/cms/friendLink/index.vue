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
      <template #toolbar-left>
        <a-input-search v-model="queryForm.name" placeholder="请输入友链名称" allow-clear @search="search" />
        <DateRangePicker v-model="queryForm.createTime" format="YYYY-MM-DD" @change="search" />
        <a-select
          v-model="queryForm.checkStatus"
          :options="check_status"
          placeholder="请选择审核状态"
          allow-clear
          style="width: 150px"
          @change="search"
        />
        <DateRangePicker v-model="queryForm.expiryTime" format="YYYY-MM-DD" @change="search" />
        <a-input-search v-model="queryForm.status" placeholder="请输入状态" allow-clear @search="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['cms:friendLink:add']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['cms:friendLink:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button>
      </template>
      <template #checkStatus="{ record }">
        <GiCellTag :value="record.checkStatus" :dict="check_status" />
      </template>
      <template #name="{ record }">
        <GiCellAvatar :avatar="record.logo" :name="record.name" />
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['cms:friendLink:detail']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['cms:friendLink:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link
            v-permission="['cms:friendLink:delete']"
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

    <FriendLinkAddModal ref="FriendLinkAddModalRef" @save-success="search" />
    <FriendLinkDetailDrawer ref="FriendLinkDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import type { TableInstance } from '@arco-design/web-vue'
import FriendLinkAddModal from './FriendLinkAddModal.vue'
import FriendLinkDetailDrawer from './FriendLinkDetailDrawer.vue'
import { type FriendLinkQuery, type FriendLinkResp, deleteFriendLink, exportFriendLink, listFriendLink } from '@/apis/cms/friendLink'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'FriendLink' })

const { check_status } = useDict('check_status')

const queryForm = reactive<FriendLinkQuery>({
  name: undefined,
  createTime: undefined,
  checkStatus: undefined,
  expiryTime: undefined,
  status: undefined,
  sort: ['id,desc'],
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete,
} = useTable((page) => listFriendLink({ ...queryForm, ...page }), { immediate: true })
const columns: TableInstance['columns'] = [
  { title: '友链名称', dataIndex: 'name', slotName: 'name' },
  { title: '友链地址', dataIndex: 'url', slotName: 'url' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  // { title: '审核状态', dataIndex: 'checkStatus', slotName: 'checkStatus' },
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  // { title: '备注', dataIndex: 'remark', slotName: 'remark' },
  // { title: 'logo', dataIndex: 'logo', slotName: 'logo' },
  { title: '上链地址', dataIndex: 'requestUrl', slotName: 'requestUrl' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['cms:friendLink:detail', 'cms:friendLink:update', 'cms:friendLink:delete']),
  },
]

// 重置
const reset = () => {
  queryForm.name = undefined
  queryForm.createTime = undefined
  queryForm.checkStatus = undefined
  queryForm.expiryTime = undefined
  queryForm.status = undefined
  search()
}

// 删除
const onDelete = (record: FriendLinkResp) => {
  return handleDelete(() => deleteFriendLink(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true,
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportFriendLink(queryForm))
}

const FriendLinkAddModalRef = ref<InstanceType<typeof FriendLinkAddModal>>()
// 新增
const onAdd = () => {
  FriendLinkAddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: FriendLinkResp) => {
  FriendLinkAddModalRef.value?.onUpdate(record.id)
}

const FriendLinkDetailDrawerRef = ref<InstanceType<typeof FriendLinkDetailDrawer>>()
// 详情
const onDetail = (record: FriendLinkResp) => {
  FriendLinkDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
