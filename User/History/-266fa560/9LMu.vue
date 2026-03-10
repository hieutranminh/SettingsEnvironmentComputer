<template>
  <div class="client-search-wrapper">
    <div
      ref="clientFormRef"
      class="client-search-content client-search-content--show"
    >
      <slot name="clients-form" />
    </div>
    <div
      ref="clientResultRef"
      class=" client-search-content client-search-content--hidden"
    >
      <slot name="clients-result" />
    </div>

    <b-form-radio-group
      v-model="formData.toneStyle"
      :options="styleOptions"
      name="message-style"
    />
  </div>
</template>

<script>
export default {
  props: {
    isSearched: {
      type:    Boolean,
      default: false,
    },
  },

  watch: {
    isSearched: {
      handler() {
        this.handleChangeContentClientSeachByTarget()
      },
    },
  },

  methods: {

    handleChangeContentClientSeachByTarget() {
      const clientFormRef = this.$refs.clientFormRef
      const clientResultRef = this.$refs.clientResultRef
      if (this.isSearched) {
        clientFormRef.classList.add('client-search-content--hiding')
        clientFormRef.classList.remove('client-search-content--show')

        const clientResultTimer = setTimeout(() => {
          clientResultRef.classList.add('client-search-content--showing')
          clientResultRef.classList.remove('client-search-content--hidden')
          clearTimeout(clientResultTimer)
        }, 100)

        const clientFormTimer = setTimeout(() => {
          clientFormRef.classList.remove('client-search-content--hiding')
          clientFormRef.classList.add('client-search-content--hidden')

          clientResultRef.classList.remove('client-search-content--showing')
          clientResultRef.classList.add('client-search-content--show')
          clearTimeout(clientFormTimer)
        }, 200)
      }

      if (!this.isSearched) {
        clientResultRef.classList.add('client-search-content--hiding')
        clientResultRef.classList.remove('client-search-content--show')

        const clientFormRefTimer = setTimeout(() => {
          clientFormRef.classList.add('client-search-content--showing')
          clientFormRef.classList.remove('client-search-content--hidden')
          clearTimeout(clientFormRefTimer)
        }, 100)

        const clientResultRefTimer = setTimeout(() => {
          clientResultRef.classList.remove('client-search-content--hiding')
          clientResultRef.classList.add('client-search-content--hidden')

          clientFormRef.classList.remove('client-search-content--showing')
          clientFormRef.classList.add('client-search-content--show')
          clearTimeout(clientResultRefTimer)
        }, 200)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
    @import './client-search-by-target-wrapper.scss';
</style>
