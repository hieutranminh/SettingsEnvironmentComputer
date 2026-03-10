<template>
  <Row>
    <Column :rowspan="2" :header="$t('branch-sales.label-branch')" headerClass="bg-gray" />
    <Column :colspan="4" :header="$t('branch-sales.label-service')" headerClass="bg-yellow border-bottom-0" />
    <Column :colspan="3" :header="$t('branch-sales.label-product')" headerClass="bg-yellow border-bottom-0" />
    <Column :rowspan="2" headerClass="bg-yellow">
      <template #header>
        <p>
          {{ $t('branch-sales.label-revenue-total') }} <br />
          (<span class="text-no-wrap">A + B</span>)
        </p>
      </template>
    </Column>
    <Column
      :colspan="3"
      :header="$t('branch-sales.label-prepaid-goods-sales')"
      headerClass="bg-green border-bottom-0"
    />
    <Column :rowspan="2" headerClass="bg-green">
      <template #header>
        <p>
          {{ $t('branch-sales.label-sales-total') }} <br />
          (<span class="text-blue text-no-wrap">S1 + S2 + S3</span>)
        </p>
      </template>
    </Column>
    <Column :rowspan="2" :header="$t('branch-sales.label-prepaid-goods-deduction-total')" headerClass="bg-gray" />
    <Column :rowspan="2" :header="$t('branch-sales.label-points-deduction')" headerClass="bg-gray" />
  </Row>

  <Row>
    <Column field="serviceSales" headerClass="bg-green">
      <template #header>
        <p class="text-no-wrap">{{ $t('branch-sales.label-sales') }} (<span class="text-blue">S1</span>)</p>
      </template>
    </Column>
    <Column
      :header="$t('branch-sales.label-prepaid-card-deduction')"
      field="servicePrepaidCard"
      headerClass="bg-yellow"
    />
    <Column
      :header="$t('branch-sales.label-prepaid-service-deduction')"
      field="servicePrepaidService"
      headerClass="bg-yellow"
    />
    <Column :header="$t('branch-sales.label-total') + ' (A)'" field="serviceTotal" headerClass="bg-yellow" />
    <Column field="productSales" headerClass="bg-green">
      <template #header>
        <p class="text-no-wrap">{{ $t('branch-sales.label-sales') }} (<span class="text-blue">S2</span>)</p>
      </template>
    </Column>
    <Column
      :header="$t('branch-sales.label-prepaid-card-deduction')"
      field="productPrepaidCard"
      headerClass="bg-yellow"
    />
    <Column :header="$t('branch-sales.label-total') + ' (B)'" field="productTotal" headerClass="bg-yellow" />
    <Column :header="$t('branch-sales.label-prepaid-card')" field="prepaidCard" headerClass="bg-green" />
    <Column :header="$t('branch-sales.label-prepaid-service')" field="prepaidService" headerClass="bg-green" />
    <Column field="prepaidTotal" headerClass="bg-green">
      <template #header>
        <p class="text-no-wrap">{{ $t('branch-sales.label-total') }} (<span class="text-blue">S3</span>)</p>
      </template>
    </Column>
  </Row>
</template>
