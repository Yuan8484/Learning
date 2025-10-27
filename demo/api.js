// 获取页面元素
const btn = document.getElementById('btn');
const result = document.getElementById('result');

// 按钮点击事件
btn.addEventListener('click', () => {
  result.textContent = '按钮被点击了！';
  result.style.color = '#e53935';
});