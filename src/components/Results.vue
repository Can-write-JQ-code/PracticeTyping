<template>
  <div class="results-container">
    <div class="results-card">
      <h1>练习结果</h1>
      
      <div class="results-summary">
        <div class="result-item">
          <div class="result-icon">🚀</div>
          <div class="result-label">打字速度</div>
          <div class="result-value">{{ practiceResults.speed }} 字/分</div>
        </div>
        <div class="result-item">
          <div class="result-icon">✓</div>
          <div class="result-label">准确率</div>
          <div class="result-value">{{ practiceResults.accuracy }}%</div>
        </div>
        <div class="result-item">
          <div class="result-icon">⏱️</div>
          <div class="result-label">用时</div>
          <div class="result-value">{{ formatTime(practiceResults.time) }}</div>
        </div>
      </div>
      
      <div class="performance-analysis">
        <h2>表现分析</h2>
        <div class="analysis-content">
          <p v-if="practiceResults.speed > 60">您的打字速度非常快！继续保持！</p>
          <p v-else-if="practiceResults.speed > 30">您的打字速度不错，继续练习可以更快！</p>
          <p v-else>多加练习可以提高您的打字速度。</p>
          
          <p v-if="practiceResults.accuracy > 95">您的准确率非常高！</p>
          <p v-else-if="practiceResults.accuracy > 85">您的准确率不错，注意减少错误可以更好！</p>
          <p v-else>注意提高准确率，慢一点打可能会更准确。</p>
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-primary" @click="startNewPractice">开始新练习</button>
        <button class="btn-secondary" @click="goBack">返回选择</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'TypingResults',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const practiceResults = computed(() => store.getters.practiceResults)
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    const startNewPractice = () => {
      router.push('/typing-practice')
    }
    
    const goBack = () => {
      router.push('/mode-selector')
    }
    
    return {
      practiceResults,
      formatTime,
      startNewPractice,
      goBack
    }
  }
}
</script>

<style scoped>
.results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.results-card {
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

h2 {
  color: #333;
  margin-bottom: 1rem;
}

.results-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.result-item {
  flex: 1;
  text-align: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 0 0.5rem;
}

.result-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.result-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.performance-analysis {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.analysis-content p {
  margin-bottom: 0.5rem;
  color: #333;
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
</style>