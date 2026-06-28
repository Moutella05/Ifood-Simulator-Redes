import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import usuarios from "../data/Usuarios.json";
import { z } from "zod";
import { usePedido } from "../context/PedidoContext";

export default function Login() {
  const navigate = useNavigate();
  const { setLogs, carregando, setCarregando } = usePedido();

  const [usuarioInput, setUsuarioInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");

  const adicionarLog = (
    protocolo: string,
    mensagem: string,
    tipo: "envio" | "sucesso" | "info",
    delay: number,
  ) => {
    setTimeout(() => {
      setLogs((prev) => [...prev, { protocolo, mensagem, tipo }]);
    }, delay);
  };

  const handleLogin = () => {
    if (carregando) return;

    setCarregando(true);
    setLogs([]);

    const loginSchema = z.object({
      usuario: z.string().min(1),
      senha: z.string().min(1),
    });

    const parsed = loginSchema.safeParse({
      usuario: usuarioInput,
      senha: senhaInput,
    });

    if (!parsed.success) {
      adicionarLog(
        "HTTP",
        "HTTP/1.1 400 Bad Request - Dados de login inválidos",
        "info",
        0,
      );

      setCarregando(false);
      return;
    }

    const found = (usuarios as any[]).find(
      (u) => u.usuario === usuarioInput && u.senha === senhaInput,
    );

    if (!found) {
      // Credenciais não conferem -> 403 no terminal
      adicionarLog(
        "HTTP",
        "HTTP/1.1 403 Forbidden - Credenciais inválidas",
        "info",
        0,
      );

      setCarregando(false);
      return;
    }

    // Credenciais válidas: prosseguir com a simulação de rede
    adicionarLog(
      "ICMP",
      "Disparando teste de conectividade (PING) para api.ifood.com.br...",
      "info",
      0,
    );

    adicionarLog(
      "ICMP",
      "Resposta de 172.217.22.14: bytes=32 tempo=14ms TTL=56",
      "sucesso",
      1500,
    );

    adicionarLog(
      "ICMP",
      "Resposta de 172.217.22.14: bytes=32 tempo=18ms TTL=56",
      "sucesso",
      3000,
    );

    adicionarLog(
      "ICMP",
      "Resposta de 172.217.22.14: bytes=32 tempo=13ms TTL=56",
      "sucesso",
      4500,
    );

    adicionarLog(
      "Métricas",
      "Desempenho Calculado -> Latência Média: 15ms | Jitter: 2.6ms (Estável)",
      "info",
      6000,
    );

    adicionarLog(
      "DHCP",
      "Solicitando configuração de IP na rede local... IP Atribuído: 192.168.1.50",
      "info",
      8000,
    );

    adicionarLog(
      "NAT",
      "Roteador traduzindo IP privado (192.168.1.50) para IP público (187.54.21.9)",
      "info",
      10000,
    );

    adicionarLog(
      "TCP",
      "Iniciando conexão com o servidor iFood. Enviando pacote [SYN]...",
      "envio",
      12000,
    );

    adicionarLog(
      "TCP",
      "Pacote de resposta [SYN-ACK] recebido com sucesso do servidor.",
      "sucesso",
      13800,
    );

    adicionarLog(
      "TCP",
      "Enviando pacote [ACK]. Conexão TCP aberta e pronta para transferência!",
      "envio",
      15500,
    );

    adicionarLog(
      "HTTP",
      "POST /auth/login HTTP/1.1 - Criptografando e transmitindo credenciais...",
      "envio",
      17500,
    );

    adicionarLog(
      "HTTP",
      "HTTP/1.1 200 OK - Usuário autenticado. Token JWT armazenado no app.",
      "sucesso",
      19500,
    );

    setTimeout(() => {
      setCarregando(false);
      navigate("/restaurante");
    }, 20000);
  };

  return (
    <Layout>
      {" "}
      <div className="flex-1 flex flex-col justify-center items-center gap-5 animate-fade-in text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-red-100">
          📍
        </div>

        <div>
          <h3 className="font-black text-lg text-slate-800 mb-1.5">
            Descubra Restaurantes
          </h3>

          <p className="text-slate-500 text-xs px-2 leading-relaxed">
            Para buscar as melhores opções, precisamos autenticar seu
            dispositivo na rede do iFood
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Usuário"
            value={usuarioInput}
            onChange={(e) => setUsuarioInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={carregando || usuarioInput.trim() === "" || senhaInput.trim() === ""}
          className={`w-full font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm active:scale-[0.98]
    ${
      carregando
        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
        : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
    }`}
        >
          {carregando ? "Autenticando na Rede..." : "Fazer Login e Buscar"}
        </button>
      </div>
    </Layout>
  );
}