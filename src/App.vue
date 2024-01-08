<template>
  <div id="app">
    <div
      class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow"
    >
    <h1>Leilões Vue</h1>
    </div>
    <router-link class="btn btn-outline-primary p-3 px-md-4 ml-4" to="/">Listar Leilões</router-link>
      <router-link class="btn btn-outline-info p-3 px-md-4 ml-4" to="/leilao">Novo leilão</router-link>
    <router-view />
  </div>
</template>
