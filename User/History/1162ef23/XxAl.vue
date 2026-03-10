<template>
  <main class="app-content">
    <section class="content not-found-page">
      <div class="not-found-page-wrapper">
        <div class="not-found-page__company-logo">
          <img src="@/assets/images/company-md-logo.png" alt="" class="img-responsive" />
        </div>
        <div class="not-found-page__intro intro">
          <p class="intro__code">{{ $t('general.404') }}</p>
          <p class="intro__short-text">{{ $t('general.page-not-found') }}</p>
        </div>
        <div class="not-found-page__error-image">
          <img src="@/assets/images/error-404.png" alt="" class="img-responsive" />
        </div>
        <div class="not-found-page__description" v-dompurify-html="errorDescription" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Helpers
const { t } = useI18n()

const errorDescription = computed(() => {
  return t('general.page-not-found-description', {
    url: window.location.href,
  })
})
</script>

<style scoped lang="scss">
.not-found-page {
  padding: 20px;

  .not-found-page-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .not-found-page__description {
    :deep(p) {
      font-size: 20px;
    }

    :deep(p:nth-child(2)) {
      color: $gray-500;
    }
  }

  .intro {
    &__code {
      font-weight: 700;
      color: $primary-color;
      font-size: 60px;
    }

    &__short-text {
      font-size: 30px;
    }
  }

  &__error-image {
    margin: 20px 0;

    img {
      max-width: 100%;
    }
  }
}

// medium: .col-md- | 768 - 991px -> ipad
@media (max-width: 991.98px) {
  .not-found-page {
    padding: 15px;
  }
}

// small: .col-sm- | 576 - 767px -> mobile landscape
@media (max-width: 767.98px) {
  .not-found-page {
    padding: 7.5px;

    &__company-logo {
      img {
        max-width: 85%;
      }
    }
  }
}

@media (max-width: 575.98px) {
  .not-found-page {
    &__company-logo {
      img {
        max-width: 75%;
      }
    }
  }
}
</style>
