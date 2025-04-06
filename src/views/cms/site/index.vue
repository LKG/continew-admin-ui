<template>
  <div class="gi_table_page">
    <GiTable
      ref="tableRef"
      row-key="id"
      :data="dataList"
      :columns="columns"
      :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1700 }"
      :pagination="false"
      :disabled-column-keys="['title']"
      @refresh="search"
    >
      <template #expand-icon="{ expanded }">
        <IconDown v-if="expanded" />
        <IconRight v-else />
      </template>
      <template #toolbar-left>
        <a-input v-model="title" placeholder="搜索站点名称" allow-clear>
          <template #prefix><icon-search /></template>
        </a-input>
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['cms:site:create']" type="primary" @click="onAdd()">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button @click="onExpanded">
          <template #icon>
            <icon-list v-if="isExpanded" />
            <icon-mind-mapping v-else />
          </template>
          <template #default>
            <span v-if="!isExpanded">展开</span>
            <span v-else>折叠</span>
          </template>
        </a-button>
      </template>
      <template #name="{ record }">
        <GiCellAvatar :avatar="record.logo" :name="record.name" :size="15" />
      </template>
      <template #action="{ record }">
        <a-space>
          <a-link v-permission="['cms:site:get']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['cms:site:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link v-permission="['cms:site:delete']" status="danger" title="删除" @click="onDelete(record)">删除</a-link>
          <a-link
            v-permission="['cms:site:create']"
            :disabled="![1, 2].includes(record.type)"
            :title="![1, 2].includes(record.type) ? '不可添加下级菜单' : '新增'"
            @click="onAdd(record.id)"
          >
            新增
          </a-link>
        </a-space>
      </template>
    </GiTable>
    <SiteDetailDrawer ref="SiteDetailDrawerRef" />
    <SiteAddModal ref="SiteAddModalRef" :menus="dataList" @save-success="search" />
  </div>
</template>

<script setup lang="ts">
import type { TableInstance } from '@arco-design/web-vue'
import { Message, Modal } from '@arco-design/web-vue'
import type SiteAddModal from './SiteAddModal.vue'
import SiteDetailDrawer from './SiteDetailDrawer.vue'
import { type SiteQuery, type SiteResp, deleteSite, listSite } from '@/apis/cms/site'
import type GiTable from '@/components/GiTable/index.vue'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'
import has from '@/utils/has'

defineOptions({ name: 'CmsSite' })

const queryForm = reactive<SiteQuery>({
  name: undefined,
  domain: undefined,
  parentId: undefined,
  createUser: undefined,
  createTime: undefined,
  sort: [],
})

const {
  tableData,
  loading,
  search,
  handleDelete,
} = useTable(() => listSite(queryForm), { immediate: true })

// 过滤树
const searchData = (title: string) => {
  const loop = (data: SiteResp[]) => {
    const result = [] as SiteResp[]
    data.forEach((item: SiteResp) => {
      if (item.title?.toLowerCase().includes(title.toLowerCase())) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData,
          })
        }
      }
    })
    return result
  }
  return loop(tableData.value)
}

const title = ref('')
const dataList = computed(() => {
  if (!title.value) return tableData.value
  return searchData(title.value)
})

const columns: TableInstance['columns'] = [
  { title: '站点名称', dataIndex: 'name', slotName: 'name', fixed: !isMobile() ? 'left' : undefined, ellipsis: true, tooltip: true },
  { title: '域名', dataIndex: 'domain', slotName: 'domain', align: 'center' },
  { title: '站点名称', dataIndex: 'path', slotName: 'path', align: 'center' },
  { title: '状态', dataIndex: 'status', slotName: 'status', align: 'center' },
  { title: '排序', dataIndex: 'sortNum', slotName: 'sortNum', align: 'center', show: false },
  { title: '创建人', dataIndex: 'createUserString', ellipsis: true, tooltip: true, show: false },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改人', dataIndex: 'updateUserString', ellipsis: true, tooltip: true, show: false },
  { title: '修改时间', dataIndex: 'updateTime', width: 180, show: false },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 200,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['cms:site:update', 'cms:site:get', 'cms:site:delete', 'cms:site:create']),
  },
]

// 重置
const reset = () => {
  title.value = ''
}

// 删除
const onDelete = (record: SiteResp) => {
  return handleDelete(() => deleteSite(record.id), {
    content: `是否确定菜单「${record.title}」？`,
    showModal: true,
  })
}

const isExpanded = ref(false)
const tableRef = ref<InstanceType<typeof GiTable>>()
// 展开/折叠
const onExpanded = () => {
  isExpanded.value = !isExpanded.value
  tableRef.value?.tableRef?.expandAll(isExpanded.value)
}

const SiteAddModalRef = ref<InstanceType<typeof SiteAddModal>>()
// 新增
const onAdd = (parentId?: string) => {
  SiteAddModalRef.value?.onAdd(parentId)
}

// 修改
const onUpdate = (record: SiteResp) => {
  SiteAddModalRef.value?.onUpdate(record.id)
}
const SiteDetailDrawerRef = ref<InstanceType<typeof SiteDetailDrawer>>()
// 详情
const onDetail = (record: SiteResp) => {
  SiteDetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss"></style>
