import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./page/Login";
import Restaurante from "./page/Restaurantes";
import Carrinho from "./page/Carrinho";
import Acompanhamento from "./page/Acompanhamento";

import { PedidoProvider } from "./context/PedidoContext";

export default function App() {
  return (
    <PedidoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/restaurante" element={<Restaurante />} />

          <Route path="/carrinho" element={<Carrinho />} />

          <Route path="/acompanhamento" element={<Acompanhamento />} />
        </Routes>
      </BrowserRouter>
    </PedidoProvider>
  );
}
