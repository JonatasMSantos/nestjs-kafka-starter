## Microserviço com Nestjs + Kafka

### Fluxo

1. Orders publica mensagem no Kafka

2. Payments consome mensagem do Kafka (pagamento realizado)

3. Payments processou o pagamento

4. Payments publicou mensagem no Kafka

5. Orders consome mensagem no Kafka (pagamento realizado)

6. Orders altera o status do pedido