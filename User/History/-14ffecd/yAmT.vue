<template>
  <div class="row">
    <div class="col-12 col-md-10 ">
      Filter Form
    </div>
    <div class="col-12 col-md-2">
      <aha-button
        variant="blue"
        class="btn-search"
      >
        <span>{{ $t('general.search') }}</span>
      </aha-button>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis-filter.scss';
</style>
