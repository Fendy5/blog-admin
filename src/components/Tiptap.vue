<template>
  <div>
    <div class="editor" v-if="editor">
      <menu-bar class="editor__header" :editor="editor" />
      <div class="editor__content">
        <div class="q-px-lg q-py-sm">
          <q-input label="标题" color="primary" v-model="article.title"/>
        </div>
        <div class="q-px-lg q-py-sm">
          <q-select
              label="类别"
              option-label="name"
              v-model="article.categoryId"
              :options="categories"
          />
        </div>
        <div class="q-px-lg q-py-sm">
          <q-checkbox v-for="i in tags" v-model="article.tags" :key="i.id" :val="i.id" :label="i.name" color="primary" />
        </div>
        <editor-content :editor="editor" />
      </div>
    </div>
    <div class="text-right q-mt-md">
      <q-btn label="Submit" type="submit" color="primary"/>
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { defineComponent, reactive, ref } from 'vue'

import MenuBar from './MenuBar.vue'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { getCategoriesListApi } from 'src/api/category'
import { getTagListApi } from 'src/api/tag'

export interface Category {
  id: number
  name: string
}

export interface Tag {
  id: number
  name: string
}

export default defineComponent({
  components: {
    EditorContent,
    MenuBar
  },

  setup () {
    const categories = ref<Category[]>()
    const tags = ref<Tag[]>()

    const article = reactive({
      title: '',
      tags: [],
      categoryId: ''
    })
    const editor = useEditor({
      content: '<p>从这里开始正文 🎉</p>',
      extensions: [
        StarterKit, Document, Paragraph, Text
      ]
    })
    initPage()

    function initPage () {
      void getCategoriesListApi().then(value => {
        categories.value = value.data
      })
      void getTagListApi().then(value => {
        tags.value = value.data.data
      })
    }

    return { editor, article, categories, tags }
  }
})
</script>

<style lang="scss" scoped>
@import "src/css/quasar.variables";
.editor {
  display: flex;
  flex-direction: column;
  //max-height: 400px;
  height: 85vh;
  color: #0D0D0D;
  background-color: #fff;
  border: 2px solid $primary;
  border-radius: 0.75rem;

  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 2px solid $primary;
  }

  &__content {
    padding: 1.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Some information about the status */
  &__status {
    display: flex;
    align-items: center;
    border-radius: 5px;

    &::before {
      content: ' ';
      flex: 0 0 auto;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #0D0D0D;
      border-radius: 0.4rem;
      padding: 0.25rem 0.5rem;

      &:hover {
        color: #FFF;
        background-color: #0D0D0D;
      }
    }
  }
}
</style>

<style lang="scss">
@import "src/css/quasar.variables";

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* Basic editor styles */
.ProseMirror {
  p{
    margin: 0;
  }
  > * + * {
    //margin-top: 0.75em;
    margin: 0;
  }
  height: 400px;
  padding: 1.25rem 1.5rem;
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
    line-height: 1.1;
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
