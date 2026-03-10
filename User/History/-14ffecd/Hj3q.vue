<template>
  <div class="report-filter">
    <div class="row">
      <div class="col-12 col-md-10">
        <div class="report-filter__form">
          Filter Form Operational Trend Analysis
        </div>
      </div>
      <div class="col-12 col-md-2">
        <div class="report-filter__actions">
          <aha-button
            variant="blue"
            class="report-filter__btn-search"
          >
            <i class="btn-search-white" />
            <span>{{ $t('general.search') }}</span>
          </aha-button>
        </div>
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
