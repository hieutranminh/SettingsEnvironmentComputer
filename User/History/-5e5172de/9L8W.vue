<template>
  <main class="my-index --p-surface-50">
    <InputText type="text" style="margin-right: 1rem" />
    <Button label="Submit" />
    <hr />
    Customize Css Module
    <CustomizeComponent01 />
    <hr />
    Customize specific PrimeVue component <br />
    (https://primevue-image-theme.vercel.app/)
    <InputText class="abcxyz" type="text" :dt="myCustomizeInput" />
    <hr />
    <Button @click="greenPrimary" label="Green" severity="success" />
    <Button @click="orangePrimary" label="Orange" severity="warn" class="mt-20" />
    <hr />
    <div class="card">
      <MegaMenu :model="items" />
    </div>
    <div class="flex flex-col gap-12">
      <div class="flex gap-6 flex-wrap">
        <div
          class="rounded-border p-4 border border-transparent flex items-center justify-center bg-primary hover:bg-primary-emphasis text-primary-contrast font-medium flex-auto transition-colors"
        >
          primary
        </div>
        <div
          class="rounded-border p-4 border border-transparent flex items-center justify-center bg-highlight hover:bg-highlight-emphasis font-medium flex-auto transition-colors"
        >
          highlight
        </div>
        <div
          class="rounded-border p-4 border border-surface flex items-center justify-center text-muted-color hover:text-color hover:bg-emphasis font-medium flex-auto transition-colors"
        >
          box
        </div>
      </div>
    </div>
    <hr />
    <table>
      asde
    </table>
  </main>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import MegaMenu from 'primevue/megamenu'
import CustomizeComponent01 from '@/components/CustomizeComponent01.vue'
import { ref } from 'vue'
import { updatePrimaryPalette } from '@primeuix/themes'

const myCustomizeInput = ref({
  padding: {
    x: '30px',
    y: '30px',
  },
  background: '{primary.100}',
  color: 'red',
})
const items = ref([
  {
    label: 'Furniture',
    icon: 'pi pi-box',
    items: [
      [
        {
          label: 'Living Room',
          items: [
            { label: 'Accessories' },
            { label: 'Armchair' },
            { label: 'Coffee Table' },
            { label: 'Couch' },
            { label: 'TV Stand' },
          ],
        },
      ],
      [
        {
          label: 'Kitchen',
          items: [{ label: 'Bar stool' }, { label: 'Chair' }, { label: 'Table' }],
        },
        {
          label: 'Bathroom',
          items: [{ label: 'Accessories' }],
        },
      ],
      [
        {
          label: 'Bedroom',
          items: [
            { label: 'Bed' },
            { label: 'Chaise lounge' },
            { label: 'Cupboard' },
            { label: 'Dresser' },
            { label: 'Wardrobe' },
          ],
        },
      ],
      [
        {
          label: 'Office',
          items: [
            { label: 'Bookcase' },
            { label: 'Cabinet' },
            { label: 'Chair' },
            { label: 'Desk' },
            { label: 'Executive Chair' },
          ],
        },
      ],
    ],
  },
  {
    label: 'Electronics',
    icon: 'pi pi-mobile',
    items: [
      [
        {
          label: 'Computer',
          items: [
            { label: 'Monitor' },
            { label: 'Mouse' },
            { label: 'Notebook' },
            { label: 'Keyboard' },
            { label: 'Printer' },
            { label: 'Storage' },
          ],
        },
      ],
      [
        {
          label: 'Home Theater',
          items: [{ label: 'Projector' }, { label: 'Speakers' }, { label: 'TVs' }],
        },
      ],
      [
        {
          label: 'Gaming',
          items: [
            { label: 'Accessories' },
            { label: 'Console' },
            { label: 'PC' },
            { label: 'Video Games' },
          ],
        },
      ],
      [
        {
          label: 'Appliances',
          items: [
            { label: 'Coffee Machine' },
            { label: 'Fridge' },
            { label: 'Oven' },
            { label: 'Vaccum Cleaner' },
            { label: 'Washing Machine' },
          ],
        },
      ],
    ],
  },
  {
    label: 'Sports',
    icon: 'pi pi-clock',
    items: [
      [
        {
          label: 'Football',
          items: [
            { label: 'Kits' },
            { label: 'Shoes' },
            { label: 'Shorts' },
            { label: 'Training' },
          ],
        },
      ],
      [
        {
          label: 'Running',
          items: [
            { label: 'Accessories' },
            { label: 'Shoes' },
            { label: 'T-Shirts' },
            { label: 'Shorts' },
          ],
        },
      ],
      [
        {
          label: 'Swimming',
          items: [
            { label: 'Kickboard' },
            { label: 'Nose Clip' },
            { label: 'Swimsuits' },
            { label: 'Paddles' },
          ],
        },
      ],
      [
        {
          label: 'Tennis',
          items: [
            { label: 'Balls' },
            { label: 'Rackets' },
            { label: 'Shoes' },
            { label: 'Training' },
          ],
        },
      ],
    ],
  },
])
const greenPrimary = () => {
  updatePrimaryPalette({
    50: '{green.50}',
    100: '{green.100}',
    200: '{green.200}',
    300: '{green.300}',
    400: '{green.400}',
    500: '{green.500}',
    600: '{green.600}',
    700: '{green.700}',
    800: '{green.800}',
    900: '{green.900}',
    950: '{green.950}',
  })
}
const orangePrimary = () => {
  updatePrimaryPalette({
    50: '{orange.50}',
    100: '{orange.100}',
    200: '{orange.200}',
    300: '{orange.300}',
    400: '{orange.400}',
    500: '{orange.500}',
    600: '{orange.600}',
    700: '{orange.700}',
    800: '{orange.800}',
    900: '{orange.900}',
    950: '{orange.950}',
  })
}
</script>

<style scoped lang="scss">
:root {
  --main-bg: var(--p-rose-200);
}

.my-index {
  background-color: var(--main-bg);
  padding: 2rem;
}

.abcxyz {
  background-color: $base-color;
  @include textClamp(2);
}
</style>
