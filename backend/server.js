const { WebSocketServer } = require('ws');

//cria o servidor WebSocket na porta 8080
const wss = new WebSocketServer({ port: 8080 });

console.log('Servidor WebSocket do iFood rodando na porta 8080...');

wss.on('connection', (ws) => {
  console.log('Nova conexão TCP/WS estabelecida com um cliente.');

  let progresso = 0;

  //envia atualizações de geolocalização a cada 2 segundos
  const intervalo = setInterval(() => {
    progresso += 20;

    if (progresso <= 100) {
      let mensagemLog = '';
      
      if (progresso === 20) mensagemLog = 'Pedido aceito e em preparação';
      if (progresso === 40) font = 'O entregador aceitou a rota e está aguardando a coleta';
      if (progresso === 60) mensagemLog = 'Pedido coletado! Entregador a caminho da sua localização';
      if (progresso === 80) mensagemLog = 'Entregador chegando!';
      if (progresso === 100) mensagemLog = '🛵 Entrega concluída!';

      ws.send(JSON.stringify({
        protocolo: 'WS / Rastreio',
        mensagem: `[Progresso ${progresso}%] ${mensagemLog}`,
        progresso: progresso
      }));
    }

    //ENCERRAMENTO DA CONEXÃO
    if (progresso >= 100) {
      clearInterval(intervalo); 
      
      setTimeout(() => {
        console.log('❌ Fechando conexão com o cliente (Entrega concluída).');
        ws.close(); /
      }, 2000);
    }
  }, 2500); 

  ws.on('close', () => {
    clearInterval(intervalo);
    console.log('🔌 Conexão encerrada pelo cliente ou pelo fluxo finalizado.');
  });
});