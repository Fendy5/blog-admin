<template>
  <div class="writing">
    <div class="writing__content">
      <div v-if="editor">
        <menu-bar :editor="editor"/>
      </div>
      <q-form @submit="submitArticle" @reset="reset" class="q-gutter-md">
        <q-input :rules="[ val => val && val.length > 0 || '标题不能为空']" label="标题" class="form-item" color="primary"
                 v-model="article.title"/>
        <q-select :rules="[ val => val || '请选择类别']" class="q-px-lg" label="类别" option-label="name" option-value="id"
                  v-model="article.category_id" :options="categories"/>
        <editor-content v-highlight :editor="editor"/>
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
          <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm"/>
        </div>
      </q-form>
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
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { getCategoriesListApi } from 'src/api/category'
import { getTagListApi } from 'src/api/tag'
import { addArticleApi, editArticleApi, getArticleApi, uploadImageApi } from 'src/api/article'
import highlight from 'src/directive/highlight'

import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from 'src/components/MenuBar.vue'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'

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
  directives: { highlight },
  components: {
    VueCropper,
    EditorContent,
    MenuBar
  },
  setup () {
    const categories = ref<Category[]>()
    const tags = ref<Tag[]>()
    const uploader = ref()
    const prompt = ref(false), cropper = ref(), originImage = ref()
    const $router = useRouter()
    const articleId = ref<string>('')

    const editor = useEditor({
      // content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit, Image, Placeholder.configure({ placeholder: '正文从这里开始~' }), TextAlign.configure({ types: ['heading', 'paragraph'] })
      ]
    })

    const article = reactive<Article>({
      title: '',
      tags: [],
      summary: '',
      cover: '',
      content: '',
      category_id: ''
    })
    // const editor = useEditor({
    //   content: '<p>正文从这里开始~</p>',
    //   extensions: [
    //     StarterKit, CodeBlockLowlight.configure({ lowlight }), Image, Placeholder.configure({ placeholder: '正文从这里开始~' }), TextAlign.configure({
    //       types: ['heading', 'paragraph']
    //     })
    //   ]
    // })

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
          const content = document.getElementsByClassName('ProseMirror')[0]
          content.innerHTML = value.data.content
        })
      }
    }

    function submitArticle () {
      if (editor.value) {
        article.content = editor.value.getHTML()
      }
      console.log(article.content)
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
      editor,
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
/* Basic editor styles */
.ProseMirror {
  //height: 400px;
  min-height: 350px;
  border-bottom: 1px solid #eeeeee;
  padding: 1.25rem 1.5rem;

  > * + * {
    //margin-top: 0.75em;
    margin: 0;
  }

  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #ced4da;
    pointer-events: none;
    height: 0;
  }

  p {
    margin: 0;
  }

  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68CEF8;
    }
  }

  &:focus {
    outline: none;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.5;
    margin-bottom: .25rem;
  }

  h1 {
    @apply my-4 text-3xl;
    counter-reset: h2;
  }

  h2 {
    margin-top: .75rem;
    font-size: 1.5rem;
    counter-reset: h3;
  }

  h3 {
    margin-top: .5rem;
    font-size: 1.25rem;
    counter-reset: h4;
  }

  h4 {
    margin-top: .25rem;
    font-size: 1rem;
    counter-reset: h5;
  }

  counter-reset: h2;

  h2 {
    &:before {
      counter-increment: h2;
      content: counter(h2) "."
    }
  }

  h3 {
    &:before {
      counter-increment: h3;
      content: counter(h2) "." counter(h3) " "
    }
  }

  h4 {
    &:before {
      counter-increment: h4;
      content: counter(h2) "." counter(h3) "." counter(h4) " "
    }
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
      }
    }
  }

  .ProseMirror-focused {
    border: none !important;
  }
}
</style>
