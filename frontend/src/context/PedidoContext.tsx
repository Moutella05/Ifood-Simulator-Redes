import { createContext, useContext, useState } from "react";

export interface LogRede {
  protocolo: string;
  mensagem: string;
  tipo: "envio" | "sucesso" | "info";
}

interface PedidoContextData {
  logs: LogRede[];
  setLogs: React.Dispatch<React.SetStateAction<LogRede[]>>;

  carregando: boolean;
  setCarregando: React.Dispatch<React.SetStateAction<boolean>>;

  lancheSelecionado: string;
  setLancheSelecionado: React.Dispatch<React.SetStateAction<string>>;

  posicaoEntregador: number;
  setPosicaoEntregador: React.Dispatch<React.SetStateAction<number>>;
}

const PedidoContext = createContext({} as PedidoContextData);

export function PedidoProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogRede[]>([]);
  const [carregando, setCarregando] = useState(false);

  const [lancheSelecionado, setLancheSelecionado] = useState("combo_tcp");

  const [posicaoEntregador, setPosicaoEntregador] = useState(0);

  return (
    <PedidoContext.Provider
      value={{
        logs,
        setLogs,
        carregando,
        setCarregando,
        lancheSelecionado,
        setLancheSelecionado,
        posicaoEntregador,
        setPosicaoEntregador,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}

export const usePedido = () => useContext(PedidoContext);
