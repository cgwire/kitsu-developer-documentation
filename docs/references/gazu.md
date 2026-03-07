---
title: SDK Reference
outline: [2, 3]
---

<script setup>
import { data } from './gazu-spec.data.js'

const sortParams = (a, b) => {
    return a.position - b.position
}

const getParams = (paramsDict) => {
  const result = []
  Object.keys(paramsDict).forEach(key => {
    const param = paramsDict[key]
    const name = key
    const entry = {
      ...param,
      name
    }
    if (!['args', 'kwargs'].includes(name)) {
      result.push(entry)
    }
  })
  return result.sort(sortParams)
}
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
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="param in getParams(fn.inputs)" :key="param.name">
        <td class="param-name"><code>{{ param.name }}</code></td>
        <td class="param-type">{{ param.doc_type }}</td>
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
