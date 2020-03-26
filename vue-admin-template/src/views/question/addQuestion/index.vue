<template>
  <div class="addQuestion-box">
    <question-editor />
  </div>
</template>

<script>
import questionEditor from '@/components/questionEditor'
export default {
  name: 'AddQuestion',
  components: {
    questionEditor
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
