<template>
  <div class="preferences-view">
    <h2>Preferences</h2>

    <Card>
      <template #content>
        <div class="preferences-view__controls">
          <div class="preferences-view__control">
            <label class="preferences-view__label">Theme Preset</label>
            <Select
              v-model="preferences.preset"
              :options="presetOptions"
              option-label="label"
              option-value="value"
              placeholder="Select preset"
              class="w-full"
              @change="onThemeChange"
            />
          </div>

          <div class="preferences-view__control">
            <label class="preferences-view__label">Primary Color</label>
            <Select
              v-model="preferences.primaryColor"
              :options="colorOptions"
              option-label="label"
              option-value="value"
              placeholder="Select color"
              class="w-full"
              @change="onColorSelectChange"
            >
              <template #value="slotProps">
                <ColorOption
                  v-if="slotProps.value"
                  :color-hex="getColorHex(slotProps.value)"
                  :label="formatColorLabel(slotProps.value)"
                />
              </template>
              <template #option="slotProps">
                <ColorOption
                  :color-hex="getColorHex(slotProps.option.value)"
                  :label="slotProps.option.label"
                />
              </template>
            </Select>
          </div>

          <div v-if="preferences.primaryColor === 'custom'" class="preferences-view__control">
            <label class="preferences-view__label">Custom Color</label>
            <div class="preferences-view__color-picker">
              <ColorPicker
                v-model="customColorValue"
                format="hex"
                @update:model-value="onCustomColorChange"
              />
              <InputText
                v-model="customHexInput"
                placeholder="#000000"
                class="preferences-view__hex-input"
                @blur="onHexInputBlur"
                @keyup.enter="onHexInputBlur"
              />
            </div>
          </div>

          <div class="preferences-view__control">
            <label class="preferences-view__label">Surface Color</label>
            <Select
              v-model="preferences.surfaceColor"
              :options="surfaceOptions"
              option-label="label"
              option-value="value"
              placeholder="Select surface"
              class="w-full"
              @change="onThemeChange"
            >
              <template #value="slotProps">
                <ColorOption
                  v-if="slotProps.value"
                  :color-hex="getColorHex(slotProps.value)"
                  :label="formatColorLabel(slotProps.value)"
                />
              </template>
              <template #option="slotProps">
                <ColorOption
                  :color-hex="getColorHex(slotProps.option.value)"
                  :label="slotProps.option.label"
                />
              </template>
            </Select>
          </div>

          <div class="preferences-view__control">
            <label class="preferences-view__label">
              Mode ( {{ preferences.darkMode ? 'Dark Mode' : 'Light Mode' }} )
            </label>
            <div class="preferences-view__toggle">
              <ToggleSwitch v-model="preferences.darkMode" @change="onDarkModeChange" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import ColorOption from '@/components/template/partials/ColorOption.vue'
import {
  COLOR_HEX_MAP,
  loadThemePreferences,
  PRIMARY_COLORS,
  saveThemePreferences,
  setDarkMode,
  SURFACE_COLORS,
  THEME_PRESETS,
  type ThemePreferences,
  updateThemePreset,
} from '@/plugins/primevue'
import { isValidHexColor } from '@/utils/colorUtils'

const preferences = reactive<ThemePreferences>(loadThemePreferences())

const customColorValue = ref<string>(preferences.customHexColor?.replace('#', '') ?? '10b981')
const customHexInput = ref<string>(preferences.customHexColor ?? '#10b981')

const presetOptions = Object.keys(THEME_PRESETS).map((key) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1),
  value: key,
}))

const colorOptions = PRIMARY_COLORS.map((color) => ({
  label:
    color === 'custom' ? 'Custom (Pick Color)' : color.charAt(0).toUpperCase() + color.slice(1),
  value: color,
}))

const surfaceOptions = SURFACE_COLORS.map((color) => ({
  label: color.charAt(0).toUpperCase() + color.slice(1),
  value: color,
}))

const getColorHex = (colorName: string): string => {
  if (colorName === 'custom' && preferences.customHexColor) {
    return preferences.customHexColor
  }
  return COLOR_HEX_MAP[colorName] ?? '#888888'
}

const formatColorLabel = (colorName: string): string => {
  if (colorName === 'custom') {
    return 'Custom (Pick Color)'
  }
  return colorName.charAt(0).toUpperCase() + colorName.slice(1)
}

const onThemeChange = (): void => {
  updateThemePreset(
    preferences.preset,
    preferences.primaryColor,
    preferences.customHexColor,
    preferences.surfaceColor,
  )
  saveThemePreferences(preferences)
}

const onColorSelectChange = (): void => {
  if (preferences.primaryColor === 'custom') {
    const hexColor = `#${customColorValue.value}`
    preferences.customHexColor = hexColor
    customHexInput.value = hexColor
  }
  onThemeChange()
}

const onCustomColorChange = (value: string): void => {
  const hexColor = `#${value}`
  customHexInput.value = hexColor
  preferences.customHexColor = hexColor
  onThemeChange()
}

const onHexInputBlur = (): void => {
  let hex = customHexInput.value.trim()
  if (!hex.startsWith('#')) {
    hex = `#${hex}`
  }
  if (isValidHexColor(hex)) {
    customColorValue.value = hex.replace('#', '')
    preferences.customHexColor = hex
    customHexInput.value = hex
    onThemeChange()
  } else {
    customHexInput.value = preferences.customHexColor ?? '#10b981'
  }
}

const onDarkModeChange = (): void => {
  setDarkMode(preferences.darkMode)
  saveThemePreferences(preferences)
}
</script>

<style scoped lang="scss">
.preferences-view {
  h2 {
    margin-bottom: 1.5rem;
    color: var(--p-text-color);
  }

  &__controls {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  &__control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--p-text-color);
  }

  &__color-picker {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__hex-input {
    width: 100px;
    font-family: monospace;
  }

  &__toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
