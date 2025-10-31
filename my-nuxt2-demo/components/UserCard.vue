<template>
  <div class="card" v-if="user">
    <h3>{{ user.name }}</h3>
    <p>用户ID: {{ user.id }}</p>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card { padding: 20px; border: 1px solid #ccc; margin-top: 20px; }
</style>