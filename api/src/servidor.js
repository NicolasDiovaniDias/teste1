import { criarApp } from './app.js'
import { config } from './config.js'

criarApp().listen(config.porta, () => {
  console.log(`API da COOVIR rodando em http://localhost:${config.porta}`)
})
