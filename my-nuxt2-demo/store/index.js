export const state = () => ({
  user: null,
  todos: []
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  addTodo(state, todo) {
    state.todos.push(todo)
  }
}

export const actions = {
    fetchUser({ commit }, userId) {
    // 模拟异步获取用户数据
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { id: userId, name: '用户' + userId }
        commit('setUser', user)
        resolve(user)
      }, 1000)
    })
  }
  
}