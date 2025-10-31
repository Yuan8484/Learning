<template>
  <div class="fetch-versions">
    <nav class="navbar">
      <nuxt-link to="/" class="link">首页</nuxt-link>
      <nuxt-link to="/fetch-demo" class="link">Fetch 演示</nuxt-link>
      <nuxt-link to="/fetch-versions" class="link active">Fetch 版本对比</nuxt-link>
      <nuxt-link to="/asyncdata-api-demo" class="link active">AsyncData API 演示</nuxt-link>
    </nav>
    
    <div class="content">
      <h1>Nuxt 2 中 Fetch 方法的不同版本对比</h1>
      
      <div class="intro">
        <p>在 Nuxt 2 中，fetch 方法经历了重要的变化，了解这些差异对于正确使用数据获取功能至关重要。</p>
      </div>
      
      <!-- 两个版本的fetch方法对比 -->
      <div class="versions-comparison">
        <h2>1. 服务端初始化阶段的 fetch(context)</h2>
        <div class="version-card older">
          <div class="version-header">
            <h3>Nuxt 2.12 之前版本</h3>
            <span class="version-label">旧版本</span>
          </div>
          
          <div class="version-content">
            <pre class="code-block">
// 服务端初始化阶段的 fetch 方法
export default {
  fetch(context) {
    // 不能访问 this
    // 必须返回 Promise 或使用 async/await
    return axios.get('/api/data')
      .then(res => {
        context.store.commit('setData', res.data)
      })
  }
}
            </pre>
            
            <div class="lifecycle-info">
              <h4>生命周期位置：</h4>
              <ul>
                <li>✅ 在服务端渲染期间执行</li>
                <li>✅ 在客户端导航时执行</li>
                <li>❌ <strong>在组件实例创建之前执行</strong></li>
                <li>❌ <strong>与 asyncData 类似的执行时机</strong></li>
              </ul>
            </div>
            
            <div class="key-features">
              <h4>关键特性：</h4>
              <ul>
                <li><strong>接收 context 参数</strong>，与 asyncData 类似</li>
                <li><strong>无法访问组件实例 (this)</strong></li>
                <li>通常用于 <strong>填充 Vuex store</strong></li>
                <li>不直接设置组件数据</li>
                <li>在 Nuxt 2.12+ 中已被弃用</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h2>2. Created 阶段之后的 fetch()</h2>
        <div class="version-card newer">
          <div class="version-header">
            <h3>Nuxt 2.12 及之后版本</h3>
            <span class="version-label recommended">推荐使用</span>
          </div>
          
          <div class="version-content">
            <pre class="code-block">
// Created 阶段之后的 fetch 方法
export default {
  async fetch() {
    // 可以访问 this
    try {
      const response = await axios.get('/api/data')
      this.localData = response.data
    } catch (error) {
      this.error = error.message
    }
  }
}
            </pre>
            
            <div class="lifecycle-info">
              <h4>生命周期位置：</h4>
              <ul>
                <li>✅ 在服务端渲染期间执行</li>
                <li>✅ 在客户端导航时执行</li>
                <li>✅ <strong>在组件实例创建之后执行</strong></li>
                <li>✅ <strong>在 created 钩子之前或之后</strong>（取决于配置）</li>
              </ul>
            </div>
            
            <div class="key-features">
              <h4>关键特性：</h4>
              <ul>
                <li><strong>可以直接访问组件实例 (this)</strong></li>
                <li>通过 <strong>this.key = value</strong> 直接修改组件数据</li>
                <li>支持 <strong>$fetchState</strong> 状态管理</li>
                <li>可以通过 <strong>this.$fetch()</strong> 手动触发</li>
                <li>提供更好的错误处理能力</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主要区别 -->
      <div class="main-differences">
        <h2>主要区别总结</h2>
        
        <div class="differences-table">
          <table>
            <thead>
              <tr>
                <th>对比项</th>
                <th>fetch(context)（旧版本）</th>
                <th>fetch()（新版本）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>执行时机</strong></td>
                <td>服务端初始化阶段，组件实例创建前</td>
                <td>created 阶段前后，组件实例创建后</td>
              </tr>
              <tr>
                <td><strong>this 访问权限</strong></td>
                <td>❌ 无法访问</td>
                <td>✅ 可以访问</td>
              </tr>
              <tr>
                <td><strong>参数</strong></td>
                <td>接收 context 对象</td>
                <td>无参数</td>
              </tr>
              <tr>
                <td><strong>数据更新方式</strong></td>
                <td>通过 context.store 或返回数据</td>
                <td>直接 this.data = value</td>
              </tr>
              <tr>
                <td><strong>手动触发</strong></td>
                <td>不支持</td>
                <td>支持 this.$fetch()</td>
              </tr>
              <tr>
                <td><strong>状态管理</strong></td>
                <td>不提供</td>
                <td>提供 $fetchState（pending, error）</td>
              </tr>
              <tr>
                <td><strong>错误处理</strong></td>
                <td>有限</td>
                <td>完整的 try/catch 支持</td>
              </tr>
              <tr>
                <td><strong>推荐度</strong></td>
                <td>❌ 已弃用</td>
                <td>✅ 推荐使用</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 生命周期可视化 -->
      <div class="lifecycle-visual">
        <h2>生命周期可视化</h2>
        
        <div class="timeline">
          <div class="timeline-item server">
            <div class="timeline-point"></div>
            <div class="timeline-content">
              <h3>服务器端渲染</h3>
              <ol>
                <li>页面请求开始</li>
                <li><strong>asyncData()</strong> 执行</li>
                <li><strong>fetch(context)</strong> 执行（旧版本）</li>
                <li>组件实例创建</li>
                <li><strong>fetch()</strong> 执行（新版本）</li>
                <li>created 钩子</li>
                <li>beforeMount 钩子</li>
                <li>HTML 渲染完成</li>
              </ol>
            </div>
          </div>
          
          <div class="timeline-item client">
            <div class="timeline-point"></div>
            <div class="timeline-content">
              <h3>客户端导航</h3>
              <ol>
                <li>导航开始</li>
                <li><strong>asyncData()</strong> 执行</li>
                <li><strong>fetch(context)</strong> 执行（旧版本）</li>
                <li>组件实例创建</li>
                <li><strong>fetch()</strong> 执行（新版本）</li>
                <li>created 钩子</li>
                <li>beforeMount 钩子</li>
                <li>mounted 钩子</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 最佳实践 -->
      <div class="best-practices">
        <h2>最佳实践建议</h2>
        
        <div class="practice-item">
          <h3>1. 使用最新版本的 fetch()</h3>
          <p>在 Nuxt 2.12+ 中，始终使用无参的 fetch() 方法，它提供了更好的开发体验和功能支持。</p>
        </div>
        
        <div class="practice-item">
          <h3>2. 合理选择数据获取方法</h3>
          <ul>
            <li><strong>asyncData</strong>：SEO 关键数据、首屏重要内容</li>
            <li><strong>fetch()</strong>：组件特定数据、非关键内容、需要访问 this 的场景</li>
            <li><strong>mounted</strong>：纯客户端数据、需要 DOM 的场景</li>
          </ul>
        </div>
        
        <div class="practice-item">
          <h3>3. 利用 $fetchState</h3>
          <p>新版本 fetch 提供了 $fetchState.pending 和 $fetchState.error 来管理加载状态和错误处理。</p>
          <pre class="code-block">
&lt;div v-if="$fetchState.pending">加载中...&lt;/div>
&lt;div v-else-if="$fetchState.error">加载出错&lt;/div>
&lt;div v-else>显示数据&lt;/div>
          </pre>
        </div>
        
        <div class="practice-item">
          <h3>4. 手动触发数据刷新</h3>
          <p>使用 this.$fetch() 可以在用户交互后重新获取数据。</p>
          <pre class="code-block">
methods: {
  async refreshData() {
    await this.$fetch()
  }
}
          </pre>
        </div>
      </div>
      
      <!-- 实际演示 -->
      <div class="demo-section">
        <h2>实际演示</h2>
        <p>点击下方按钮查看实际的 fetch 方法演示：</p>
        <div class="demo-links">
          <nuxt-link to="/fetch-demo" class="demo-btn">查看 fetch() 演示</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Nuxt 2 Fetch 方法版本对比',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '详细对比 Nuxt 2 中不同版本 fetch 方法的区别和使用场景'
        }
      ]
    }
  }
}
</script>

<style scoped>
.fetch-versions {
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
  margin-top: 50px;
  margin-bottom: 25px;
  font-size: 1.8em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

h3 {
  color: #444;
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 1.3em;
}

h4 {
  color: #555;
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.intro {
  background: #e3f2fd;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.1em;
  color: #1565c0;
}

.versions-comparison {
  margin-bottom: 50px;
}

.version-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.version-card:hover {
  transform: translateY(-5px);
}

.version-card.older {
  border-left: 5px solid #ff9800;
}

.version-card.newer {
  border-left: 5px solid #4caf50;
}

.version-header {
  background: #f5f5f5;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.version-header h3 {
  margin: 0;
}

.version-label {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
}

.version-label.older {
  background: #fff3e0;
  color: #f57c00;
}

.version-label.recommended {
  background: #e8f5e9;
  color: #2e7d32;
}

.version-content {
  padding: 25px;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 20px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #333;
}

.lifecycle-info, .key-features {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.lifecycle-info ul, .key-features ul {
  margin: 10px 0;
  padding-left: 20px;
}

.lifecycle-info li, .key-features li {
  margin-bottom: 8px;
  line-height: 1.4;
}

.main-differences {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 50px;
}

.differences-table {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background: #2196f3;
  color: white;
  font-weight: 600;
}

tr:nth-child(even) {
  background: #f9f9f9;
}

tr:hover {
  background: #f0f7ff;
}

td strong {
  color: #1976d2;
}

.lifecycle-visual {
  margin-bottom: 50px;
}

.timeline {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.timeline-item {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: relative;
}

.timeline-item.server {
  border-left: 4px solid #9c27b0;
}

.timeline-item.client {
  border-left: 4px solid #00bcd4;
}

.timeline-point {
  position: absolute;
  top: 25px;
  left: -8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 3px solid;
}

.timeline-item.server .timeline-point {
  border-color: #9c27b0;
}

.timeline-item.client .timeline-point {
  border-color: #00bcd4;
}

.timeline-content ol {
  padding-left: 20px;
  margin: 15px 0;
}

.timeline-content li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.timeline-content li strong {
  color: #1976d2;
}

.best-practices {
  background: #e8f5e9;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 50px;
}

.practice-item {
  background: white;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.practice-item:last-child {
  margin-bottom: 0;
}

.practice-item ul {
  padding-left: 20px;
  margin: 10px 0;
}

.practice-item li {
  margin-bottom: 8px;
}

.demo-section {
  text-align: center;
  padding: 40px;
  background: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 40px;
}

.demo-links {
  margin-top: 20px;
}

.demo-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s ease;
}

.demo-btn:hover {
  background: #1976d2;
}

@media (max-width: 768px) {
  .timeline {
    flex-direction: column;
  }
  
  .timeline-item {
    min-width: 100%;
  }
}
</style>