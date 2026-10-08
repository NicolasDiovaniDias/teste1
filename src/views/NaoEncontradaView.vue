<template>
  <section class="px-6 py-28">
    <div class="mx-auto flex max-w-xl flex-col items-start gap-5">
      <p class="text-sm font-bold text-folha">Erro 404</p>
      <h1 class="font-display text-5xl leading-tight font-extrabold tracking-tight">Esta página não existe.</h1>
      <p class="text-lg leading-relaxed text-musgo">O endereço pode ter mudado ou estar digitado errado.</p>
      <div class="flex flex-wrap gap-3">
        <RouterLink :to="{ name: 'inicio' }" class="inline-flex min-h-12 items-center rounded-full bg-floresta px-6 font-bold text-white">
          Ir para o início
        </RouterLink>
        <RouterLink
          :to="{ name: 'consulta' }"
          class="inline-flex min-h-12 items-center rounded-full border-2 border-floresta px-6 font-bold text-floresta"
        >
          Consultar meu bairro
        </RouterLink>
      </div>
    </div>
  </section>
</template>
