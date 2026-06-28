import { usePedido } from "../context/PedidoContext";

export default function TerminalLogs() {
  const { logs } = usePedido();

  return (
    <div className="w-[55%] bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col overflow-hidden shadow-2xl relative">
      <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
        Filtro do Wireshark: tcp.port == 8080 || http
      </h2>

      <div className="flex-1 text-[11px] space-y-2.5 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="p-2.5 bg-slate-950/50 rounded-xl">
            <strong>{log.protocolo}</strong>
            <br />
            {log.mensagem}
          </div>
        ))}
      </div>
    </div>
  );
}
