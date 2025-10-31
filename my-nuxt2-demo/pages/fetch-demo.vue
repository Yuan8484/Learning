<template>
  <div class="fetch-demo">
    <nav class="navbar">
      <nuxt-link to="/" class="link">首页</nuxt-link>
      <nuxt-link to="/fetch-demo" class="link active">Fetch 演示</nuxt-link>
    </nav>
    
    <div class="content">
      <h1>Nuxt 2 Fetch 方法演示</h1>
      
      <!-- 执行环境信息 -->
      <div class="environment-info">
        <h2>执行环境信息</h2>
        <p>本次 fetch 执行环境：<strong>{{ fetchContext }}</strong></p>
        <p>服务器端执行: {{ fetchIsServer ? '✓' : '✗' }}</p>
        <p>客户端执行: {{ fetchIsClient ? '✓' : '✗' }}</p>
        <p class="tip">提示：刷新页面时，fetch 会在服务器端执行；通过 nuxt-link 导航时，会在客户端执行</p>
      </div>
      
      <!-- Fetch 数据展示 -->
      <div class="data-section">
        <h2>通过 Fetch 获取的数据</h2>
        
        <!-- 评论列表 -->
        <div class="comments-container">
          <h3>评论列表</h3>
          
          <div v-if="comments && comments.length > 0">
            <ul class="comment-list">
              <li v-for="comment in comments" :key="comment.id">
                <div class="comment-header">
                  <strong>{{ comment.author }}</strong>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
                <div class="comment-stats">
                  <span>👍 {{ comment.likes }}</span>
                  <span>💬 {{ comment.replies }}</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div v-else-if="comments !== undefined">
            <p class="loading">加载中...</p>
          </div>
          
          <div v-else>
            <p class="no-data">暂无评论数据</p>
          </div>
        </div>
        
        <!-- 用户信息 -->
        <div class="user-info" v-if="currentUser">
          <h3>当前用户信息</h3>
          <div class="user-card">
            <img :src="currentUser.avatar" alt="用户头像" class="avatar">
            <div class="user-details">
              <h4>{{ currentUser.name }}</h4>
              <p>{{ currentUser.email }}</p>
              <p>{{ currentUser.bio }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fetch 方法特点说明 -->
      <div class="features-section">
        <h2>Fetch 方法特点</h2>
        
        <div class="feature-grid">
          <div class="feature-item">
            <h3>✅ 可访问组件实例</h3>
            <p>fetch 方法可以直接使用 <code>this</code> 访问组件实例，修改组件数据和调用组件方法</p>
          </div>
          
          <div class="feature-item">
            <h3>✅ 直接修改数据</h3>
            <p>通过 <code>this.comments = data</code> 方式直接修改组件数据，无需返回对象</p>
          </div>
          
          <div class="feature-item">
            <h3>✅ 执行时机</h3>
            <p>在组件实例化期间执行，可以在服务器端或客户端运行</p>
          </div>
          
          <div class="feature-item">
            <h3>✅ 错误处理</h3>
            <p>可以使用 try/catch 进行完整的错误处理和状态管理</p>
          </div>
        </div>
      </div>
      
      <!-- 与 asyncData 对比 -->
      <div class="comparison-section">
        <h2>与 asyncData 对比</h2>
        
        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>特性</th>
                <th>fetch 方法</th>
                <th>asyncData 方法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>访问组件实例</td>
                <td>可以使用 this</td>
                <td>不能使用 this</td>
              </tr>
              <tr>
                <td>数据设置方式</td>
                <td>this.xxx = value</td>
                <td>返回数据对象</td>
              </tr>
              <tr>
                <td>预渲染数据</td>
                <td>不会预渲染到 HTML</td>
                <td>会预渲染到 HTML</td>
              </tr>
              <tr>
                <td>执行时机</td>
                <td>组件实例化期间</td>
                <td>组件实例化之前</td>
              </tr>
              <tr>
                <td>适用场景</td>
                <td>非关键数据、用户特定数据</td>
                <td>SEO 关键内容、首屏数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 手动触发 fetch -->
      <div class="action-section">
        <h2>手动操作</h2>
        <button @click="refreshData" class="refresh-btn" :disabled="isRefreshing">
          {{ isRefreshing ? '刷新中...' : '刷新数据' }}
        </button>
        <button @click="addComment" class="add-btn">添加评论</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 页面标题
  head() {
    return {
      title: 'Nuxt 2 Fetch 方法演示',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '演示 Nuxt 2 中 fetch 方法的使用和特性'
        }
      ]
    }
  },
  
  // 数据属性
  data() {
    return {
      // fetch 方法会修改这些数据
      comments: [],
      currentUser: null,
      // 执行环境信息
      fetchContext: '初始化中',
      fetchIsServer: false,
      fetchIsClient: false,
      // 加载状态
      isRefreshing: false
    }
  },
  
  // fetch 方法 - Nuxt 2 特有的数据获取方法
  async fetch() {
    try {
      // fetch 方法可以访问 this（组件实例）
      console.log('fetch 方法开始执行...')
      
      // 检测执行环境
      const isServer = process.server
      const isClient = process.client
      const fetchContext = isServer ? '服务器端' : '客户端'
      console.log(`fetch 在 ${fetchContext} 执行`)
      
      // 同时发起多个异步请求
      const [commentsResponse, userResponse] = await Promise.all([
        // 模拟获取评论数据
        this.fetchComments(),
        // 模拟获取用户数据
        this.fetchUserData()
      ])
      
      // 使用 this 直接修改组件数据
      this.comments = commentsResponse
      this.currentUser = userResponse
      this.fetchContext = fetchContext
      this.fetchIsServer = isServer
      this.fetchIsClient = isClient
      
      console.log('fetch 方法执行完成')
    } catch (error) {
      console.error('fetch 方法执行出错:', error)
      // 错误处理
      this.comments = []
      this.currentUser = null
      this.fetchContext = '执行出错'
    }
  },
  
  methods: {
    // 模拟获取评论数据
    async fetchComments() {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟返回数据
      return [
        {
          id: 1,
          author: '用户A',
          text: '这是通过 fetch 方法获取的第一条评论，fetch 方法可以直接访问组件实例！',
          date: '2024-01-15 10:30',
          likes: 24,
          replies: 5
        },
        {
          id: 2,
          author: '用户B',
          text: '在 Nuxt 2 中，fetch 方法是获取非关键数据的好选择，可以直接修改组件状态。',
          date: '2024-01-15 11:45',
          likes: 18,
          replies: 3
        },
        {
          id: 3,
          author: '用户C',
          text: 'fetch 方法在服务器端和客户端都可以执行，但数据不会被预渲染到 HTML 中。',
          date: '2024-01-15 14:20',
          likes: 32,
          replies: 7
        }
      ]
    },
    
    // 模拟获取用户数据
    async fetchUserData() {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 模拟返回用户数据
      return {
        id: 101,
        name: '演示用户',
        email: 'demo@example.com',
        bio: '这是通过 fetch 方法获取的用户信息，展示了 fetch 方法可以同时获取多种数据。',
        avatar: 'https://picsum.photos/200/200?random=1'
      }
    },
    
    // 手动刷新数据
    async refreshData() {
      this.isRefreshing = true
      try {
        // 手动调用 fetch 方法刷新数据
        await this.$fetch()
        console.log('手动刷新数据完成')
      } catch (error) {
        console.error('刷新数据失败:', error)
      } finally {
        this.isRefreshing = false
      }
    },
    
    // 添加评论（演示直接修改组件状态）
    addComment() {
      const newComment = {
        id: Date.now(), // 使用时间戳作为临时 ID
        author: this.currentUser?.name || '匿名用户',
        text: `这是新添加的评论，时间：${new Date().toLocaleString()}`,
        date: new Date().toLocaleString(),
        likes: 0,
        replies: 0
      }
      
      // 直接修改组件数据
      this.comments.unshift(newComment)
      console.log('添加了新评论:', newComment)
    }
  }
}
</script>

<style scoped>
.fetch-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
  line-height: 1.6;
}

.navbar {
  padding: 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.link {
  margin-right: 20px;
  text-decoration: none;
  color: #2196f3;
  font-weight: 500;
}

.link.active {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  color: #1976d2;
  margin-bottom: 30px;
  font-size: 2.5em;
}

h2 {
  color: #333;
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 1.8em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

h3 {
  color: #444;
  margin-top: 25px;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.environment-info {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  margin-bottom: 30px;
}

.tip {
  font-style: italic;
  color: #666;
  font-size: 0.9em;
  margin-top: 10px;
}

.data-section {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.comments-container {
  margin-bottom: 40px;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-list li {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 3px solid #2196f3;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-date {
  font-size: 0.85em;
  color: #888;
}

.comment-text {
  margin: 10px 0;
  color: #555;
}

.comment-stats {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #777;
}

.user-info {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-card {
  display: flex;
  gap: 20px;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.user-details p {
  margin: 5px 0;
  color: #666;
  font-size: 0.95em;
}

.features-section {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-item h3 {
  color: #4caf50;
  margin-top: 0;
  font-size: 1.2em;
}

.feature-item code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.comparison-section {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.comparison-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

tr:hover {
  background: #f9f9f9;
}

td code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

.action-section {
  text-align: center;
  padding: 30px;
  background: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 40px;
}

.refresh-btn, .add-btn {
  padding: 12px 24px;
  margin: 0 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn {
  background: #2196f3;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #1976d2;
}

.refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.add-btn {
  background: #4caf50;
  color: white;
}

.add-btn:hover {
  background: #43a047;
}

.loading, .no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
</style>