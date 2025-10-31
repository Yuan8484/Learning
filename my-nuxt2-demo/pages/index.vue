<template>
  <div>
    <nav class="navbar">
      <nuxt-link to="/" class="link">首页</nuxt-link> 
      <nuxt-link :to="`/user/${1}`" class="link">用户详情</nuxt-link>
      <button @click="login">登录</button>
    </nav>
    
    <div class="content">
      <h2>AsyncData 示例</h2>
      <p>asyncData 方法在组件渲染前执行，可以在服务器端和客户端获取数据</p>
      
      <!-- 执行环境信息 -->
      <div class="environment-info">
        <h3>执行环境信息：</h3>
        <p>本次 asyncData 执行环境：<strong>{{ executionContext }}</strong></p>
        <p>服务器端执行: {{ isServer ? '✓' : '✗' }}</p>
        <p>客户端执行: {{ isClient ? '✓' : '✗' }}</p>
        <p class="tip">提示：刷新页面时，asyncData 会在服务器端执行；通过 nuxt-link 导航时，会在客户端执行</p>
      </div>
      
      <!-- 使用 asyncData 获取的数据 -->
      <div v-if="articles && articles.length > 0">
        <h3>文章列表（通过 asyncData 获取）：</h3>
        <ul class="article-list">
          <li v-for="article in articles" :key="article.id">
            <strong>{{ article.title }}</strong>
            <p>{{ article.content }}</p>
          </li>
        </ul>
      </div>
      
      <div v-else-if="articles !== undefined">
        <p>加载中...</p>
      </div>
      
      <div v-else>
        <p>暂无数据</p>
      </div>
      
      <!-- 本地数据对比 -->
      <div class="comparison">
        <h3>对比：data() 与 asyncData() 渲染机制差异</h3>
        
        <div class="comparison-item">
          <h4>1. data() 方法返回的数据（客户端渲染）</h4>
          <p>{{ localData }}</p>
          <p class="explanation">说明：这段文本只在浏览器执行 Vue 实例初始化后才会显示，在页面源代码中找不到这段文本。</p>
          
          <div class="source-code-tip">
            <strong>实验验证：</strong>
            <ol>
              <li>在浏览器中右键点击页面，选择「查看页面源代码」</li>
              <li>搜索：「这段文本只在客户端渲染」</li>
              <li>结果：<strong>找不到</strong>这段文本，因为它只在客户端 Vue 实例化后才会设置</li>
            </ol>
          </div>
        </div>
        
        <div class="comparison-item">
          <h4>2. asyncData() 方法返回的数据（服务端渲染）</h4>
          <p v-if="executionContext">执行环境：{{ executionContext }}</p>
          
          <div class="source-code-tip">
            <strong>实验验证：</strong>
            <ol>
              <li>在浏览器中右键点击页面，选择「查看页面源代码」</li>
              <li>搜索：「执行环境：服务器端」</li>
              <li>结果：<strong>可以找到</strong>这段文本，因为它在服务器渲染时就已经包含在 HTML 中</li>
            </ol>
          </div>
        </div>
        
        <div class="technical-explanation">
          <h4>技术原理说明：</h4>
          <ul>
            <li><strong>data() 执行时机：</strong>只在 Vue 实例创建时在客户端执行</li>
            <li><strong>asyncData() 执行时机：</strong>在服务器端渲染阶段或客户端导航前执行</li>
            <li><strong>数据序列化：</strong>asyncData 返回的数据会被序列化并注入到 HTML 中</li>
            <li><strong>客户端接管：</strong>页面加载后，Vue 会接管已渲染的 DOM，实现交互功能</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // asyncData 方法在组件实例创建之前调用
  // 它可以访问 Nuxt 上下文对象，但不能访问 this（组件实例）
  // 返回的数据会与组件的 data 合并
  async asyncData({ $axios }) {
    try {
      // 检测执行环境
      const isServer = process.server
      const isClient = process.client
      const executionContext = isServer ? '服务器端' : '客户端'
      console.log(`asyncData 在 ${executionContext} 执行`)
      
      // 模拟异步获取数据
      // 在实际项目中，这里会是真实的 API 调用：
      // const response = await $axios.get('/api/articles')
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 返回模拟数据，包含执行环境信息
      return {
        articles: [
          { id: 1, title: '第一篇文章', content: '这是通过 asyncData 获取的第一篇文章内容' },
          { id: 2, title: '第二篇文章', content: '这是通过 asyncData 获取的第二篇文章内容' },
          { id: 3, title: '第三篇文章', content: '这是通过 asyncData 获取的第三篇文章内容' }
        ],
        executionContext,
        isServer,
        isClient
      }
    } catch (error) {
      console.error('获取文章失败:', error)
      return { articles: [], executionContext: '未知', isServer: false, isClient: false }
    }
  },
  
  data() {
    // 本地数据，只在客户端渲染
    return {
      localData: '这段文本只在客户端渲染，查看页面源代码不会看到',
      // 添加默认值，防止 asyncData 失败时出现 undefined 错误
      articles: [],
      executionContext: '初始化中',
      isServer: false,
      isClient: false
    }
  },
  
  methods: {
    login() {
      // 模拟登录，设置一个假用户
      const fakeUser = { id: 1, name: '测试用户' }
      this.$store.commit('setUser', fakeUser)
    }
  }
}
</script>

<style scoped>
.navbar { padding: 20px; background: #f5f5f5; }
.link { margin-right: 20px; text-decoration: none; }
.content { padding: 20px; }
.environment-info { background: #e8f5e9; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #4caf50; }
.tip { font-style: italic; color: #666; font-size: 0.9em; }
.article-list { list-style: none; padding: 0; }
.article-list li { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
.comparison { margin-top: 30px; padding: 15px; background: #f9f9f9; border: 1px dashed #ccc; }
.comparison-item { margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 4px; border-left: 4px solid #2196f3; }
.explanation { font-style: italic; color: #666; }
.source-code-tip { margin-top: 10px; padding: 10px; background: #f0f8ff; border-radius: 4px; font-size: 0.9em; }
.source-code-tip ol { margin: 10px 0; padding-left: 20px; }
.technical-explanation { margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 4px; }
.technical-explanation h4 { color: #1565c0; }
.technical-explanation ul { margin: 10px 0; padding-left: 20px; }
.technical-explanation li { margin-bottom: 5px; }
</style>