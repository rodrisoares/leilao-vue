import axios from 'axios'

export function createLeilao (leilao) {
  leilao = {
    ...leilao,
    finalizado: false,
  };
  return axios.post('http://localhost:3000/leiloes', leilao)
}

export function createLance (leilao_id, valor) {
  const lance = {
    leilao_id: leilao_id,
    valor: valor,
    data: new Date() 
  };

  return axios.post('http://localhost:3000/lances', lance)
    .then(response => {
      return response.data.id
    })
    .catch(error => {
      console.error('Error creating lance:', error)
      throw SyntaxError
    })
}

export function getQuantidadeLances (id) {
  return axios.get('http://localhost:3000/lances/', { params: { leilao_id: id } })
    .then(response => {
      return response.data.length;
    })
}

export function getLeiloes () {
  return axios.get('http://localhost:3000/leiloes')
    .then(response => {
      return response.data
    })
}

export function getLeilao (id) {
  return axios.get(`http://localhost:3000/leiloes/${id}`)
    .then(response => {
      return response.data
    })
}

export function getLances (id) {
  return axios.get('http://localhost:3000/lances/', { params: { leilao_id: id } })
    .then(response => {
      return response.data.map(
        l => {
          l.data = new Date(l.data)
          return l
        }
      )
    })
}

export function finishLeilao (id) {
  return axios.patch(`http://localhost:3000/leiloes/${id}`, { finalizado: true })
}

