<template>
  <div class="row">
    <div v-for="i in articles" :key="i.article_id" class="p-16 col-lg-3 col-md-4 col-sm-6 col-xs-12">
      <div class="article-card" flat bordered>
        <q-img class="cover" :src="i.cover"/>

        <q-card-section>
          <div class="text-grey">{{ i.updated_at }}</div>
          <div class="text-h5 q-mt-sm q-mb-xs ellipsis">
            <span @click="viewArticle(i.article_id)" class="cursor-pointer">
              {{ i.title }}
            </span>
          </div>
          <div class="text-caption text-grey ellipsis-2-lines">
            {{ i.summary }}
          </div>
        </q-card-section>

        <div class="flex justify-between">
          <div>
            <q-btn @click="editArticle(i.article_id)" flat color="primary" label="编辑"/>
            <q-btn @click="deleteArticle(i.article_id)" flat color="negative" label="删除"/>
          </div>
          <p class="view">阅读量：{{ i.view }}</p>
        </div>
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
  view: number
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
    const editArticle = (articleId: string) => {
      void $router.push({
        path: '/writing',
        query: { articleId }
      })
    }
    const viewArticle = (id: string) => {
      window.location.href = `https://blog.fendy5.cn/s/${id}`
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
.text-caption {
  height: 2.75rem;
}
.cover {
  height: 175px;
}
.view {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  margin-right: 20px;
}
</style>
