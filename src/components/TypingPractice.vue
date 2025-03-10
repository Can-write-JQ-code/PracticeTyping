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
        <div class="text-segment">
          <span 
            v-for="(char, index) in visibleContent" 
            :key="index"
            :class="{
              'typed': index < (currentIndex - currentSegmentStart),
              'current': index === (currentIndex - currentSegmentStart),
              'error': errors[currentSegmentStart + index]
            }"
          >{{ char }}</span>
        </div>
        <div class="segment-info" v-if="totalSegments > 1">
          第 {{ currentSegment + 1 }}/{{ totalSegments }} 段
        </div>
      </div>
      
      <!-- 添加历史输入显示区域 -->
      <div class="history-input">
        <h3>已输入内容</h3>
        <div class="history-text" v-html="historyInputContent"></div>
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
      <div class="actions">
        <button class="btn-secondary" @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
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
    
    // 分段相关的计算属性
    const SEGMENT_SIZE = 200 // 每段显示的字符数
    const totalSegments = computed(() => Math.ceil(practiceContent.value.length / SEGMENT_SIZE))
    const currentSegment = computed(() => Math.floor(currentIndex.value / SEGMENT_SIZE))
    const currentSegmentStart = computed(() => currentSegment.value * SEGMENT_SIZE)
    const visibleContent = computed(() => {
      const start = currentSegmentStart.value
      const end = Math.min(start + SEGMENT_SIZE, practiceContent.value.length)
      return practiceContent.value.slice(start, end)
    })
    
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
    const historyInput = ref('')
    
    const historyInputContent = computed(() => {
      if (!historyInput.value) return ''
      let result = ''
      for (let i = 0; i < historyInput.value.length; i++) {
        const char = historyInput.value[i]
        const expectedChar = practiceContent.value[i]
        if (char === expectedChar) {
          result += `<span class="typed-correct">${char}</span>`
        } else {
          result += `<span class="typed-error">${char}</span>`
        }
      }
      return result
    })
    
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
          
          historyInput.value += char
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
      historyInput.value = ''
      stopTimer()
      
      if (inputRef.value) {
        inputRef.value.focus()
      }
    }
    
    const goBack = () => {
      router.push('/mode-selector')
    }
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    return {
      contentRef,
      inputRef,
      inputText,
      visibleContent,
      currentIndex,
      currentSegmentStart,
      errors,
      time,
      speed,
      accuracy,
      isFinished,
      totalSegments,
      currentSegment,
      modeName,
      historyInput,
      historyInputContent,
      handleInput,
      handleKeyDown,
      restart,
      goBack,
      formatTime
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
  font-size: 1.1rem;
  color: #666;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.practice-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}

.text-segment {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.segment-info {
  text-align: right;
  color: #666;
  font-size: 0.9rem;
}

.typed {
  color: #4CAF50;
  font-weight: bold;
}

.current {
  background-color: #e3f2fd;
  padding: 0 2px;
  border-radius: 2px;
}

.error {
  color: #f44336;
  text-decoration: underline;
  text-decoration-color: #f44336;
}

.input-area {
  margin-bottom: 2rem;
}

input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #2196f3;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
  border: none;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: none;
}

.btn-primary:hover {
  background-color: #1976d2;
}

.btn-secondary:hover {
  background-color: #bdbdbd;
}

.history-input {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.history-text {
  font-size: 1.1rem;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.typed-correct {
  color: #4caf50;
}

.typed-error {
  color: #f44336;
}
</style>