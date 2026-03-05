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

<h3>
<strong :id="fn.name" class="signature-block"><code class="language-python">{{ fn.signature }}</code></strong>

</h3>

<p v-if="fn.description">
  {{ fn.description }}
</p>

<div v-if="Object.keys(fn.inputs).length">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(param, key) in fn.inputs" :key="key">
        <td><code>{{ key }}</code></td>
        <td>{{ param.type }}</td>
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

<div v-if="fn.outputs && (fn.outputs.annotation || fn.outputs.description)">
  <p v-if="fn.outputs.description">
    <strong>Returns:</strong>
    ({{ fn.outputs.annotation || 'Unknown' }})
    {{ fn.outputs.description }}
  </p>
</div>
<hr />

</template>

</template>
