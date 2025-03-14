import { createStore } from 'vuex'

export default createStore({
  state: {
    selectedMode: null,
    practiceContent: null,
    practiceResults: {
      speed: 0,
      accuracy: 0,
      time: 0
    },
    lastUsedText: null
  },
  mutations: {
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
    setLastUsedText(state, text) {
      state.lastUsedText = text
    }
  },
  actions: {
    selectMode({ commit }, mode) {
      commit('setMode', mode)
    },
    loadPracticeContent({ commit, state }, payload) {
      let content = ''
      
      const mode = typeof payload === 'object' ? payload.mode : payload
      const customText = typeof payload === 'object' ? payload.customText : ''
      
      if (customText && customText.trim()) {
        content = customText.trim()
      } else {
        const getRandomText = (texts) => {
          let availableTexts = texts.filter(text => text !== state.lastUsedText)
          if (availableTexts.length === 0) {
            availableTexts = texts
          }
          const randomIndex = Math.floor(Math.random() * availableTexts.length)
          return availableTexts[randomIndex]
        }
        
        const chineseTexts = [
          `机遇：人生转折的关键
在人生的漫漫长路中，机遇宛如璀璨星辰，偶然划过命运的天空，瞬间点亮前行的方向，成为改变人生轨迹的关键因素。它总是以一种神秘而又捉摸不定的姿态出现，给人们带来意想不到的转折与可能。
古往今来，无数实例都在印证着机遇对人生的重大影响。秦末，民不聊生，陈胜只是一介雇农，却在大泽乡遇雨失期、按律当斩的绝境下，敏锐地抓住了这个改变命运的机遇。他高呼 "王侯将相宁有种乎"，振臂一呼，揭竿而起，点燃了反秦的烽火，成为中国历史上第一次农民起义的领袖。这一机遇不仅改变了陈胜个人的命运，更是对中国历史的发展进程产生了深远影响。`,
          `自信之光，照亮前行之路
自信，宛如璀璨星辰，在人生浩瀚夜空中熠熠生辉；又似强劲春风，能吹散心头的阴霾，赋予我们前行的力量。它不是与生俱来的天赋，而是在生活磨砺中逐渐铸就的品质，对我们的成长与发展起着至关重要的作用。
回顾历史长河，诸多仁人志士凭借自信成就非凡。著名科学家伽利略，在当时亚里士多德的理论被奉为圭臬的情况下，敢于质疑权威。他坚信通过自己严谨的实验和理性的思考得出的结论，于是在比萨斜塔上进行了著名的自由落体实验，用事实证明了不同重量的物体在同一高度同时下落会同时着地，打破了人们长久以来的错误认知。`,
          `沁园春·雪
北国风光，千里冰封，万里雪飘。
望长城内外，惟余莽莽；大河上下，顿失滔滔。
山舞银蛇，原驰蜡象，欲与天公试比高。
须晴日，看红装素裹，分外妖娆。
江山如此多娇，引无数英雄竞折腰。
惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。
一代天骄，成吉思汗，只识弯弓射大雕。
俱往矣，数风流人物，还看今朝。`
        ]
        
        const englishTexts = [
          `In the long journey of life, opportunity is like a bright star, occasionally streaking across the sky of fate, instantly illuminating the way forward and becoming a crucial factor that can change the trajectory of life. It always appears in a mysterious and elusive manner, bringing unexpected twists and possibilities to people.

Throughout history, numerous examples have testified to the significant impact of opportunity on life. During the late Qin Dynasty, when the people were suffering from harsh living conditions, Chen Sheng was just a hired farmhand. However, when faced with the desperate situation of missing the due date due to rain in Daze Township and being sentenced to death according to the law, he keenly grasped this opportunity to change his fate.`,
          `In the bustling corporate world, Tom found himself in a state of deep regret. He was a hard-working employee in a mid-sized company, who had long been dreaming of career advancement.

Tom had been with the company for several years. His work was solid, but he was rather introverted and hesitant. One day, a golden opportunity for promotion presented itself. The company was planning to launch a new major project, and they were looking for a team leader. Tom's skills and experience made him a suitable candidate. However, when the call for applications was announced, self-doubt crept in.`,
          `Life is a journey of continuous learning and growth, where every challenge presents an opportunity for improvement. Success comes to those who are prepared to seize the moment when opportunity presents itself. The path to achievement is often paved with dedication, perseverance, and the courage to embrace change.

In today's rapidly evolving world, adaptability has become more crucial than ever. Those who remain flexible in their approach and maintain a growth mindset are better positioned to recognize and capitalize on opportunities when they arise.`
        ]
        
        switch(mode) {
          case 'chinese':
          case 'wubi':
            content = getRandomText(chineseTexts)
            break
          case 'english':
            content = getRandomText(englishTexts)
            break
          default:
            content = '默认打字练习文本。'
        }
      }
      
      commit('setPracticeContent', content)
      commit('setLastUsedText', content)
    },
    saveResults({ commit }, results) {
      commit('updateResults', results)
    }
  },
  getters: {
    selectedMode: state => state.selectedMode,
    practiceContent: state => state.practiceContent,
    practiceResults: state => state.practiceResults
  }
})