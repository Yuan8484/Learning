<template>
  <div class="asyncdata-api-demo">
    <nav class="navbar">
      <nuxt-link to="/" class="link">首页</nuxt-link>
      <nuxt-link to="/fetch-demo" class="link">Fetch 演示</nuxt-link>
      <nuxt-link to="/fetch-versions" class="link">Fetch 版本对比</nuxt-link>
      <nuxt-link to="/asyncdata-api-demo" class="link active">AsyncData API 演示</nuxt-link>
    </nav>
    
    <div class="content">
      <h1>AsyncData 公开 API 测试</h1>
      
      <!-- 执行环境信息 -->
      <div class="environment-info">
        <h2>执行环境信息</h2>
        <p>本次 asyncData 执行环境：<strong>{{ executionContext }}</strong></p>
        <p>服务器端执行: {{ isServer ? '✓' : '✗' }}</p>
        <p>客户端执行: {{ isClient ? '✓' : '✗' }}</p>
        <p class="tip">提示：刷新页面时，asyncData 会在服务器端执行；通过 nuxt-link 导航时，会在客户端执行</p>
      </div>
      
      <!-- 加载状态和错误处理 -->
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>数据加载中，请稍候...</p>
      </div>
      
      <div v-else-if="error" class="error-section">
        <div class="error-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="refreshPage" class="refresh-btn">刷新页面</button>
      </div>
      
      <!-- API 数据展示区域 -->
      <div v-else class="api-data-section">
        <!-- 帖子列表 -->
        <section class="posts-section">
          <div class="section-header">
            <h2>帖子列表 <small>(来自 JSONPlaceholder)</small></h2>
            <p>使用 asyncData 获取的公开 API 数据</p>
          </div>
          
          <div class="posts-grid">
            <div v-for="post in posts" :key="post.id" class="post-card">
              <div class="post-number">#{{ post.id }}</div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-body">{{ truncateText(post.body, 100) }}</p>
              <div class="post-actions">
                <button @click="viewPostComments(post.id)" class="comments-btn">查看评论</button>
                <button @click="viewPostDetail(post.id)" class="detail-btn">详情</button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 用户信息 -->
        <section class="users-section">
          <div class="section-header">
            <h2>用户信息 <small>(来自 JSONPlaceholder)</small></h2>
            <p>通过 asyncData 同时获取多个 API 数据</p>
          </div>
          
          <div class="users-grid">
            <div v-for="user in users" :key="user.id" class="user-card">
              <div class="user-avatar">
                {{ getInitials(user.name) }}
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.name }}</h3>
                <p class="user-email">{{ user.email }}</p>
                <p class="user-company">{{ user.company.name }}</p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 相册预览 -->
        <section class="photos-section">
          <div class="section-header">
            <h2>相册预览 <small>(来自 JSONPlaceholder)</small></h2>
            <p>展示 asyncData 处理图片数据的能力</p>
          </div>
          
          <div class="photos-grid">
            <div v-for="photo in photos" :key="photo.id" class="photo-card">
              <img :src="photo.thumbnailUrl" :alt="photo.title" class="photo-thumbnail">
              <p class="photo-title">{{ truncateText(photo.title, 30) }}</p>
            </div>
          </div>
        </section>
      </div>
      
      <!-- AsyncData 技术说明 -->
      <div class="technical-info">
        <h2>技术实现说明</h2>
        
        <div class="info-cards">
          <div class="info-card">
            <h3>✅ 执行环境</h3>
            <p>asyncData 在服务器端渲染期间执行，数据被预渲染到 HTML 中</p>
          </div>
          
          <div class="info-card">
            <h3>✅ 多 API 调用</h3>
            <p>使用 Promise.all 并行获取多个 API 数据，提高性能</p>
          </div>
          
          <div class="info-card">
            <h3>✅ 错误处理</h3>
            <p>完整的 try/catch 错误捕获机制，提供友好的错误提示</p>
          </div>
          
          <div class="info-card">
            <h3>✅ 加载状态</h3>
            <p>通过设置初始状态和响应式数据管理加载过程</p>
          </div>
        </div>
      </div>
      
      <!-- API 信息 -->
      <div class="api-info">
        <h2>使用的公开 API</h2>
        <p>本示例使用 <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener noreferrer">JSONPlaceholder</a> 提供的免费测试 API：</p>
        
        <div class="api-endpoints">
          <div class="api-endpoint">
            <code>GET /posts</code>
            <span class="endpoint-desc">- 获取帖子列表</span>
          </div>
          <div class="api-endpoint">
            <code>GET /users</code>
            <span class="endpoint-desc">- 获取用户信息</span>
          </div>
          <div class="api-endpoint">
            <code>GET /photos</code>
            <span class="endpoint-desc">- 获取相册预览</span>
          </div>
        </div>
        
        <p class="api-note">这些 API 不需要注册或 API Key，可以直接用于测试开发。</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 页面标题
  head() {
    return {
      title: 'AsyncData 公开 API 测试',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '使用公开免费 API 测试 Nuxt.js 中的 asyncData 方法'
        }
      ]
    }
  },
  
  // 本地数据，用于管理状态
  data() {
    return {
      // 设置默认值，防止 asyncData 执行前出现 undefined
      loading: true,
      error: null,
      // 这些数据将由 asyncData 填充
      posts: [],
      users: [],
      photos: [],
      executionContext: '初始化中',
      isServer: false,
      isClient: false
    }
  },
  
  // asyncData 方法 - 在组件实例创建前执行
  async asyncData({ $axios }) {
    try {
      // 检测执行环境
      const isServer = process.server
      const isClient = process.client
      const executionContext = isServer ? '服务器端' : '客户端'
      console.log(`asyncData 在 ${executionContext} 执行`)
      
      // 使用 Promise.all 并行获取多个 API 数据
      // 这样可以同时发起多个请求，而不是等待前一个完成
      const [postsResponse, usersResponse, photosResponse] = await Promise.all([
        // 获取帖子列表（限制为 10 条）
        $axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10'),
        // 获取用户信息（限制为 6 条）
        $axios.get('https://jsonplaceholder.typicode.com/users?_limit=6'),
        // 获取相册预览（限制为 12 张）
        $axios.get('https://jsonplaceholder.typicode.com/photos?_limit=12')
      ])
      
      
      // 返回获取的数据，这些数据将与组件的 data 合并
      return {
        posts: postsResponse.data,
        users: usersResponse.data,
        photos: photosResponse.data,
        executionContext,
        isServer,
        isClient,
        loading: false,
        error: null
      }
    } catch (error) {
      // 错误处理
      console.error('API 请求失败:', error)
      
      // 返回错误信息，在组件中显示
      return {
        posts: [],
        users: [],
        photos: [],
        executionContext: '未知',
        isServer: false,
        isClient: false,
        loading: false,
        error: error.message || '获取数据失败，请稍后重试'
      }
    }
  },
  
  methods: {
    // 截断文本，避免内容过长
    truncateText(text, maxLength) {
      if (!text || text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    
    // 获取用户姓名首字母
    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
    },
    
    // 查看帖子评论（示例方法，实际项目中可以导航到评论页面）
    viewPostComments(postId) {
      console.log(`查看帖子 ${postId} 的评论`)
      alert(`在实际项目中，这里会跳转到帖子 ${postId} 的评论页面`)
    },
    
    // 查看帖子详情（示例方法，实际项目中可以导航到详情页面）
    viewPostDetail(postId) {
      console.log(`查看帖子 ${postId} 的详情`)
      alert(`在实际项目中，这里会跳转到帖子 ${postId} 的详情页面`)
    },
    
    // 刷新页面
    refreshPage() {
      this.loading = true
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.asyncdata-api-demo {
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
  text-align: center;
}

h2 {
  color: #333;
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 1.8em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

h2 small {
  color: #666;
  font-size: 0.7em;
  font-weight: normal;
}

h3 {
  color: #444;
  margin-top: 15px;
  margin-bottom: 10px;
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

/* 加载状态样式 */
.loading-section {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-section {
  text-align: center;
  padding: 60px 20px;
  background: #ffebee;
  border-radius: 8px;
  border-left: 4px solid #f44336;
  margin-bottom: 30px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.refresh-btn {
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: #1976d2;
}

/* API 数据展示样式 */
.section-header {
  margin-bottom: 30px;
  text-align: center;
}

.section-header p {
  color: #666;
  font-size: 0.9em;
}

/* 帖子卡片样式 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  border-left: 3px solid #2196f3;
}

.post-number {
  position: absolute;
  top: 10px;
  right: 15px;
  color: #999;
  font-size: 0.8em;
  font-weight: 500;
}

.post-title {
  font-size: 1.2em;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.3;
}

.post-body {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.post-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.comments-btn, .detail-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.comments-btn {
  background: #4caf50;
  color: white;
}

.comments-btn:hover {
  background: #43a047;
}

.detail-btn {
  background: #ff9800;
  color: white;
}

.detail-btn:hover {
  background: #f57c00;
}

/* 用户卡片样式 */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 3px solid #9c27b0;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #9c27b0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  flex-shrink: 0;
}

.user-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1em;
}

.user-email {
  color: #2196f3;
  margin: 5px 0;
  font-size: 0.9em;
}

.user-company {
  color: #666;
  margin: 5px 0 0 0;
  font-size: 0.85em;
  font-style: italic;
}

/* 照片卡片样式 */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
}

.photo-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-5px);
}

.photo-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.photo-title {
  padding: 10px;
  margin: 0;
  font-size: 0.85em;
  color: #555;
  text-align: center;
}

/* 技术信息样式 */
.technical-info {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 3px solid #4caf50;
}

.info-card h3 {
  margin-top: 0;
  color: #4caf50;
  font-size: 1.2em;
}

/* API 信息样式 */
.api-info {
  background: #e8f5e9;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.api-info a {
  color: #2196f3;
  text-decoration: none;
}

.api-info a:hover {
  text-decoration: underline;
}

.api-endpoints {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.api-endpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.api-endpoint:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.api-endpoint code {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 500;
  white-space: nowrap;
}

.endpoint-desc {
  color: #666;
  font-size: 0.9em;
}

.api-note {
  font-style: italic;
  color: #666;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 15px;
  }
  
  .link {
    margin-right: 15px;
    font-size: 0.9em;
  }
  
  .posts-grid, .users-grid {
    grid-template-columns: 1fr;
  }
  
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>