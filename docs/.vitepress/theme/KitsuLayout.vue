<script setup>
import DefaultTheme from 'vitepress/theme'

import NavbarSignupButton from "./NavbarSignupButton.vue"
import ExitIntentPopup from "./ExitIntentPopup.vue"

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <NavbarSignupButton/>
    </template>

    <template #layout-bottom>
    <ExitIntentPopup/>
    </template>
  </Layout>
</template>