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
          :rows="tableData.rows"
          :columns="columns"
          row-key="name">
        <template v-slot:body-cell-handle="props">
          <q-td :props="props">
            <q-icon @click="handleEdit(props.row)" class="mr-8" color="positive" name="edit" />
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
import { addTagApi, deleteTagApi, getTagListApi, updateTagApi } from 'src/api/tag'

const columns = [
  {
    name: 'Id',
    label: '#',
    field: 'id'
  },
  {
    name: 'name',
    label: '标签名称',
    field: 'name',
    align: 'left'
  },
  { name: 'created_at', align: 'center', label: '创建时间', field: 'created_at' },
  { name: 'updated_at', align: 'center', label: '更新时间', field: 'updated_at' },
  { name: 'handle', label: '操作', field: 'handle' }
]

// let rows = [
//   {
//     id: 1,
//     index: 1,
//     name: 'Tag Name',
//     created_at: '2021-07-25 11:46:00',
//     updated_at: '2021-07-25 11:46:00'
//   }
// ]

export interface Tag {
  id: number
  index: number
  name: string
  createTime: string
  updateTime: string
}

export default defineComponent({
  setup () {
    const search = reactive({ name: '' })
    const tableData = reactive({ rows: [] })
    const $q = useQuasar()
    getTagList()

    function getTagList () {
      void getTagListApi().then(value => {
        tableData.rows = value.data
        // console.log(rows)
        // console.log(columns)
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
        void addTagApi({ name: data }).then(() => {
          getTagList()
        })
      })
    }

    function handleEdit (tag: Tag) {
      $q.dialog({
        title: '新增标签',
        message: '请输入标签的名称',
        prompt: {
          model: tag.name,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk((data:string) => {
        void updateTagApi({ name: data }, tag.id).then(() => {
          getTagList()
        })
      })
    }

    function handleDelete (id: number) {
      $q.dialog({
        title: '警告',
        message: '是否确认删除该标签？',
        cancel: '取消',
        ok: '确定',
        persistent: true
      }).onOk(() => {
        void deleteTagApi(id).then(() => {
          getTagList()
        })
      })
    }

    return { search, columns, tableData, handleDelete, handleEdit, addTag }
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
