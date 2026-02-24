---
title: SDK Reference
outline: [2, 3]
---

<script setup>
import { data } from './gazu-spec.data.js'
</script>

# SDK Reference

<div v-for="fn in data.functions" :key="fn.name" style="margin-bottom: 3rem;">
    <h2 :id="fn.name.replace(/\./g, '-')">{{ fn.name }}</h2>

  <h3>Signature</h3>

  <pre class="signature-block"><code class="language-python">{{ fn.signature }}</code></pre>

  <h3>Description</h3>
  <p v-if="fn.description">
    {{ fn.description }}
  </p>
  <p v-else>
    <em>No description provided.</em>
  </p>

  <h3>Inputs</h3>

  <div v-if="Object.keys(fn.inputs).length">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Default</th>
          <th>Kind</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(param, key) in fn.inputs" :key="key">
          <td><code>{{ key }}</code></td>
          <td>
            <span v-if="param.default !== null">{{ param.default }}</span>
            <span v-else>-</span>
          </td>
          <td>{{ param.kind }}</td>
          <td>
            <span v-if="param.description">{{ param.description }}</span>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-else>
    <em>No input parameters.</em>
  </p>

  <h3>Output</h3>

  <div v-if="fn.outputs && (fn.outputs.annotation || fn.outputs.description)">
    <p><strong>Type:</strong> {{ fn.outputs.annotation || 'Unknown' }}</p>
    <p v-if="fn.outputs.description">
      {{ fn.outputs.description }}
    </p>
  </div>

  <p v-else>
    <em>No output documentation provided.</em>
  </p>

</div>
