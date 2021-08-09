<template>
  <div class="row">
    <div v-for="i in articles" :key="i.article_id" class="p-16 col-lg-3 col-md-4 col-sm-6 col-xs-12">
      <div class="article-card" flat bordered>
        <q-img class="cover" :src="i.cover"/>

        <q-card-section>
          <div class="text-grey">{{ i.updated_at }}</div>
          <div class="text-h5 q-mt-sm q-mb-xs">
            <span @click="viewArticle(i.article_id)" class="cursor-pointer">
              {{ i.title }}
            </span>
          </div>
          <div class="text-caption text-grey">
            {{ i.summary }}
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn @click="deleteArticle(i.article_id)" flat color="dark" label="删除"/>
          <q-btn @click="editArticle(i.article_id)" flat color="primary" label="编辑"/>

          <q-space/>
        </q-card-actions>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { deleteArticleApi, getArticleListApi } from 'src/api/article'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export interface Article {
  article_id: string
  cover: string
  summary: string
  title: string
  updated_at: string
}

export default defineComponent({
  setup () {
    const articles = ref<Article[]>([])
    const $q = useQuasar()
    const $router = useRouter()

    const getList = () => {
      void getArticleListApi().then(value => {
        articles.value = value.data.data
      })
    }
    getList()
    const deleteArticle = (id: string) => {
      $q.dialog({
        title: '警告',
        message: '是否确认删除？',
        cancel: '取消',
        ok: '确定',
        persistent: true
      }).onOk(() => {
        void deleteArticleApi(id).then(() => {
          getList()
        })
      })
    }
    const editArticle = (id: string) => {
      void $router.push({
        path: '/writing',
        query: { id }
      })
    }
    const viewArticle = (id: string) => {
      window.location.href = `https://www.fendy5.cn/s/${id}`
    }
    return {
      articles,
      deleteArticle,
      editArticle,
      viewArticle
    }
  }
})
</script>

<style lang="scss" scoped>
.article-card {
  height: 100%;
  background: #ffffff;
}

.cover {
  height: 175px;
}
</style>
