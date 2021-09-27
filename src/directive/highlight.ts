import hljs from 'highlight.js'
import 'highlight.js/styles/night-owl.css' // 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
import { Directive } from 'vue'

const hightlight: Directive = {
  mounted (el) {
    const blocks = el.querySelectorAll('pre code')
    for (let i = 0; i < blocks.length; i++) {
      hljs.highlightBlock(blocks[i])
    }
  },
  updated (el) {
    const blocks = el.querySelectorAll('pre code')
    for (let i = 0; i < blocks.length; i++) {
      hljs.highlightBlock(blocks[i])
    }
  }
}

export default hightlight
