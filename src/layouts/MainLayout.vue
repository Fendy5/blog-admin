<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Fendy's Blog Admin
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list bordered padding class="rounded-borders text-primary">
        <q-item-label
          header
          class="text-grey-8"
        >
          Fendy博客的后台管理
        </q-item-label>
        <RouterLink :to="i.link" v-for="i in essentialLinks" :key="i.icon">
          <q-item :active="i.link === $route.path">
            <q-item-section avatar>
              <q-icon :name="i.icon" />
            </q-item-section>
            <q-item-section>{{ i.title }}</q-item-section>
          </q-item>
        </RouterLink>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-slide-transition>
        <div class="app-content">
          <router-view />
        </div>
      </q-slide-transition>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

const linksList = [
  {
    title: '首页',
    icon: 'home',
    link: '/'
  },
  {
    title: '文章管理',
    icon: 'article',
    link: '/article'
  },
  {
    title: '标签管理',
    icon: 'tag',
    link: '/tag'
  },
  {
    title: '菜单管理',
    icon: 'menu',
    link: '/menu'
  }
]

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: black;
}
.app-content {
  position: relative;
  height: calc(100vh - 50px);
}
</style>
