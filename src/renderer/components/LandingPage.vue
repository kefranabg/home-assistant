<template>
  <div id="wrapper">
    <main>
      <h1>Hello world!</h1>  
    </main>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
    },
  }
</script>

<style>
  body {
    margin: 0;
  }

  main {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: black;
  }

  h1 {
    color: white;
  }
</style>
