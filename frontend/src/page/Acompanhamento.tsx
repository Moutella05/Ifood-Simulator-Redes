import { useEffect } from "react";
import Layout from "../components/Layout";
import { usePedido } from "../context/PedidoContext";

export default function Acompanhamento() {
  const { setLogs, posicaoEntregador, setPosicaoEntregador } = usePedido();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      setLogs((prev) => [
        ...prev,
        {
          protocolo: "WebSockets",
          mensagem:
            "Upgrade aceito! Canal TCP persistente estabelecido para rastreio.",
          tipo: "sucesso",
        },
      ]);
    };

    socket.onmessage = (event) => {
      const dadosDoServidor = JSON.parse(event.data);

      setLogs((prev) => [
        ...prev,
        {
          protocolo: dadosDoServidor.protocolo,
          mensagem: dadosDoServidor.mensagem,
          tipo: "sucesso",
        },
      ]);

      setPosicaoEntregador(dadosDoServidor.progresso);
    };

    socket.onerror = () => {
      setLogs((prev) => [
        ...prev,
        {
          protocolo: "WebSockets",
          mensagem: "Falha ao conectar com o servidor de rastreamento.",
          tipo: "info",
        },
      ]);
    };

    socket.onclose = () => {
      setLogs((prev) => [
        ...prev,
        {
          protocolo: "TCP/WS",
          mensagem: "Fluxo finalizado. Conexão encerrada via pacotes FIN-ACK.",
          tipo: "info",
        },
      ]);
    };

    return () => {
      socket.close();
    };
  }, [setLogs, setPosicaoEntregador]);

  return (
    <Layout>
      <div className="flex-1 flex flex-col justify-center items-center w-full gap-5 animate-fade-in">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl shadow-sm border border-emerald-100 animate-bounce">
          🛵
        </div>

        <div className="w-full text-center">
          <h3 className="font-black text-emerald-600 text-base mb-1">
            Pedido a caminho!
          </h3>

          <p className="text-slate-400 text-[10px] mb-4">
            Monitorando pacotes via canal WebSocket
          </p>

          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-[1500ms]"
              style={{
                width: `${posicaoEntregador}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[9px] text-slate-400 font-extrabold mt-2 tracking-wider">
            <span>RESTAURANTE</span>

            <span className="text-emerald-600 font-black">
              {posicaoEntregador}%
            </span>

            <span>SUA CASA</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
