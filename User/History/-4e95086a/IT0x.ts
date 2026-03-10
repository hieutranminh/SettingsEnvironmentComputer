/**
 * Test file for enforce-vue-composition-api custom ESLint rule
 *
 * This file contains comprehensive tests for the enforce-vue-composition-api rule
 * to ensure it correctly identifies and reports violations.
 *
 * @fileoverview Test suite for enforce-vue-composition-api rule
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import { RuleTester } from 'eslint'
import enforceVueCompositionApi from '../enforce-vue-composition-api'

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('enforce-vue-composition-api', () => {
  ruleTester.run('enforce-vue-composition-api', enforceVueCompositionApi, {
    valid: [
      // Valid Vue files with <script setup>
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello World')
</script>
        `,
        filename: 'test.vue',
      },

      // Valid Vue files with Composition API in <script>
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const message = ref('Hello World')
    return { message }
  }
})
</script>
        `,
        filename: 'test.vue',
      },

      // Valid non-Vue files (should be ignored)
      {
        code: 'const message = "Hello World"',
        filename: 'test.ts',
      },
    ],

    invalid: [
      // Invalid Vue files with Options API
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  }
}
</script>
        `,
        filename: 'test.vue',
        errors: [
          {
            messageId: 'useCompositionApi',
          },
        ],
      },

      // Invalid Vue files with Options API methods
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  },
  methods: {
    updateMessage() {
      this.message = 'Updated'
    }
  }
}
</script>
        `,
        filename: 'test.vue',
        errors: [
          {
            messageId: 'useCompositionApi',
          },
        ],
      },

      // Invalid Vue files with Options API computed
      {
        code: `
<template>
  <div>{{ computedMessage }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  },
  computed: {
    computedMessage() {
      return this.message.toUpperCase()
    }
  }
}
</script>
        `,
        filename: 'test.vue',
        errors: [
          {
            messageId: 'useCompositionApi',
          },
        ],
      },

      // Invalid Vue files with Options API watch
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  },
  watch: {
    message(newVal) {
      console.log('Message changed:', newVal)
    }
  }
}
</script>
        `,
        filename: 'test.vue',
        errors: [
          {
            messageId: 'useCompositionApi',
          },
        ],
      },

      // Invalid Vue files with Options API lifecycle hooks
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
</script>
        `,
        filename: 'test.vue',
        errors: [
          {
            messageId: 'useCompositionApi',
          },
        ],
      },

      // Invalid Vue files without <script setup>
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import { ref } from 'vue'

const message = ref('Hello World')
</script>
        `,
        filename: 'test.vue',
        errors: [
          {
            messageId: 'useScriptSetup',
          },
        ],
      },
    ],
  })
})

describe('enforce-vue-composition-api with custom options', () => {
  ruleTester.run('enforce-vue-composition-api', enforceVueCompositionApi, {
    valid: [
      // Valid with excluded files
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  }
}
</script>
        `,
        filename: 'legacy.vue',
        options: [
          {
            allowOptionsApiIn: ['legacy.vue'],
            enforceScriptSetup: false,
            checkDeprecatedPatterns: false,
          },
        ],
      },
    ],

    invalid: [
      // Invalid with excluded files (but not matching pattern)
      {
        code: `
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      message: 'Hello World'
    }
  }
}
</script>
        `,
        filename: 'test.vue',
        options: [
          {
            allowOptionsApiIn: ['legacy.vue'],
            enforceScriptSetup: false,
            checkDeprecatedPatterns: true,
          },
        ],
        errors: [
          {
            messageId: 'useCompositionApi',
          },
        ],
      },
    ],
  })
})
