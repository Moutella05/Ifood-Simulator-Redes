import { useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { usePedido } from "../context/PedidoContext";

const rastreioFases = [
  {
    progresso: 20,
    nome: "Pedido Aceito",
    mensagem: "Pedido aceito. Restaurante iniciando preparo.",
  },
  {
    progresso: 40,
    nome: "Preparando",
    mensagem: "Pedido sendo preparado.",
  },
  {
    progresso: 60,
    nome: "A Caminho",
    mensagem: "Pedido em trânsito. Entregador a caminho.",
  },
  {
    progresso: 80,
    nome: "Chegando",
    mensagem: "Entregador chegando à sua localização.",
  },
  {
    progresso: 100,
    nome: "Entregue",
    mensagem: "Pedido entregue. Bom apetite!",
  },
];

export default function Acompanhamento() {
  const { setLogs, posicaoEntregador, setPosicaoEntregador } = usePedido();
  const fallbackStarted = useRef(false);
  const faseAtual =
    rastreioFases
      .slice()
      .reverse()
      .find((fase) => posicaoEntregador >= fase.progresso) ?? rastreioFases[0];

  useEffect(() => {
    const timeouts: number[] = [];
    let progressoFinalizado = false;
    let recebeuMensagem = false;

    const log = (protocolo: string, mensagem: string, tipo: "envio" | "sucesso" | "info") => {
      setLogs((prev) => [...prev, { protocolo, mensagem, tipo }]);
    };

    const iniciarSimulacaoLocal = () => {
      if (fallbackStarted.current) return;
      fallbackStarted.current = true;

      log(
        "WebSockets",
        "Falha ao conectar com o servidor de rastreamento. Iniciando simulação local...",
        "info",
      );

      rastreioFases.forEach((fase, index) => {
        const timeout = window.setTimeout(() => {
          log("WS / Rastreio", `[Simulação] ${fase.mensagem}`, "sucesso");
          setPosicaoEntregador(fase.progresso);

          if (fase.progresso === 100) {
            progressoFinalizado = true;
            log(
              "TCP/WS",
              "Fluxo finalizado. Conexão encerrada via pacotes FIN-ACK.",
              "info",
            );
          }
        }, (index + 1) * 2500);

        timeouts.push(timeout);
      });
    };

    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      log(
        "WebSockets",
        "Upgrade aceito! Canal TCP persistente estabelecido para rastreio.",
        "sucesso",
      );
    };

    socket.onmessage = (event) => {
      recebeuMensagem = true;
      const dadosDoServidor = JSON.parse(event.data);

      log(dadosDoServidor.protocolo, dadosDoServidor.mensagem, "sucesso");
      setPosicaoEntregador(dadosDoServidor.progresso);

      if (dadosDoServidor.progresso === 100) {
        progressoFinalizado = true;
      }
    };

    socket.onerror = () => {
      log(
        "WebSockets",
        "Falha ao conectar com o servidor de rastreamento.",
        "info",
      );
      iniciarSimulacaoLocal();
    };

    socket.onclose = () => {
      if (!recebeuMensagem) {
        iniciarSimulacaoLocal();
        return;
      }

      if (!progressoFinalizado) {
        iniciarSimulacaoLocal();
        return;
      }

      log(
        "TCP/WS",
        "Fluxo finalizado. Conexão encerrada via pacotes FIN-ACK.",
        "info",
      );
    };

    return () => {
      socket.close();
      timeouts.forEach((timeout) => clearTimeout(timeout));
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
            <span>{faseAtual.nome}</span>

            <span className="text-emerald-600 font-black">
              {posicaoEntregador}%
            </span>

            <span>{posicaoEntregador === 100 ? "ENTREGUE" : "SUA CASA"}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
