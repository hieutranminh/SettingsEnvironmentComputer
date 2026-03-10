<template>xxxxxxxxxxxxxxxxx</template>

<style lang="scss" scoped>
.section-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(ipadLandscape) {
    flex-direction: column;
  }

  .section-left {
    width: 50%;

    @include maxResponsive(ipadLandscape) {
      width: 100%;
    }
  }

  .section-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include maxResponsive(ipadLandscape) {
      width: 100%;
    }
  }
}
</style>
