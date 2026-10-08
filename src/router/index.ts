import { createRouter, createWebHistory } from 'vue-router'
import { empresa } from '@/config'
import LayoutPublico from '@/layouts/LayoutPublico.vue'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

// Campos extras que cada rota pode ter em "meta"
declare module 'vue-router' {
  interface RouteMeta {
    titulo?: string
    requerLogin?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutPublico,
      children: [
        { path: '', name: 'inicio', component: HomeView },
        {
          path: 'consulta',
          name: 'consulta',
          // Carrega a página só quando alguém entra nela (deixa a home mais leve)
          component: () => import('@/views/ConsultaView.vue'),
          meta: { titulo: 'Consultar coleta no meu bairro' },
        },
        {
          path: 'noticias',
          name: 'noticias',
          component: () => import('@/views/NoticiasView.vue'),
          meta: { titulo: 'Notícias' },
        },
        {
          path: 'noticias/:id',
          name: 'noticia',
          component: () => import('@/views/NoticiaView.vue'),
          props: true, // o :id da URL chega no componente como prop
          meta: { titulo: 'Notícias' },
        },
        {
          path: ':caminho(.*)*',
          name: 'nao-encontrada',
          component: () => import('@/views/NaoEncontradaView.vue'),
          meta: { titulo: 'Página não encontrada' },
        },
      ],
    },
    {
      path: '/admin/entrar',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { titulo: 'Entrar na área restrita' },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/LayoutAdmin.vue'),
      meta: { requerLogin: true }, // vale para todas as páginas do painel
      children: [
        { path: '', name: 'painel', redirect: { name: 'admin-bairros' } },
        {
          path: 'bairros',
          name: 'admin-bairros',
          component: () => import('@/views/PainelBairrosView.vue'),
          meta: { titulo: 'Painel: bairros e turnos' },
        },
        {
          path: 'noticias',
          name: 'admin-noticias',
          component: () => import('@/views/PainelNoticiasView.vue'),
          meta: { titulo: 'Painel: notícias' },
        },
      ],
    },
  ],
  scrollBehavior(para, de, posicaoSalva) {
    if (posicaoSalva) return posicaoSalva
    if (para.hash) return { el: para.hash, top: 16 }
    // Só mudou a busca na mesma página (?bairro=...): não pula para o topo
    if (para.path === de.path) return false
    return { top: 0 }
  },
})

// Protege o painel: sem login, manda para a tela de entrar
router.beforeEach(async (para) => {
  const auth = useAuthStore()
  // Na primeira navegação, pergunta ao servidor se já existe uma sessão aberta
  await auth.verificar()
  if (para.meta.requerLogin && !auth.logado) {
    return { name: 'login', query: { voltar: para.fullPath } }
  }
  if (para.name === 'login' && auth.logado) {
    return { name: 'painel' }
  }
})

router.afterEach((para) => {
  document.title = para.meta.titulo ? `${para.meta.titulo} | ${empresa.nome}` : `Coleta seletiva | ${empresa.nome}`
})

export default router
