<template>
  <q-card class="menu position-center">
    <div class="q-pa-md q-gutter-sm">
      <div>
        <div class="q-gutter-sm">
          <q-btn color="primary"  @click="unselectNode" label="新增" />
          <q-btn v-if="selected" color="red"  @click="unselectNode" label="删除" />
        </div>
      </div>
      <q-tree
          :nodes="props"
          default-expand-all
          v-model:selected="selected"
          node-key="label"
      />
    </div>
  </q-card>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const selected = ref(null)

    return {
      selected,

      selectGoodService () {
        if (selected.value !== 'Good service') {
          selected.value = 'Good service'
        }
      },

      unselectNode () {
        selected.value = null
      },

      props: [
        {
          label: 'Satisfied customers',
          children: [
            {
              label: 'Good food',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service',
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;
  max-width: 450px;
}
</style>
