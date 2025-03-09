<template>
  <div class="typing-practice-container">
    <div class="typing-practice-card">
      <div class="header">
        <h1>打字练习</h1>
        <div class="mode-info">当前模式：{{ modeName }}</div>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-label">速度</div>
          <div class="stat-value">{{ speed }} 字/分</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">准确率</div>
          <div class="stat-value">{{ accuracy }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">时间</div>
          <div class="stat-value">{{ formatTime(time) }}</div>
        </div>
      </div>
      
      <div class="practice-content" ref="contentRef">
        <span 
          v-for="(char, index) in practiceContent" 
          :key="index"
          :class="{
            'typed': index < currentIndex,
            'current': index === currentIndex,
            'error': errors[index]
          }"
        >{{ char }}</span>
      </div>
      
      <div class="input-area">
        <input 
          type="text" 
          ref="inputRef"
          v-model="inputText"
          @input="handleInput"
          @keydown="handleKeyDown"
          :disabled="isFinished"
          placeholder="点击此处开始打字..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'TypingPractice',
  setup() {
    const store = useStore()
    const router = useRouter()
    const contentRef = ref(null)
    const inputRef = ref(null)
    
    const practiceContent = computed(() => store.getters.practiceContent || '')
    const selectedMode = computed(() => store.getters.selectedMode)
    
    const modeName = computed(() => {
      switch(selectedMode.value) {
        case 'chinese': return '中文'
        case 'english': return '英文'
        case 'wubi': return '五笔'
        case 'custom': return '自定义'
        default: return '未知'
      }
    })
    
    const inputText = ref('')
    const currentIndex = ref(0)
    const errors = ref({})
    const startTime = ref(null)
    const time = ref(0)
    const timer = ref(null)
    const isFinished = ref(false)
    
    const speed = computed(() => {
      if (time.value === 0) return 0
      return Math.round((currentIndex.value / (time.value / 60)) * 10) / 10
    })
    
    const accuracy = computed(() => {
      if (currentIndex.value === 0) return 100
      const errorCount = Object.values(errors.value).filter(Boolean).length
      return Math.round(((currentIndex.value - errorCount) / currentIndex.value) * 100)
    })
    
    const startTimer = () => {
      if (!startTime.value) {
        startTime.value = Date.now()
      }
      
      timer.value = setInterval(() => {
        time.value = Math.floor((Date.now() - startTime.value) / 1000)
      }, 1000)
    }
    
    const stopTimer = () => {
      if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
      }
    }
    
    const handleInput = () => {
      if (!practiceContent.value) return
      
      if (!startTime.value) {
        startTimer()
      }
      
      const input = inputText.value
      if (input.length > 0) {
        // 处理多字输入
        for (let i = 0; i < input.length; i++) {
          const char = input[i]
          const expectedChar = practiceContent.value[currentIndex.value]
          
          if (char === expectedChar) {
            errors.value[currentIndex.value] = false
            currentIndex.value++
          } else {
            errors.value[currentIndex.value] = true
            currentIndex.value++ // 即使输入错误也前进到下一个字符
          }
          
          // 检查是否完成
          if (currentIndex.value >= practiceContent.value.length) {
            finishPractice()
            break
          }
        }
        
        inputText.value = ''
      }
    }
    
    const finishPractice = () => {
      stopTimer()
      isFinished.value = true
      
      store.dispatch('saveResults', {
        speed: speed.value,
        accuracy: accuracy.value,
        time: time.value
      })
      
      router.push('/results')
    }
    
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isFinished.value) {
        restart()
      }
    }
    
    const restart = () => {
      inputText.value = ''
      currentIndex.value = 0
      errors.value = {}
      startTime.value = null
      time.value = 0
      isFinished.value = false
      stopTimer()
      
      if (inputRef.value) {
        inputRef.value.focus()
      }
    }
    
    const goBack = () => {
      router.push('/mode-selector')
    }
    
    onMounted(() => {
      // 如果没有练习内容，返回模式选择页面
      if (!practiceContent.value) {
        router.push('/mode-selector')
        return
      }
      
      // 聚焦输入框
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
    
    onUnmounted(() => {
      stopTimer()
    })
    
    return {
      practiceContent,
      modeName,
      inputText,
      currentIndex,
      errors,
      time,
      speed,
      accuracy,
      isFinished,
      contentRef,
      inputRef,
      handleInput,
      handleKeyDown,
      restart,
      goBack,
      formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
    }
  }
}
</script>

<style scoped>
.typing-practice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.typing-practice-card {
  width: 800px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  color: #333;
}

.mode-info {
  font-size: 1rem;
  color: #666;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.practice-content {
  font-size: 1.25rem;
  line-height: 1.6;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  min-height: 200px;
  white-space: pre-wrap;
  word-break: break-all;
}

.practice-content span {
  position: relative;
}

.practice-content span.typed {
  color: #4CAF50;
}

.practice-content span.current {
  background-color: rgba(76, 175, 80, 0.2);
  border-bottom: 2px solid #4CAF50;
}

.practice-content span.error {
  color: #f44336;
  text-decoration: underline;
  text-decoration-color: #f44336;
}

.input-area {
  margin-bottom: 1.5rem;
}

.input-area input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.btn-primary:hover {
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

.result-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.result-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 80%;
}

.result-card h2 {
  margin-top: 0;
  color: #4CAF50;
  margin-bottom: 1.5rem;
}

.result-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.result-stat {
  text-align: center;
}

.result-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.keyboard-hint {
  margin: 1rem 0;
  font-size: 1.1rem;
  background-color: #f0f0f0;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.next-key {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  margin-left: 0.5rem;
}


.file-upload-area {
  margin: 20px 0;
  text-align: center;
}

.upload-btn, .start-btn {
  padding: 10px 20px;
  margin: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.upload-btn:hover, .start-btn:hover {
  background-color: #45a049;
}

.file-info {
  margin: 10px 0;
  color: #666;
}

.file-preview {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.preview-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: white;
  white-space: pre-wrap;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
}
</style>