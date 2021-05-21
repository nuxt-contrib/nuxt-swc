<template>
  <div>
    {{ hello }}
  </div>
</template>

<script lang="ts">
export default {
  data () {
    const hello: String = 'Hello World'
    return {
      hello
    }
  }
}
</script>
