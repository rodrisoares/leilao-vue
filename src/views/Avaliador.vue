<template>
  <div class="container">
    <h1 class="m-3">Leilões em aberto</h1> 
    <div class="row">
      <div class="col-4 leiloes" v-for="leilao in leiloes" :key="leilao.id">
        <div class="leilao card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">{{ leilao.produto }}</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title">R${{ leilao.lanceInicial }} <small class="text-muted">/ {{ leilao.quantidadeLances }}  lances</small></h1>

            <ul class="list-unstyled mt-3 mb-4">
              <li>{{ leilao.descricao }}</li>
            </ul>
            <router-link class="btn btn-lg btn-block btn-outline-primary" :to="`leiloar/${leilao.id}`">Acessar leilão</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLeiloes, getQuantidadeLances } from '@/http'
export default {
  data () {
    return {
      leiloes: []
    }
  },
  async mounted () {
    const leiloesData = await getLeiloes()
    this.leiloes = await Promise.all(leiloesData.map(async leilao => {
      const quantidadeLances = await getQuantidadeLances(leilao.id);
      return { ...leilao, quantidadeLances };
    }));
  },
}
</script>

<style>
</style>
