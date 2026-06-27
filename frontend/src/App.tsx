import React, { useState } from 'react';
import './App.css';

interface LogRede {
  protocolo: string;
  mensagem: string;
  tipo: 'envio' | 'sucesso' | 'info';
}

export default function App() {
  const [etapa, setEtapa] = useState<'inicio' | 'logado' | 'pedido_feito'>('inicio');
  const [logs, setLogs] = useState<LogRede[]>([]);
  const [posicaoEntregador, setPosicaoEntregador] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [lancheSelecionado, setLancheSelecionado] = useState<'combo_tcp' | 'burger_udp' | 'shake_dns'>('combo_tcp');

  //para registrar os logs na tela com atraso acumulado
  const adicionarLog = (protocolo: string, mensagem: string, tipo: 'envio' | 'sucesso' | 'info', delay: number) => {
    setTimeout(() => {
      setLogs((prev) => [...prev, { protocolo, mensagem, tipo }]);
    }, delay);
  };

  const handleLogin = () => {
    if (carregando) return;
    setCarregando(true);
    setLogs([]); 
    
    //PASSO 1: ICMP & MEDIÇÃO DE DESEMPENHO
    adicionarLog('ICMP', 'Disparando teste de conectividade (PING) para api.ifood.com.br...', 'info', 0);
    adicionarLog('ICMP', 'Resposta de 172.217.22.14: bytes=32 tempo=14ms TTL=56', 'sucesso', 1500);
    adicionarLog('ICMP', 'Resposta de 172.217.22.14: bytes=32 tempo=18ms TTL=56', 'sucesso', 3000);
    adicionarLog('ICMP', 'Resposta de 172.217.22.14: bytes=32 tempo=13ms TTL=56', 'sucesso', 4500);
    adicionarLog('Métricas', 'Desempenho Calculado -> Latência Média: 15ms | Jitter: 2.6ms (Estável)', 'info', 6000);
    
    //PASSO 2: CAMADA DE REDE (DHCP & NAT)
    adicionarLog('DHCP', 'Solicitando configuração de IP na rede local... IP Atribuído: 192.168.1.50', 'info', 8000);
    adicionarLog('NAT', 'Roteador traduzindo IP privado (192.168.1.50) para IP público (187.54.21.9)', 'info', 10000);
    
    //PASSO 3: CAMADA DE TRANSPORTE
    adicionarLog('TCP', 'Iniciando conexão com o servidor iFood. Enviando pacote [SYN]...', 'envio', 12000);
    adicionarLog('TCP', 'Pacote de resposta [SYN-ACK] recebido com sucesso do servidor.', 'sucesso', 13800);
    adicionarLog('TCP', 'Enviando pacote [ACK]. Conexão TCP aberta e pronta para transferência!', 'envio', 15500);
    
    //PASSO 4: CAMADA DE APLICAÇÃO (HTTP POST)
    adicionarLog('HTTP', 'POST /auth/login HTTP/1.1 - Criptografando e transmitindo credenciais...', 'envio', 17500);
    adicionarLog('HTTP', 'HTTP/1.1 200 OK - Usuário autenticado. Token JWT armazenado no app.', 'sucesso', 19500);

    setTimeout(() => {
      setEtapa('logado');
      setCarregando(false);
    }, 20000);
  };

  const handleFazerPedido = () => {
    if (carregando) return;
    setCarregando(true);

    const nomesLanches = {
      combo_tcp: "Combo TCP/IP",
      burger_udp: "Burger UDP (Sem Checagem)",
      shake_dns: "Milkshake DNS Resolver"
    };

    adicionarLog('HTTP', `POST /orders HTTP/1.1 - Enviando Payload: { item: "${nomesLanches[lancheSelecionado]}", qtd: 1 }`, 'envio', 0);
    adicionarLog('HTTP', 'HTTP/1.1 201 Created - Pedido recebido e enviado para a cozinha!', 'sucesso', 1800);
    adicionarLog('HTTP', 'GET /restaurantes/logos - Carregando imagens. Throughput medido: 45 Mbps', 'info', 3500);
    
    adicionarLog('WebSockets', 'Instanciando handshake de Upgrade HTTP para ws://localhost:8080...', 'info', 5500);

    //conexão real com o WebSocket do backend
    setTimeout(() => {
      const socket = new WebSocket('ws://localhost:8080');

      socket.onopen = () => {
        adicionarLog('WebSockets', 'Upgrade aceito! Canal TCP persistente estabelecido para rastreio.', 'sucesso', 0);
        setEtapa('pedido_feito');
        setCarregando(false);
      };

      socket.onmessage = (event) => {
        const dadosDoServidor = JSON.parse(event.data);
        setLogs((prev) => [...prev, { 
          protocolo: dadosDoServidor.protocolo, 
          mensagem: dadosDoServidor.mensagem, 
          tipo: 'sucesso' 
        }]);
        setPosicaoEntregador(dadosDoServidor.progresso);
      };

      socket.onclose = () => {
        setLogs((prev) => [...prev, { 
          protocolo: 'TCP/WS', 
          mensagem: 'Fluxo finalizado. Conexão encerrada via pacotes FIN-ACK.', 
          tipo: 'info' 
        }]);
      };
    }, 6000);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 p-6 font-sans gap-6 text-slate-100 overflow-hidden">
      
      {/*COLUNA 1: CELULAR*/}
      <div className="w-[45%] flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800/50 backdrop-blur-sm p-4 shadow-2xl">
        <div className="w-76 h-[570px] bg-slate-50 border-[14px] border-slate-800 rounded-[42px] shadow-2xl overflow-hidden flex flex-col relative">
        
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-between px-3 text-[9px] text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          </div>

          {/* iFood App Header */}
          <div className="bg-red-600 text-white pt-6 pb-2 px-4 text-center font-black tracking-wide text-xs shadow-md select-none z-10">
            iFood <span className="text-[9px] font-medium opacity-75 bg-red-700/50 px-1 py-0.5 rounded ml-0.5">LAB REDES</span>
          </div>
        
          <div className="flex-1 p-5 flex flex-col justify-between items-center bg-slate-50 text-slate-800">
            
            {etapa === 'inicio' && (
              <div className="flex-1 flex flex-col justify-center items-center gap-5 animate-fade-in text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-red-100">
                  📍
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800 mb-1.5">Descubra Restaurantes</h3>
                  <p className="text-slate-500 text-xs px-2 leading-relaxed">Para buscar as melhores opções, precisamos autenticar seu dispositivo na rede do iFood</p>
                </div>
                <button 
                  onClick={handleLogin} 
                  disabled={carregando}
                  className={`w-full font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm active:scale-[0.98]
                    ${carregando 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                    }`}
                >
                  {carregando ? 'Autenticando na Rede...' : 'Fazer Login e Buscar'}
                </button>
              </div>
            )}

            {etapa === 'logado' && (
              <div className="flex-1 flex flex-col justify-between w-full animate-fade-in pt-1 text-left overflow-hidden">
                
                {/* Cabeçalho do Cardápio */}
                <div className="text-left mb-0.5">
                  <h4 className="font-extrabold text-slate-800 text-xs">BURGUER REDES</h4>
                  <p className="text-[9px] text-slate-400 font-bold leading-none">Selecione seu pedido:</p>
                </div>

                {/*LISTA DE OPÇÕES DE LANCHES*/}
                <div className="flex flex-col gap-1.5 flex-1 my-1.5 overflow-y-auto max-h-[200px] pr-0.5 scrollbar-none">
                  
                  {/*Opção 1: TCP*/}
                  <div 
                    onClick={() => setLancheSelecionado('combo_tcp')}
                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      lancheSelecionado === 'combo_tcp'
                        ? 'bg-red-50/60 border-red-500 ring-1 ring-red-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl bg-slate-100 p-1 rounded-md">📦</span>
                      <div>
                        <h5 className="font-bold text-slate-800 text-[11px]">Combo TCP/IP</h5>
                        <p className="text-[9px] text-slate-400 font-medium Regal leading-tight">Completo, conexão garantida e sem perdas</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-green-600 shrink-0">R$ 38,90</span>
                  </div>

                  {/* Opção 2: UDP */}
                  <div 
                    onClick={() => setLancheSelecionado('burger_udp')}
                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      lancheSelecionado === 'burger_udp'
                        ? 'bg-red-50/60 border-red-500 ring-1 ring-red-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl bg-slate-100 p-1 rounded-md">⚡</span>
                      <div>
                        <h5 className="font-bold text-slate-800 text-[11px]">Burger UDP</h5>
                        <p className="text-[9px] text-slate-400 font-medium leading-tight">Mais rápido, mas pode vir sem batata</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-green-600 shrink-0">R$ 29,90</span>
                  </div>

                  {/* Opção 3: DNS */}
                  <div 
                    onClick={() => setLancheSelecionado('shake_dns')}
                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      lancheSelecionado === 'shake_dns'
                        ? 'bg-red-50/60 border-red-500 ring-1 ring-red-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl bg-slate-100 p-1 rounded-md">🥤</span>
                      <div>
                        <h5 className="font-bold text-slate-800 text-[11px]">Milkshake DNS</h5>
                        <p className="text-[9px] text-slate-400 font-medium leading-tight">Traduz o seu desejo em sabor</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-green-600 shrink-0">R$ 15,00</span>
                  </div>

                </div>

                {/* TOTAL DINÂMICO */}
                <div className="w-full bg-white p-2.5 rounded-lg border border-slate-200/80 text-left shadow-sm mb-2">
                  <div className="flex justify-between items-center text-slate-800 font-black text-[11px]">
                    <span>Total do Pedido:</span>
                    <span className="text-green-600 text-xs">
                      {lancheSelecionado === 'combo_tcp' && 'R$ 38,90'}
                      {lancheSelecionado === 'burger_udp' && 'R$ 29,90'}
                      {lancheSelecionado === 'shake_dns' && 'R$ 15,00'}
                    </span>
                  </div>
                </div>

                {/* Botão de Enviar */}
                <button 
                  onClick={handleFazerPedido} 
                  disabled={carregando}
                  className={`w-full font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs active:scale-[0.98]
                    ${carregando 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                    }`}
                >
                  {carregando ? 'Processando Requisição...' : 'Confirmar e Enviar Pedido'}
                </button>
              </div>
            )}


            {etapa === 'pedido_feito' && (
              <div className="flex-1 flex flex-col justify-center items-center w-full gap-5 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl shadow-sm border border-emerald-100 animate-bounce">
                  🛵
                </div>
                <div className="w-full text-center">
                  <h3 className="font-black text-emerald-600 text-base mb-1">Pedido a caminho!</h3>
                  <p className="text-slate-400 text-[10px] mb-4">Monitorando pacotes via canal WebSocket</p>
                  
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-[1500ms]" 
                      style={{ width: `${posicaoEntregador}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-extrabold mt-2 tracking-wider">
                    <span>RESTAURANTE</span>
                    <span className="text-emerald-600 font-black">{posicaoEntregador}%</span>
                    <span>SUA CASA</span>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/*COLUNA 2: TERMINAL*/}
      <div className="w-[55%] bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute top-4 right-5 flex gap-1.5 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></div>
        </div>

        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Filtro do Wireshark: tcp.port == 8080 || http
        </h2>
       
        <div className="flex-1 text-[11px] space-y-2.5 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent font-mono">
          {logs.map((log, index) => (
            <div 
              key={index} 
              className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/30 flex items-start gap-3 hover:bg-slate-950 transition-colors animate-slide-up"
            >
              <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase shrink-0 text-center min-w-[75px] shadow-sm
                ${log.protocolo.includes('HTTP') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
                ${log.protocolo.includes('TCP') ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : ''}
                ${log.protocolo.includes('WebSocket') || log.protocolo.includes('WS') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : ''}
                ${log.protocolo.includes('ICMP') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                ${log.protocolo.includes('Métricas') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                ${log.protocolo.includes('DHCP') || log.protocolo.includes('NAT') ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : ''}
              `}>
                {log.protocolo}
              </span>
              <span className={`leading-relaxed text-left
                ${log.tipo === 'envio' ? 'text-amber-200/90' : log.tipo === 'sucesso' ? 'text-emerald-400 font-medium' : 'text-slate-300'}
              `}>
                {log.mensagem}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 select-none">
              <span className="text-2xl">📡</span>
              <span>Aguardando conexões e troca de quadros de rede...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}