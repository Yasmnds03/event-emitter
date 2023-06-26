import { coinEmitter } from './emitters/coin_emitter.js'
import { openDB } from './config/db.js'
import { CREATE_TABLE_BTC_VALUE, INSERT_BTC_READ, SELECT_AVG_PRICE } from './config/queries.js'

console.log('Iniciando leituras...')

/**
 * Formatador capaz de formatar um número
 * no padrão de moeda brasileiro.
 */
const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'usd',
})



/**
 * Listener que é acionado toda vez que
 * o coin emitter emite o preço atual
 * do Bitcoin.
 */
coinEmitter.on('btc_read', (price) => {

  const time = new Date().toISOString()
  const formattedPrice = moneyFormatter.format(price)
  console.log(`Preço do Bitcoin em ${time} -> U$ ${formattedPrice}`)

  /**
   * Abaixo, crie o código necessário para salvar
   * o novo preço lido do Bitcoin na tabela btc_value.
   * Após, crie o código necessário para executar uma
   * consulta na tabela btc_value que retorne o valor
   * médio do Bitcoin desde a primeira leitura.
   */
    ;(async () => {
      const db = await openDB()

      db.run(CREATE_TABLE_BTC_VALUE)

      db.run(INSERT_BTC_READ, [time, price], (err) => {
        if (err) {
          console.error('Erro ao inserir o preço do Bitcoin:', err)
        }
      })
  
      db.get(SELECT_AVG_PRICE, (err, row) => {
        if (err) {
          console.error('Erro ao obter o valor médio do Bitcoin:', err)
        }
        const averagePrice = row['average_price']
        const formattedAveragePrice = moneyFormatter.format(averagePrice)
        console.log(`Valor médio do Bitcoin: U$ ${formattedAveragePrice}`)
      })
    })()
})


/**
 * Observação final:
 *
 * Implemente este script de tal forma que,
 * caso ele seja interrompido e posteriormente
 * executado novamente, não haja problemas
 * de conflito de chaves primárias na tabela
 * btc_value.
 */


process.on('exit', () => {
  db.close()
})
