---
title: SDK Reference
outline: [2, 3]
---

<script setup>
import { data } from './gazu-spec.data.js'
</script>

# SDK Reference

<template v-for="(functions, moduleName) in data.modules" :key="moduleName">

<h2 :id="moduleName">{{ moduleName }}</h2>

<template v-for="fn in functions" :key="fn.name">

<h3 :id="fn.name">{{ fn.name }}</h3>

<pre class="signature-block"><code class="language-python">{{ fn.signature }}</code></pre>

#### Description
<p v-if="fn.description">
  {{ fn.description }}
</p>

#### Parameters
<div v-if="Object.keys(fn.inputs).length">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(param, key) in fn.inputs" :key="key">
        <td><code>{{ key }}</code></td>
        <td>
          <span v-if="param.default !== null && param.default !== undefined">
            {{ param.default }}
          </span>
          <span v-else>-</span>
        </td>
        <td>
          <span v-if="param.description">{{ param.description }}</span>
          <span v-else>-</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

#### Results
<div v-if="fn.outputs && (fn.outputs.annotation || fn.outputs.description)">
  <p><strong>Type:</strong> {{ fn.outputs.annotation || 'Unknown' }}</p>
  <p v-if="fn.outputs.description">
    {{ fn.outputs.description }}
  </p>
</div>

</template>

</template>
