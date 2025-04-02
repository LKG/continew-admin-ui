<template>
  <a-drawer
          v-model:visible="visible"
          :title="title"
          :mask-closable="false"
          :esc-to-close="false"
          :width="width >= 500 ? 500 : '100%'"
          @before-ok="save"
          @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :columns="columns" />
  </a-drawer>
</template>

<script setup lang="ts">
  import { Message, type TreeNodeData } from '@arco-design/web-vue'
  import { useWindowSize } from '@vueuse/core'

  import { getSite, addSite, updateSite } from '@/apis/generator/site'
  import { type ColumnItem, GiForm } from '@/components/GiForm'
  import { useResetReactive } from '@/hooks'
  import { useDict } from '@/hooks/app'

  const emit = defineEmits<{
  (e: 'save-success'): void
  }>()

  const { width } = useWindowSize()

  const dataId = ref('')
  const visible = ref(false)
  const isUpdate = computed(() => !!dataId.value)
  const title = computed(() => (isUpdate.value ? '修改站点表' : '新增站点表'))
  const formRef = ref<InstanceType<typeof GiForm>>()

  const [form, resetForm] = useResetReactive({
    // todo 待补充
  })
  const columns: ColumnItem[] = reactive([
    {
      label: '站点名称',
      field: 'name',
      type: 'input',
      span: 24,
      required: true,
    },
    {
      label: '域名',
      field: 'domain',
      type: 'input',
      span: 24,
    },
    {
      label: 'logo',
      field: 'logo',
      type: 'input',
      span: 24,
    },
    {
      label: '上级站点id',
      field: 'parentId',
      type: 'tree-select',
      span: 24,
      required: true,
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
        await updateSite(form, dataId.value)
        Message.success('修改成功')
      } else {
        await addSite(form)
        Message.success('新增成功')
      }
      emit('save-success')
      return true
    } catch (error) {
      return false
    }
  }

  // 新增
  const onAdd = async () => {
    reset()
    if (!deptList.value.length) {
      await getDeptList()
    }
    if (!roleList.value.length) {
      await getRoleList()
    }
    dataId.value = ''
    visible.value = true
  }

  // 修改
  const onUpdate = async (id: string) => {
    reset()
    dataId.value = id
    const { data } = await getSite(id)
    Object.assign(form, data)
    visible.value = true
  }

  defineExpose({ onAdd, onUpdate })
</script>

<style scoped lang="scss"></style>
