<template>
  <div>
    <tiptap />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tiptap from 'components/Tiptap.vue'

export default defineComponent({
  name: 'Writing',
  components: {
    Tiptap
  }
})

</script>

<style lang="scss" scoped>

</style>
