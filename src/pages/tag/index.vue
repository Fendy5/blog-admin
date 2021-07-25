<template>
  <div>
    <section class="f-card q-pa-lg row justify-between">
      <div class="w-300">
        <q-input dense clearable outlined color="text-primary" v-model="search.name" label="标签名" />
      </div>
      <div>
        <q-btn color="primary" class="mr-8" label="搜索" />
        <q-btn flat text-color="black" label="重置" />
      </div>
    </section>
    <section class="row q-py-lg justify-between">
      <div class="text-h5">标签列表</div>
      <q-btn color="primary" @click="addTag" class="mr-8" label="新增标签" />
    </section>
    <div class="">
      <q-table
          :rows="rows"
          :columns="columns"
          row-key="name">
        <template v-slot:body-cell-handle="props">
          <q-td :props="props">
            <q-icon @click="handleEdit(props.row.id)" class="mr-8" color="positive" name="edit" />
            <q-icon @click="handleDelete(props.row.id)" color="red" name="delete" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { addTagApi, getTagListApi } from 'src/api/tag'

const columns = [
  {
    name: 'index',
    label: '#',
    field: 'index'
  },
  {
    name: 'name',
    label: '标签名称',
    field: 'name',
    align: 'left'
  },
  { name: 'createTime', align: 'center', label: '创建时间', field: 'createTime' },
  { name: 'updateTime', align: 'center', label: '更新时间', field: 'updateTime' },
  { name: 'handle', label: '操作', field: 'handle' }
]

const rows = [
  {
    index: 1,
    id: 3,
    name: 'Frozen Yogurt',
    createTime: '2021-08-01 21:12:32',
    updateTime: '-- --'
  }
]

rows.forEach((row, index) => {
  row.index = index + 1
})

export default defineComponent({
  setup () {
    const search = reactive({ name: '' })
    const $q = useQuasar()
    getTagList()

    function getTagList () {
      void getTagListApi().then(value => {
        console.log(value)
      })
    }

    function addTag () {
      $q.dialog({
        title: '新增标签',
        message: '请输入标签的名称',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk((data:string) => {
        void addTagApi({ name: data }).then(value => {
          console.log(value)
        })
      })
    }

    function handleEdit (id: number) {
      // todo
      console.log(id)
    }
    function handleDelete (id: number) {
      // todo
    }
    return { search, columns, rows, handleDelete, handleEdit, addTag }
  }
})

</script>

<style lang="scss" scoped>
.q-table__card {
  box-shadow: unset;
}
.q-icon {
  cursor: pointer;
}
</style>
