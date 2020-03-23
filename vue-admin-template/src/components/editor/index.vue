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
      type: Object,
      default() {
        return {}
      }
    },
    keyWord: {
      type: String,
      default: ''
    },
    refresh: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 存储编辑器的内容
      content: ''
    }
  },
  watch: {
    'refresh'() {
      this.content = ''
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
