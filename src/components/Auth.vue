<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>打字练习网站</h1>
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'login' }" 
          @click="activeTab = 'login'"
        >
          登录
        </button>
        <button 
          :class="{ active: activeTab === 'register' }" 
          @click="activeTab = 'register'"
        >
          注册
        </button>
      </div>
      
      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input 
            type="text" 
            id="login-username" 
            v-model="loginForm.username" 
            required
          />
        </div>
        <div class="form-group">
          <label for="login-password">密码</label>
          <input 
            type="password" 
            id="login-password" 
            v-model="loginForm.password" 
            required
          />
        </div>
        <button type="submit" class="btn-primary">登录</button>
      </form>
      
      <!-- 注册表单 -->
      <form v-if="activeTab === 'register'" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input 
            type="text" 
            id="register-username" 
            v-model="registerForm.username" 
            required
          />
        </div>
        <div class="form-group">
          <label for="register-email">邮箱</label>
          <input 
            type="email" 
            id="register-email" 
            v-model="registerForm.email" 
            required
          />
        </div>
        <div class="form-group">
          <label for="register-password">密码</label>
          <input 
            type="password" 
            id="register-password" 
            v-model="registerForm.password" 
            required
          />
        </div>
        <div class="form-group">
          <label for="register-confirm-password">确认密码</label>
          <input 
            type="password" 
            id="register-confirm-password" 
            v-model="registerForm.confirmPassword" 
            required
          />
        </div>
        <button type="submit" class="btn-primary">注册</button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'UserAuth',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const activeTab = ref('login')
    const errorMessage = ref('')
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const handleLogin = () => {
      // 清除错误信息
      errorMessage.value = ''
      
      // 简单的表单验证
      if (!loginForm.username || !loginForm.password) {
        errorMessage.value = '请填写所有字段'
        return
      }
      
      // 调用Vuex的登录action
      store.dispatch('login', {
        username: loginForm.username,
        password: loginForm.password
      })
      
      // 登录成功后跳转到模式选择页面
      router.push('/mode-selector')
    }
    
    const handleRegister = () => {
      // 清除错误信息
      errorMessage.value = ''
      
      // 简单的表单验证
      if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
        errorMessage.value = '请填写所有字段'
        return
      }
      
      if (registerForm.password !== registerForm.confirmPassword) {
        errorMessage.value = '两次输入的密码不一致'
        return
      }
      
      // 在实际应用中，这里应该调用API进行注册
      // 这里简单模拟注册成功
      store.dispatch('login', {
        username: registerForm.username,
        email: registerForm.email
      })
      
      // 注册成功后跳转到模式选择页面
      router.push('/mode-selector')
    }
    
    return {
      activeTab,
      loginForm,
      registerForm,
      errorMessage,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auth-card {
  width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
}

.tabs button.active {
  color: #4CAF50;
  border-bottom: 2px solid #4CAF50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #45a049;
}

.error-message {
  color: #f44336;
  margin-top: 1rem;
  text-align: center;
}
</style>