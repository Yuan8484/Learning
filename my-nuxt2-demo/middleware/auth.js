export default function({ store, redirect }) {
  // 如果未登录，重定向到首页
  if (!store.state.user) {
    return redirect('/')
  }
}