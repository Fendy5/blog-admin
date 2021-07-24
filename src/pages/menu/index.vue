<template>
  <q-card class="menu position-center">
    <div class="q-pa-md q-gutter-sm">
      <div>
        <div class="q-gutter-sm">
          <q-btn color="primary" flat  @click="addMenu" label="新增" />
          <q-btn v-show="selected" color="secondary" flat  @click="editMenu" label="编辑" />
          <q-btn v-show="selected" flat color="red"  @click="deleteMenu" label="删除" />
        </div>
      </div>
      <q-tree
          ref="tree"
          :nodes="menuList"
          default-expand-all
          v-model:selected="selected"
          label-key="name"
          node-key="id"
      />
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-input v-model="formData.name" label="菜单名称"  :rules="[ val => val && val.length > 0 || '菜单名称不可空']"/>
            <q-input v-model="formData.path" label="菜单路径"  :rules="[val => val !== null && val !== '' || '菜单路径不可空']"/>
            <div>
              <q-btn label="确定"  @click="submitMenuForm" color="primary" />
              <q-btn label="取消" type="reset" color="primary" v-close-popup flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { reactive, ref, toRefs, onBeforeMount } from 'vue'
import { addMenuApi, deleteMenuApi, editMenuApi, getMenuListApi } from 'src/api/menu'

export interface MenuForm {
  parentId: number | null,
  name: string,
  path: string
}

export default {
  setup () {
    const selected = ref(0)
    const tree = ref()
    const prompt = ref(false)
    const title = ref('新增菜单')

    const formData = reactive<MenuForm>({
      parentId: null,
      name: '',
      path: ''
    })

    const state = reactive({
      id: 0,
      menuList: [
        {
          name: '菜单管理',
          children: []
        }
      ]
    })

    function editMenu () {
      const menu = tree.value.getNodeByKey(selected.value)
      formData.name = menu.name
      title.value = '编辑菜单'
      formData.path = menu.path
      state.id = selected.value
      prompt.value = true
    }

    function deleteMenu () {
      void deleteMenuApi(selected.value).then(() => {
        getMenuList()
        selected.value = 0
      })
    }

    function addMenu () {
      formData.name = ''
      formData.path = ''
      formData.parentId = selected.value
      title.value = '新增菜单'
      prompt.value = true
    }

    function submitMenuForm () {
      if (state.id) {
        void editMenuApi(formData, state.id).then(() => {
          prompt.value = false
          state.id = 0
          getMenuList()
        })
      } else {
        void addMenuApi(formData).then(() => {
          prompt.value = false
          getMenuList()
        })
      }
    }

    onBeforeMount(() => {
      getMenuList()
    })

    function getMenuList () {
      void getMenuListApi().then(value => {
        state.menuList[0].children = value.data.menu
      })
    }

    return {
      title,
      formData,
      prompt,
      tree,
      selected,
      deleteMenu,
      submitMenuForm,
      addMenu,
      editMenu,
      ...toRefs(state)
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
