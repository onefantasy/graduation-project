<template>
  <div>
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      @focus="onEditorFocus($event)"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
    />
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    quillEditor
  },
  props: {
    obj: {
      // 父组件传进来的对象，用绑定改变的数据
      type: Object,
      default() {
        return {}
      }
    },
    keyWord: {
      // 父组件传进来需要绑定的对象上的某个键
      type: String,
      default: ''
    },
    refresh: {
      type: Boolean,
      default: true
    },
    defalutContent: {
      // 默认值，传入空字符串用于重置当前编辑器的内容
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 存储编辑器的内容
      content: ''
    }
  },
  watch: {
    'defalutContent'() {
      console.log(this.keyWord, this.defalutContent)
      // 监听传入默认值的变化，更改当前编辑器的内容
      this.content = this.defalutContent
    }
  },
  created() {
  },
  methods: {
    // 获取焦点事件
    onEditorFocus(e) {
      this.$emit('onEditorFocus', e)
    },
    // 失去焦点事件
    onEditorBlur(e) {
      this.$emit('onEditorBlur', e)
    },
    // 输入值改变事件
    onEditorChange(e) {
      this.obj[this.keyWord] = e.html
      this.$emit('onEditorChange', e)
    }
  }
}

</script>

<style>

</style>
