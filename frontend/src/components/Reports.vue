<template>
  <div class="container">
    <h1>{{ $t('headlines.reports') }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Reports',
  components: {},
  props: [],
  data() {
    return {}
  },
  methods: {},
  async beforeMount() {
    await this.$root.load()
  },
}
</script>

<style>
</style>