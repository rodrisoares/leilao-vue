<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <Leilao :leilao="leilao" @leilao-finalizado="leilaoFinalizado = true" />
        <Lance ref="novoLance" :lanceMinimo="valorMinimoDoLance" v-on:novo-lance="onNovoLance" v-if="!leilaoFinalizado"/>
        <div class="row mb-4 lances" v-if="existemLances && !leilaoFinalizado">
          <div class="col-6">
            <div class="menor-lance shadow p-3 bg-white rounded">Menor lance: <strong>R$ {{ menorLance }}</strong></div>
          </div>
          <div class="col-6">
            <div class="maior-lance shadow p-3 bg-white rounded">Maior lance: <strong>R$ {{ maiorLance }}</strong></div>
          </div>
        </div>
        <div class="card bg-light mb-3">
          <div class="card-body" v-if="leilaoFinalizado">
            <h5 class="card-title"><strong>Leilão Finalizado!</strong></h5>
            <h5 class="card-title">Lance final: <strong>R$ {{ maiorLance }}</strong></h5>
          </div>
        </div>
        <div class="">
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-dark" @click="voltarInicio()">Voltar</button>
            <button type="button" class="btn btn-info ml-3" @click="finalizarLeilao()" v-if="!leilaoFinalizado">Finalizar Leilão</button>
          </div>
        </div>
      </div>
      <div class="col-4">
        <h4>Histórico</h4>
        <div class="list-inline-item p-3 font-weight-bold"> Lances: {{ lances.length }}</div>
        <div class="alert alert-dark" role="alert" v-if="!existemLances">
          Ainda não existem lances para esse leilão!
        </div>
        <div class="shadow p-3 mb-5 bg-white rounded" v-for="lance in lances" :key="lance.valor">
          <ul class="list-inline m-0">
            <li class="list-inline-item">Data: <strong>{{ lance.data.toLocaleString() }}</strong></li>
            <li class="list-inline-item">Valor: <strong>R$ {{ lance.valor }}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Leilao from '@/components/Leilao'
import Lance from '@/components/Lance'
import { getLeilao, getLances, createLance, finishLeilao  } from '@/http'
import router from '@/router'
export default {
  props: ['id'],
  components: {
    Leilao,
    Lance
  },
  computed: {
    existemLances () {
      return this.lances.length > 0
    },
    maiorLance () {
      return Math.max(...this.lances.map(l => l.valor)) || 0
    },
    menorLance () {
      return Math.min(...this.lances.map(l => l.valor)) || 0
    },
    valorMinimoDoLance () {
      if (!this.existemLances) {
        return parseInt(this.leilao.lanceInicial) || 0
      }
      return parseInt(this.maiorLance)
    }
  },
  data () {
    return {
      leilao: {},
      lances: [],
      quantidadeLances: 0,
      leilaoFinalizado: false
    }
  },
  methods: {
    async carregarLeilao () {
      this.leilao = await getLeilao(this.id)
      this.leilaoFinalizado = this.leilao.finalizado
      if (this.leilaoFinalizado) {
        this.$root.$emit('finalizar-leilao')
      }
    },
    async carregarLances () {
      this.lances = await getLances(this.id)
    },
    onNovoLance (valor) {
      if (!this.leilaoFinalizado) {
        const lance = {
          valor: valor,
          data: new Date(),
          leilao_id:this.id,
        }
        createLance(this.leilao.id,  valor)
        .then(() => this.carregarLances())
        this.quantidadeLances++
        this.$root.$emit('novo-lance', { id: this.id, quantidadeLances: this.lances.length}) 
      }
    },
    voltarInicio () {
      router.push('/') 
    },
    async finalizarLeilao () {
      await finishLeilao(this.id)
      this.$root.$emit('finalizar-leilao')
      this.leilaoFinalizado = true
    },
  },
  mounted () {
    this.carregarLeilao()
    this.carregarLances()
    if (this.leilao.finalizado) {
      this.leilaoFinalizado = true
    }
  }
}
</script>
