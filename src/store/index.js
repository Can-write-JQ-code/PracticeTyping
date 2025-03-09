import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    selectedMode: null,
    practiceContent: null,
    practiceResults: {
      speed: 0,
      accuracy: 0,
      time: 0
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    setMode(state, mode) {
      state.selectedMode = mode
    },
    setPracticeContent(state, content) {
      state.practiceContent = content
    },
    setPracticeText(state, content) {
      state.practiceContent = content
    },
    updateResults(state, results) {
      state.practiceResults = results
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    }
  },
  actions: {
    login({ commit }, userData) {
      // 这里可以添加实际的登录API调用
      // 模拟登录成功
      commit('setUser', userData)
    },
    selectMode({ commit }, mode) {
      commit('setMode', mode)
    },
    loadPracticeContent({ commit }, mode) {
      // 根据选择的模式加载练习内容
      let content = ''
      
      switch(mode) {
        case 'chinese':
          content = '这是一段中文打字练习文本，用于提高您的中文输入速度和准确率。'
          break
        case 'english':
          content = 'This is an English typing practice text to improve your typing speed and accuracy.'
          break
        case 'wubi':
          content = '五笔字型输入法练习文本，帮助您熟悉五笔字型的输入规则和提高输入速度。'
          break
        default:
          content = '默认打字练习文本。'
      }
      
      commit('setPracticeContent', content)
    },
    saveResults({ commit }, results) {
      // 保存练习结果
      commit('updateResults', results)
    },
    logout({ commit }) {
      commit('logout')
    }
  },
  getters: {
    isLoggedIn: state => state.isAuthenticated,
    currentUser: state => state.user,
    selectedMode: state => state.selectedMode,
    practiceContent: state => state.practiceContent,
    practiceResults: state => state.practiceResults
  }
})