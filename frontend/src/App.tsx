import React, { useState, useEffect } from 'react';

interface LogRede {
  protocolo: string;
  mensagem: string;
  tipo: 'envio' | 'sucesso' | 'info';
}

export default function App() {
  const [etapa, setEtapa] = useState<'inicio' | 'logado' | 'pedido_feito'>('inicio');
  const [logs, setLogs] = useState<LogRede[]>([]);
  const [posicaoEntregador, setPosicaoEntregador] = useState(0);

  //logs com atraso (simulando a rede)
  const adicionarLog = (protocolo: string, mensagem: string, tipo: 'envio' | 'sucesso' | 'info', delay: number) => {
    setTimeout(() => {
      setLogs((prev) => [...prev, { protocolo, mensagem, tipo }]);
    }, delay);
  };

  const handleLogin = () => {
    setLogs([]); //limpa logs anteriores
    
    //simulação do fluxo de rede
    adicionarLog('DHCP', 'Solicitando IP local... IP atribuído: 192.168.0.15', 'info', 0);
    adicionarLog('NAT', 'Traduzindo IP privado 192.168.0.15 para IP público 187.54.21.9', 'info', 500);
    adicionarLog('TCP', 'Iniciando Handshake: Enviando SYN...', 'envio', 1000);
    adicionarLog('TCP', 'SYN-ACK recebido do servidor do iFood.', 'sucesso', 1300);
    adicionarLog('TCP', 'Enviando ACK. Conexão TCP estabelecida!', 'envio', 1500);
    adicionarLog('HTTP', 'POST /auth/login HTTP/1.1 - Enviando credenciais...', 'envio', 2000);
    adicionarLog('HTTP', 'HTTP/1.1 200 OK - Token de sessão gerado.', 'sucesso', 2500);

    setTimeout(() => setEtapa('logado'), 2600);
  };

  const handleFazerPedido = () => {
    adicionarLog('HTTP', 'POST /orders - Enviando carrinho de compras...', 'envio', 0);
    adicionarLog('HTTP', 'HTTP/1.1 201 Created - Pedido aceito pelo restaurante.', 'sucesso', 600);
    adicionarLog('WebSockets', 'Abrindo conexão bidirecional ws://api.ifood.com/v1/track', 'info', 1200);
    adicionarLog('WebSockets', 'Conexão aberta com sucesso. Aguardando entregador...', 'sucesso', 1600);

    setTimeout(() => {
      setEtapa('pedido_feito');
    }, 1700);
  };

  //simulador de Socket para o entregador se movendo
  useEffect(() => {
    if (etapa !== 'pedido_feito') return;

    const interval = setInterval(() => {
      setPosicaoEntregador((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          adicionarLog('WebSockets', 'Entregador chegou! Fechando conexão (TCP FIN).', 'info', 0);
          return 100;
        }
        const novaPosicao = prev + 20;
        adicionarLog('WebSockets', `[Pacote Recebido] Coordenadas atualizadas: ${novaPosicao}% do caminho.`, 'sucesso', 0);
        return novaPosicao;
      });
    }, 3000); //a cada 3 segundos chega um "pacote" do socket

    return () => clearInterval(interval);
  }, [etapa]);

  return (
    <div className="flex h-screen w-full bg-gray-100 p-4 font-sans">
      {/* COLUNA 1: SMARTPHONE CLONE */}
      <div className="w-1/2 flex flex-col items-center justify-center border-r-2 border-gray-300 p-6">
        <div className="w-72 h-[580px] bg-white border-[12px] border-gray-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-red-600 text-white p-4 text-center font-bold tracking-wide">iFood Simulador</div>
          
          <div className="flex-1 p-4 flex flex-col justify-center items-center text-center gap-4">
            {etapa === 'inicio' && (
              <>
                <p className="text-gray-600 text-sm">Bem-vindo! Faça login para realizar seu pedido</p>
                <button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">
                  Fazer Login
                </button>
              </>
            )}

            {etapa === 'logado' && (
              <>
                <h3 className="font-bold text-lg text-gray-800"> Opção 1</h3>
                <p className="text-gray-500 text-sm">Opção 2</p>
                <button onClick={handleFazerPedido} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                  Confirmar e Enviar Pedido
                </button>
              </>
            )}

            {etapa === 'pedido_feito' && (
              <div className="w-full">
                <h3 className="font-bold text-green-600 text-base mb-2">Pedido a Caminho!</h3>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${posicaoEntregador}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Progresso do Entregador: {posicaoEntregador}%</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COLUNA 2: CONSOLE DA REDE */}
      <div className="w-1/2 bg-gray-900 text-green-400 p-6 flex flex-col overflow-hidden rounded-r-lg">
        <h2 className="text-xl font-mono font-bold text-white mb-4 border-b border-gray-700 pb-2">🌐 Tráfego de Rede ("Under the Hood")</h2>
        <div className="flex-1 font-mono text-sm overflow-y-auto space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="p-2 bg-gray-800 bg-opacity-50 rounded">
              <span className="bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded text-xs font-bold mr-2">{log.protocolo}</span>
              <span className={log.tipo === 'envio' ? 'text-yellow-300' : log.tipo === 'sucesso' ? 'text-green-400' : 'text-gray-300'}>
                {log.mensagem}
              </span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-500 italic">Aguardando interações no smartphone...</p>}
        </div>
      </div>
    </div>
  );
}
