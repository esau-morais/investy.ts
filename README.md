# Descrição

Uma corretora de ações está desenvolvendo um sistema para permitir que pequenos investidores possam tomar decisões melhores sobre seu portfólio. Uma das funcionalidades importantes é a de verificar o desempenho de uma ação em cinco cenários:

   - Preço atual;
   - Preço histórico;
   - Preço atual em comparação a outras ações;
   - Projeção de ganhos com compra em data específica.

Para isso, a equipe de software da empresa optou por desenvolver duas aplicações: um serviço de backend especializado nesses requisitos (que permitirá que essas funcionalidades sejam reutilizadas em outros produtos da empresa) e um dashboard configurável que dará visibilidade aos dados. Sua missão para este teste é implementar o frontend dessas partes.

A ideia é implementar algo simples, sem preocupações com dividendos, taxas administrativas ou outras incumbências que afetariam o montante total. Em sendo assim, pressuponha que a compradora investiu seu dinheiro numa determinada quantidade de ações de uma empresa em alguma data no passado, e que deseja saber quanto teria ganhado ou perdido caso o fizesse.

# Requisitos técnicos da solução

- O serviço deverá ser implementado via HTTP, e o formato de serialização das requisições e respostas será JSON.
- O frontend deverá ser um SPA(Single-Page Application) com o framework de sua escolha(React, Vue, Angular).
- O backend já está desenvolvido, você precisará apenas criar o frontend e fazer a conexão entre as duas plataformas. Mas caso queira criar um backend também, fique à vontade.
- Sua solução deverá ter testes automatizados.
- Para obter dados de ações no backend, você poderá adquirir uma API_KEY gratuita no Alpha Vantage (https://www.alphavantage.co).
- Ao final do desafio você deve enviar prints das telas funcionando.
- O tratamento de erros não será explicitado nos endpoints. O candidato ou candidata poderá inferir casos que poderão gerar erros ou duplicidades nos dados, e tratá-los de acordo. A ausência de tratamento não desqualifica a proposta; a presença, no entanto, contará pontos a favor.

# Como enviar sua proposta

- Clone esse repositório (Você pode utilizar o backend que ja está desenvolvido);
- Implemente sua solução, fazendo commits da maneira que faria em um projeto profissional;
- Substitua este README com um específico para sua aplicação, indicando como rodá-la, e como executar os testes (fique à vontade para inserir mais detalhes técnicos, caso deseje, isso conta pontos à favor);
- Nos envie o link do seu desafio finalizado, juntamente com os prints de tela.