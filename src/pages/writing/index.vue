<template>
  <div class="writing">
    <div class="writing__content">
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 720px;height:80%">
          <q-card-section>
            <div class="text-h6">截取图片</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-form class="q-gutter-md">
              <div style="height:500px">
                <vue-cropper autoCrop :img="originImage" ref="cropper" centerBox fixed :fixedNumber="[2,1]"/>
              </div>
              <div class="text-right">
                <q-btn @click="getScreenshot" label="确定" color="primary"/>
                <q-btn label="取消" type="reset" color="primary" v-close-popup flat class="q-ml-sm"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <!--        <div style="width:100%;height:500px">-->
        <!--          <vue-cropper autoCrop img="https://shnhz.github.io/shn-ui/img/Koala.jpg" ref="cropper" centerBox fixed :fixedNumber="[2,1]"/>-->
        <!--          <q-card-section class="q-pt-none">-->
        <!--            <q-btn label="确定"  @click="prompt=false" color="primary" />-->
        <!--            <q-btn label="取消" type="reset" color="primary" v-close-popup flat class="q-ml-sm" />-->
        <!--          </q-card-section>-->
        <!--        </div>-->
      </q-dialog>
      <!--      <vue-cropper ref="cropper" src="https://image.fendy5.cn/s/LNSrEIFMnPR7kwVt.jpg" />-->
      <q-form @submit="submitArticle" @reset="reset" class="q-gutter-md">
        <q-input :rules="[ val => val && val.length > 0 || '标题不能为空']" label="标题" class="form-item" color="primary"
                 v-model="article.title"/>
        <q-select :rules="[ val => val || '请选择类别']" class="q-px-lg" label="类别" option-label="name" option-value="id"
                  v-model="article.category_id" :options="categories"/>
        <textarea id="editor" autofocus></textarea>
        <div class="cover q-px-lg q-py-md flex justify-between">
          <div class="upload">
            <q-icon @click="uploadImage" v-if="!article.cover" name="upload"/>
            <q-img @click="uploadImage" v-else :src="article.cover"/>
          </div>
          <div class="w-350">
            <q-input :rules="[ val => val && val.length > 0 || '文章描述不可空']" v-model="article.summary"
                     style="width: 350px;height: 90px" clearable type="textarea"
                     autogrow color="primary" label="文章描述"
                     placeholder="请输入文章描述"
            />
            <q-checkbox v-for="i in tags" v-model="article.tags" :key="i.id" :val="i.id" :label="i.name"
                        color="primary"/>
          </div>
        </div>
        <div class="main-btn form-item text-right">
          <q-btn label="发布" type="submit" color="primary"/>
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { getCategoriesListApi } from 'src/api/category'
import { getTagListApi } from 'src/api/tag'
// import  FroalaEditor from 'src/types'
import { addArticleApi, editArticleApi, getArticleApi, uploadImageApi } from 'src/api/article'

export interface Category {
  id: number
  name: string
}

export interface Tag {
  id: number
  name: string
}

export interface Article {
  [key: string]: any
}

export default defineComponent({
  name: 'Writing',
  components: { VueCropper },
  setup () {
    const categories = ref<Category[]>()
    const tags = ref<Tag[]>()
    const uploader = ref()
    const prompt = ref(false), cropper = ref(), originImage = ref()
    const $router = useRouter()
    const articleId = ref<string>('')

    const article = reactive<Article>({
      title: '',
      tags: [],
      summary: '',
      cover: '',
      content: '',
      category_id: ''
    })

    initPage()

    function initPage () {
      void getCategoriesListApi().then(value => {
        categories.value = value.data
      })
      void getTagListApi().then(value => {
        tags.value = value.data.data
      })
      articleId.value = $router.currentRoute.value.query.articleId as string
      if (articleId.value) {
        void getArticleApi(articleId.value).then(value => {
          Object.keys(article).forEach(val => {
            article[val] = value.data[val]
          })
          const content = document.getElementsByClassName('fr-view')[0]
          content.innerHTML = value.data.content
          // const content = document.getElementById('editor') as any
          // content.value = value.data.content
        })
      }
    }

    const options = {
      language: 'zh_cn',
      quickInsertEnabled: false,
      attribution: false,
      imageUploadMethod: 'POST',
      imageMaxSize: 2 * 1024 * 1024,
      imageUploadParam: 'image',
      imageUploadURL: 'https://image.fendy5.cn',
      videoAllowedTypes: ['mp4', 'flv'],
      videoUpload: true,
      videoUploadMethod: 'POST',
      videoUploadParam: 'video',
      videoUploadURL: 'https://image.fendy5.cn',
      videoResponsive: true,
      events: {}
    }

    onMounted(() => {
      // @ts-ignore disable-eslint
      new FroalaEditor('#editor', options)
    })

    function submitArticle () {
      const content = document.getElementById('editor') as any
      article.content = content.value
      if (!articleId.value) {
        void addArticleApi(article).then(() => {
          void $router.push('/article')
        })
      } else {
        void editArticleApi(article, articleId.value).then(() => {
          void $router.push('/article')
        })
      }
    }

    function getScreenshot () {
      cropper.value.getCropBlob((blob: any) => {
        const form = new FormData()
        form.append('image', blob)
        void uploadImageApi(form).then((res: any) => {
          article.cover = res.image_url
          prompt.value = false
        })
      })
    }

    function uploadImage () {
      const input = document.createElement('input')
      input.type = 'file'
      input.click()
      input.onchange = function () {
        const file = input.files
        if (file) {
          const form = new FormData()
          form.append('image', file[0])
          void uploadImageApi(form).then((res: any) => {
            originImage.value = res.image_url
            prompt.value = true
          })
        }
      }
    }

    function reset () {
      article.title = ''
      article.tags = []
      article.summary = ''
      article.cover = ''
      article.content = ''
      article.category_id = ''
      uploader.value.reset()
    }

    return {
      originImage,
      getScreenshot,
      prompt,
      cropper,
      article,
      categories,
      tags,
      uploadImage,
      submitArticle,
      reset,
      uploader
    }
  }
})

</script>

<style lang="scss" scoped>
.writing {
  &__content {
    background: #ffffff;
    width: 768px;
    margin: 60px auto;
    box-shadow: 0 1px 5px 0 rgb(0 0 0 / 5%);

    .cover {
      //margin-bottom: 60px;
      height: 270px;
      overflow: auto;

      .upload {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;

        .q-icon {
          cursor: pointer;
          font-size: 72px;
        }

        .q-img {
          cursor: pointer;
          width: 350px;
          height: 200px;
        }
      }
    }
    .main-btn {
      z-index: 9;
      border-top: 1px solid #d9dadc;
      position: fixed;
      background: #ffffff;
      width: 768px;
      box-shadow: 0 -1px 4px 0 rgb(0 0 0 / 5%);
      bottom: 0;
    }
  }
}

.w-350 {
  width: 350px;
}

.form-item {
  padding: 1rem 1.5rem;
}

:deep .fr-toolbar {
  position: fixed;
  top: 50px !important;
  border: none;
  border-radius: 0;
  width: 768px;
}

:deep .fr-view {
  cursor: text;
}

:deep .fr-box.fr-basic.fr-top .fr-wrapper {
  border-left: none;
  border-right: none;
}

:deep .second-toolbar {
  border: none;
}
</style>

<style lang="scss">
@import "src/css/quasar.variables";

a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
  display: none !important;
}
</style>
