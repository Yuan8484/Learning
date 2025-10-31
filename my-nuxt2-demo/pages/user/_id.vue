<template>
  <div>
    <h1>用户 {{ $route.params.id }} 详情</h1>
    <UserCard :user="user" />
  </div>
</template>

<script>
import UserCard from '~/components/UserCard.vue'

export default {
  components: { UserCard },
  data() {
    return { user: null }
  },
  // 路由参数变化时重新加载数据
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.$store.dispatch('fetchUser', newId)
      },
      immediate: true
    }
  },
  // 获取 Vuex 状态
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  // 中间件验证（需登录）
  middleware: 'auth'
}
</script>