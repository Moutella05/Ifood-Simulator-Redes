import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { usePedido } from "../context/PedidoContext";

export default function Carrinho() {
  const navigate = useNavigate();

  const { lancheSelecionado } = usePedido();

  const precos = {
    combo_tcp: "38,90",
    burger_udp: "29,90",
    shake_dns: "15,00",
  };

  const nomes = {
    combo_tcp: "Combo TCP/IP",
    burger_udp: "Burger UDP",
    shake_dns: "Milkshake DNS",
  };

  return (
    <Layout>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="font-black text-lg text-slate-800 mb-4">Carrinho</h3>

          <div className="w-full bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between text-sm font-bold">
              <span>{nomes[lancheSelecionado as keyof typeof nomes]}</span>

              <span className="text-green-600">
                R$
                {precos[lancheSelecionado as keyof typeof precos]}
              </span>
            </div>
          </div>

          <div className="w-full bg-white p-2.5 rounded-lg border border-slate-200 mt-3">
            <div className="flex justify-between items-center text-slate-800 font-black text-[11px]">
              <span>Total do Pedido:</span>

              <span className="text-green-600 text-xs">
                R$
                {precos[lancheSelecionado as keyof typeof precos]}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/acompanhamento")}
          className="w-full font-bold py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white"
        >
          Confirmar Pedido
        </button>
      </div>
    </Layout>
  );
}
