<template>
  <div class="mode-selector-container">
    <div class="mode-selector-card">
      <h1>选择练习模式</h1>
      <div class="mode-options">
        <div 
          class="mode-option" 
          :class="{ active: selectedMode === 'chinese' }"
          @click="selectMode('chinese')"
        >
          <h2>中文</h2>
          <p>练习中文打字，提高中文输入速度</p>
        </div>
        <div 
          class="mode-option" 
          :class="{ active: selectedMode === 'english' }"
          @click="selectMode('english')"
        >
          <h2>英文</h2>
          <p>练习英文打字，提高英文输入速度</p>
        </div>
        <div 
          class="mode-option" 
          :class="{ active: selectedMode === 'wubi' }"
          @click="selectMode('wubi')"
        >
          <h2>五笔</h2>
          <p>练习五笔打字，熟悉五笔输入法</p>
        </div>
      </div>
      
      <div class="custom-text-section" v-if="selectedMode">
        <h3>自定义练习文本（可选）</h3>
        <textarea
          v-model="customText"
          placeholder="在此输入或粘贴您想要练习的文本内容..."
          rows="4"
          class="custom-text-input"
        ></textarea>
      </div>

      <div class="actions">
        <button 
          class="btn-primary" 
          @click="startPractice"
          :disabled="!selectedMode"
        >
          开始练习
        </button>
        <button class="btn-primary" @click="goToFileUpload">
          文件上传练习
        </button>
        <button class="btn-secondary" @click="logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ModeSelector',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const selectedMode = ref('')
    const customText = ref('')
    
    const selectMode = (mode) => {
      selectedMode.value = mode
    }
    
    const startPractice = () => {
      if (selectedMode.value) {
        // 保存选择的模式到Vuex
        store.dispatch('selectMode', selectedMode.value)
        // 加载对应模式的练习内容，同时传入自定义文本
        store.dispatch('loadPracticeContent', {
          mode: selectedMode.value,
          customText: customText.value
        })
        // 跳转到打字练习页面
        router.push('/typing-practice')
      }
    }
    
    const logout = () => {
      store.dispatch('logout')
      router.push('/auth')
    }

    const goToFileUpload = () => {
      router.push('/file-upload')
    }
    
    return {
      selectedMode,
      customText,
      selectMode,
      startPractice,
      logout,
      goToFileUpload
    }
  }
}
</script>

<style scoped>
.mode-selector-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.mode-selector-card {
  width: 800px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.mode-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.mode-option {
  flex: 1;
  margin: 0 1rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.mode-option.active {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
}

.mode-option h2 {
  margin-bottom: 0.5rem;
  color: #333;
}

.mode-option p {
  color: #666;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-primary {
  padding: 0.75rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-secondary {
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}

.custom-text-section {
  margin: 2rem 0;
  text-align: left;
}

.custom-text-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.custom-text-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.5;
}

.custom-text-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
</style>