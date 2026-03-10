<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-group">
            <!-- Category -->
            <div class="filter-form-item">
              <label for="category">{{ $t('service-sales-by-sales-type.label-category') }}</label>
              <Select
                v-model="categoryModel"
                :options="serviceCategoryOptions"
                :loading="isServiceCategoryLoading"
                :ariaLabel="$t('service-sales-by-sales-type.label-category')"
                labelId="category"
                optionLabel="name"
                optionValue="id"
                @value-change="handleCategoryChange"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="filter-action">
          <Button :label="$t('general.button-search')" @click="handleSearchClick" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
