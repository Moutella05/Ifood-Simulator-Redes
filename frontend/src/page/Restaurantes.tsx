import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { usePedido } from "../context/PedidoContext";

export default function Restaurante() {
  const navigate = useNavigate();

  const { lancheSelecionado, setLancheSelecionado } = usePedido();

  return (
    <Layout>
      <div className="flex-1 flex flex-col justify-between w-full animate-fade-in pt-1 text-left overflow-hidden">
        <div className="text-left mb-0.5">
          <h4 className="font-extrabold text-slate-800 text-xs">
            BURGUER REDES
          </h4>

          <p className="text-[9px] text-slate-400 font-bold leading-none">
            Selecione seu pedido:
          </p>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 my-1.5 overflow-y-auto max-h-[280px]">
          <div
            onClick={() => setLancheSelecionado("combo_tcp")}
            className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              lancheSelecionado === "combo_tcp"
                ? "bg-red-50/60 border-red-500 ring-1 ring-red-500"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl bg-slate-100 p-1 rounded-md">📦</span>

              <div>
                <h5 className="font-bold text-slate-800 text-[11px]">
                  Combo TCP/IP
                </h5>

                <p className="text-[9px] text-slate-400">
                  Completo, conexão garantida e sem perdas
                </p>
              </div>
            </div>

            <span className="text-[11px] font-black text-green-600">
              R$ 38,90
            </span>
          </div>

          <div
            onClick={() => setLancheSelecionado("burger_udp")}
            className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              lancheSelecionado === "burger_udp"
                ? "bg-red-50/60 border-red-500 ring-1 ring-red-500"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl bg-slate-100 p-1 rounded-md">⚡</span>

              <div>
                <h5 className="font-bold text-slate-800 text-[11px]">
                  Burger UDP
                </h5>

                <p className="text-[9px] text-slate-400">
                  Mais rápido, mas pode vir sem batata
                </p>
              </div>
            </div>

            <span className="text-[11px] font-black text-green-600">
              R$ 29,90
            </span>
          </div>

          <div
            onClick={() => setLancheSelecionado("shake_dns")}
            className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              lancheSelecionado === "shake_dns"
                ? "bg-red-50/60 border-red-500 ring-1 ring-red-500"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl bg-slate-100 p-1 rounded-md">🥤</span>

              <div>
                <h5 className="font-bold text-slate-800 text-[11px]">
                  Milkshake DNS
                </h5>

                <p className="text-[9px] text-slate-400">
                  Traduz o seu desejo em sabor
                </p>
              </div>
            </div>

            <span className="text-[11px] font-black text-green-600">
              R$ 15,00
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/carrinho")}
          className="w-full font-bold py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
        >
          Ir para Carrinho
        </button>
      </div>
    </Layout>
  );
}
