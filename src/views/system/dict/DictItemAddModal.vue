<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 700 ? 700 : '100%'"
    draggable
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :columns="columns">
      <template #color>
        <a-select
          v-model="form.color"
          placeholder="请选择颜色"
          allow-clear
        >
          <a-option value="primary"><a-tag color="arcoblue">主要（极致蓝）</a-tag></a-option>
          <a-option value="success"><a-tag color="green">成功（仙野绿）</a-tag></a-option>
          <a-option value="warning"><a-tag color="orangered">警告（活力橙）</a-tag></a-option>
          <a-option value="error"><a-tag color="red">错误（浪漫红）</a-tag></a-option>
          <a-option value="default"><a-tag color="gray">默认（中性灰）</a-tag></a-option>
        </a-select>
      </template>
    </GiForm>
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useWindowSize } from '@vueuse/core'
import { mapTree } from 'xe-utils'
import { type DictItemResp, addDictItem, getDictItem, updateDictItem } from '@/apis/system/dict'
import { type ColumnItem, GiForm } from '@/components/GiForm'
import { useResetReactive } from '@/hooks'

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
})
const emit = defineEmits<{
  (e: 'save-success'): void
}>()
interface Props {
  items: DictItemResp[]
}
const { width } = useWindowSize()

const dataId = ref('')
const dictId = ref('')
const visible = ref(false)
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改字典项' : '新增字典项'))
const formRef = ref<InstanceType<typeof GiForm>>()
const itemSelectTree = computed(() => {
  const data = JSON.parse(JSON.stringify(props.items)) as DictItemResp[]
  return mapTree(data, (i) => ({
    key: i.id,
    title: i.label,
    children: i.children,
  }))
})
const [form, resetForm] = useResetReactive({
  sort: 999,
  color: 'primary',
  parentId: '0',
  status: 1,
})

const columns: ColumnItem[] = reactive([
  {
    label: '上级节点',
    field: 'parentId',
    type: 'tree-select',
    span: 24,
    props: {
      data: itemSelectTree,
      allowClear: true,
      allowSearch: true,
      fallbackOption: false,
      filterTreeNode(searchKey, nodeData) {
        if (nodeData.title) {
          return nodeData.title.toLowerCase().includes(searchKey.toLowerCase())
        }
        return false
      },
    },
    rules: [{ required: true, message: '请选择上级节点' }],
    hide: (form) => {
      return form.parentId === 0
    },
  },
  {
    label: '编码',
    field: 'code',
    type: 'input',
    span: 12,
    required: true,
    props: {
      maxLength: 30,
    },
  },
  {
    label: '标签',
    field: 'label',
    type: 'input',
    span: 12,
    required: true,
    props: {
      maxLength: 30,
    },
  },
  {
    label: '值',
    field: 'value',
    type: 'input',
    span: 24,
    required: true,
    props: {
      maxLength: 30,
    },
  },
  {
    label: '拼音简码',
    field: 'shortCodePinyin',
    type: 'input',
    span: 12,
    required: false,
    props: {
      maxLength: 30,
    },
  },
  {
    label: '五笔简码',
    field: 'shortCodeWb',
    type: 'input',
    span: 12,
    required: false,
    props: {
      maxLength: 30,
    },
  },
  {
    label: '自定义简码',
    field: 'shortCodeCustom',
    type: 'input',
    span: 12,
    required: false,
    props: {
      maxLength: 30,
    },
  },
  {
    label: '颜色',
    field: 'color',
    type: 'input',
    span: 12,
  },
  {
    label: '状态',
    field: 'status',
    type: 'switch',
    span: 12,
    props: {
      type: 'round',
      checkedValue: 1,
      uncheckedValue: 2,
      checkedText: '启用',
      uncheckedText: '禁用',
    },
  },
  {
    label: '排序',
    field: 'sort',
    type: 'input-number',
    span: 12,
    props: {
      min: 1,
      mode: 'button',
    },
  },
  {
    label: '描述',
    field: 'description',
    type: 'textarea',
    span: 24,
  },
])

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateDictItem(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addDictItem({ ...form, dictId: dictId.value })
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

// 新增
const onAdd = (dId: string, id: string) => {
  reset()
  form.parentId = id
  dataId.value = ''
  dictId.value = dId
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const { data } = await getDictItem(id)
  Object.assign(form, data)
  visible.value = true
}

defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
