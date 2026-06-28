import React from "react";
import MonitorRede from "./MonitorRede";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-slate-950 p-6 font-sans gap-6 text-slate-100 overflow-hidden">
      {/* CELULAR */}
      <div className="w-[45%] flex items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800/50 backdrop-blur-sm p-4 shadow-2xl">
        <div className="w-[320px] h-[570px] bg-slate-50 border-[14px] border-slate-800 rounded-[42px] shadow-2xl overflow-hidden flex flex-col relative">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          </div>

          {/* Header */}
          <div className="bg-red-600 text-white pt-6 pb-2 px-4 text-center font-black tracking-wide text-xs shadow-md select-none z-10">
            iFood
            <span className="text-[9px] font-medium opacity-75 bg-red-700/50 px-1 py-0.5 rounded ml-1">
              LAB REDES
            </span>
          </div>

          {/* Conteúdo da página */}
          <div className="flex-1 bg-slate-50 text-slate-800 overflow-hidden flex flex-col p-5">
            {children}
          </div>
        </div>
      </div>

      {/* TERMINAL DE REDE */}
      <MonitorRede />
    </div>
  );
}
