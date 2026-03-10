<template>
  <div class="pdf-font-demo">
    <h2>PDF Font Demo</h2>
    
    <div class="font-info">
      <h3>Available Fonts</h3>
      <div v-if="isLoading" class="loading">Loading fonts...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="font-list">
        <div v-for="font in availableFonts" :key="`${font.name}-${font.style}`" class="font-item">
          <span class="font-name">{{ font.name }}</span>
          <span class="font-style">{{ font.style }}</span>
          <span class="font-weight">{{ font.weight }}</span>
          <span class="font-available" :class="{ available: font.isAvailable }">
            {{ font.isAvailable ? 'Available' : 'Not Available' }}
          </span>
        </div>
      </div>
    </div>

    <div class="font-test">
      <h3>Font Test</h3>
      <div class="test-buttons">
        <button @click="testFont('NanumGothic', 'normal')" class="test-btn">
          Test NanumGothic Normal
        </button>
        <button @click="testFont('NanumGothic', 'bold')" class="test-btn">
          Test NanumGothic Bold
        </button>
        <button @click="testFont('helvetica', 'normal')" class="test-btn">
          Test Helvetica Normal
        </button>
        <button @click="testFont('helvetica', 'bold')" class="test-btn">
          Test Helvetica Bold
        </button>
      </div>
    </div>

    <div class="recommended-fonts">
      <h3>Recommended Fonts</h3>
      <div class="font-recommendations">
        <div class="recommendation">
          <strong>Headers:</strong> {{ recommendedFonts.headers.name }} ({{ recommendedFonts.headers.style }})
        </div>
        <div class="recommendation">
          <strong>Body:</strong> {{ recommendedFonts.body.name }} ({{ recommendedFonts.body.style }})
        </div>
        <div class="recommendation">
          <strong>Fallback:</strong> {{ recommendedFonts.fallback.name }} ({{ recommendedFonts.fallback.style }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { usePdfFonts } from '@/composables/usePdfFonts'

const {
  availableFonts,
  isLoading,
  error,
  loadFonts,
  isFontAvailable,
  getRecommendedFonts,
} = usePdfFonts()

const recommendedFonts = getRecommendedFonts()

const testFont = (fontName: string, style: 'normal' | 'bold') => {
  const available = isFontAvailable(fontName, style)
  console.log(`Font ${fontName} (${style}) is ${available ? 'available' : 'not available'}`)
  
  if (available) {
    alert(`Font ${fontName} (${style}) is available and ready to use in PDF generation!`)
  } else {
    alert(`Font ${fontName} (${style}) is not available. Will use fallback font.`)
  }
}

onMounted(() => {
  loadFonts()
})
</script>

<style scoped lang="scss">
.pdf-font-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    color: #333;
    margin-bottom: 20px;
  }

  h3 {
    color: #555;
    margin-bottom: 15px;
    border-bottom: 2px solid #eee;
    padding-bottom: 5px;
  }

  .font-info {
    margin-bottom: 30px;
  }

  .loading {
    color: #666;
    font-style: italic;
  }

  .error {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 10px;
    border-radius: 4px;
  }

  .font-list {
    display: grid;
    gap: 10px;
  }

  .font-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 15px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    align-items: center;

    .font-name {
      font-weight: bold;
      color: #333;
    }

    .font-style {
      color: #666;
      text-transform: capitalize;
    }

    .font-weight {
      color: #666;
      text-transform: capitalize;
    }

    .font-available {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      text-align: center;

      &.available {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      &:not(.available) {
        background-color: #ffebee;
        color: #d32f2f;
      }
    }
  }

  .font-test {
    margin-bottom: 30px;
  }

  .test-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }

  .test-btn {
    padding: 10px 15px;
    background-color: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #1565c0;
    }

    &:active {
      background-color: #0d47a1;
    }
  }

  .recommended-fonts {
    .font-recommendations {
      display: grid;
      gap: 10px;
    }

    .recommendation {
      padding: 10px;
      background-color: #e3f2fd;
      border-radius: 4px;
      border-left: 4px solid #2196f3;

      strong {
        color: #1976d2;
      }
    }
  }
}
</style> 