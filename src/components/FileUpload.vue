<template>
  <div class="file-upload-container">
    <div class="file-upload-card">
      <h1>文件上传练习</h1>
      
      <div class="upload-area">
        <input 
          type="file" 
          ref="fileInput"
          @change="handleFileChange"
          accept=".txt"
          class="file-input"
          id="file-input"
        />
        <label for="file-input" class="upload-button">
          <span class="upload-icon">📁</span>
          选择文件
        </label>
      </div>

      <div v-if="fileContent" class="preview-area">
        <div class="file-info">
          <span class="file-name">{{ fileName }}</span>
          <span class="file-size">{{ formatFileSize(fileSize) }}</span>
        </div>
        
        <div class="content-preview">
          <h3>文件预览</h3>
          <div class="preview-text">{{ previewContent }}</div>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="startPractice" :disabled="!fileContent">
            开始练习
          </button>
          <button class="btn-secondary" @click="clearFile">
            清除
          </button>
        </div>
      </div>

      <div v-else class="upload-hint">
        <p>支持上传TXT文本文件</p>
        <p>文件大小不超过1MB</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'FileUpload',
  setup() {
    const store = useStore()
    const router = useRouter()
    const fileInput = ref(null)
    const fileContent = ref('')
    const fileName = ref('')
    const fileSize = ref(0)

    const previewContent = computed(() => {
      if (!fileContent.value) return ''
      return fileContent.value.slice(0, 200) + (fileContent.value.length > 200 ? '...' : '')
    })

    const handleFileChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      // 验证文件类型
      if (file.type !== 'text/plain') {
        alert('请上传TXT文本文件')
        return
      }

      // 验证文件大小（1MB）
      if (file.size > 1024 * 1024) {
        alert('文件大小不能超过1MB')
        return
      }

      fileName.value = file.name
      fileSize.value = file.size

      try {
        const content = await readFileContent(file)
        fileContent.value = content
      } catch (error) {
        alert('读取文件失败：' + error.message)
      }
    }

    const readFileContent = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file)
      })
    }

    const startPractice = () => {
      if (!fileContent.value) return
      
      // 保存文件内容到Vuex并设置模式
      store.commit('setPracticeContent', fileContent.value)
      store.dispatch('selectMode', 'custom')
      // 跳转到练习页面
      router.push('/typing-practice')
    }

    const clearFile = () => {
      fileContent.value = ''
      fileName.value = ''
      fileSize.value = 0
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    return {
      fileInput,
      fileContent,
      fileName,
      fileSize,
      previewContent,
      handleFileChange,
      startPractice,
      clearFile,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.file-upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.file-upload-card {
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

.upload-area {
  text-align: center;
  margin-bottom: 2rem;
}

.file-input {
  display: none;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #45a049;
}

.upload-icon {
  font-size: 1.5rem;
}

.preview-area {
  margin-top: 2rem;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.file-name {
  font-weight: bold;
  color: #333;
}

.file-size {
  color: #666;
}

.content-preview {
  margin: 1.5rem 0;
}

.content-preview h3 {
  margin-bottom: 1rem;
  color: #333;
}

.preview-text {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  padding: 0.75rem 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}

.upload-hint {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}

.upload-hint p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
</style>