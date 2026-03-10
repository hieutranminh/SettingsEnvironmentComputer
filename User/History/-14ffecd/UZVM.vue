<template>
  <div class="row filter">
    <div class="col-12 col-md-10">
      <div class="filter-form">
        Filter Form
      </div>
    </div>
    <div class="col-12 col-md-2">
      <div class="filter-actions">
        <aha-button
          variant="blue"
          class="btn-search"
        >
          <span>{{ $t('general.search') }}</span>
        </aha-button>
      </div>
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
