<template>
  <a-row align="stretch" :gutter="rowGutter" class="gi-page-layout" :class="getClass">
    <a-col v-if="slots.left" v-show="!isCollapsed || (!isDesktop && !isCollapsed)" v-bind="props.leftColProps" :xs="isCollapsed ? 1 : 23" :sm="8" :md="7" :lg="6" :xl="5" :xxl="4">
      <div class="gi-page-layout__left" :style="props.leftStyle">
        <slot name="left"></slot>
      </div>
    </a-col>
    <div
      class="gi-page-layout__divider" :class="{
        none: isCollapsed || !isDesktop,
      }"
    >
      <GiSplitButton :collapsed="isCollapsed" @click="toggleCollapsed"></GiSplitButton>
    </div>
    <a-col v-show="isDesktop || (!isDesktop && isCollapsed)" :sm="16" :md="17" :lg="18" :xl="19" :xxl="20" flex="1" v-bind="props.rightColProps">
      <div v-if="slots.header" class="gi-page-layout__header" :style="props.headerStyle">
        <slot name="header"></slot>
      </div>
      <div class="gi-page-layout__body" :style="props.bodyStyle">
        <slot></slot>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang='ts'>
import type { ColProps } from '@arco-design/web-vue'
import type { CSSProperties } from 'vue'
import { useDevice } from '@/hooks'

defineOptions({ name: 'GiPageLayout' })

const props = withDefaults(defineProps<Props>(), {
  margin: true,
  padding: true,
  gutter: false,
  leftColProps: () => ({}),
  rightColProps: () => ({}),
  leftStyle: () => ({}),
  headerStyle: () => ({}),
  bodyStyle: () => ({}),
})

/** 组件插槽定义 */
defineSlots<{
  header: () => void
  left: () => void
  default: () => void
}>()

const { isDesktop } = useDevice()

const getClass = computed(() => {
  return {
    'gi-page-layout--margin': props.margin,
    'gi-page-layout--padding': props.padding,
    'gi-page-layout--gutter': !!props.gutter,
  }
})

const rowGutter = computed(() => {
  if (typeof props.gutter === 'boolean') {
    return props.gutter ? 14 : undefined
  }
  return props.gutter
})

/** 组件属性定义 */
interface Props {
  margin?: boolean
  padding?: boolean
  gutter?: boolean | number
  leftColProps?: ColProps
  rightColProps?: ColProps
  leftStyle?: CSSProperties
  headerStyle?: CSSProperties
  bodyStyle?: CSSProperties
}

const slots = useSlots()
const isCollapsed = ref(false)
const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang='scss' scoped>
.gi-page-layout {
  flex: 1;
  height: 100%;
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  background-color: var(--color-bg-1);
  position: relative;

  &--margin {
    margin: $margin;
  }

  &--padding {

    .gi-page-layout__left,
    .gi-page-layout__header,
    .gi-page-layout__body {
      padding: $padding;
    }

    .gi-page-layout__header {
      padding-bottom: 0;
    }
  }

  &--gutter {
    .gi-page-layout__body-left {
      border-right: none;
    }
  }

  :deep(.arco-col) {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.gi-page-layout__left {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.gi-page-layout__header {
  border-bottom: 1px solid var(--color-border);
  box-sizing: border-box;
}

.gi-page-layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.gi-page-layout__divider {
  position: relative;
  width: 1px;
  background-color: var(--color-border);
}

.gi-page-layout__divider.none {
  width: 0;
}
</style>
