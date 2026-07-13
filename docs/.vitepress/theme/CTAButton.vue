<template>
<p class="cta">
<a
    :class="{
    button: true,
    'is-large': true,
    'is-big': true
    }"
    :href="`https://account.cg-wire.com/signup`"
>
    Try Kitsu For Free
</a>
</p>
</template>

<style scoped>
.cta {
    background-color: #00b242;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding: 30px 10px 30px 10px;
    margin-top: 30px;
    margin-bottom: 30px;
    border-radius: 25px;
    font-size: 25px;
}

.cta a {
    color: white;
    text-decoration: none;
}
</style>