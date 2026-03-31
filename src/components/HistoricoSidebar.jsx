import React, { useState, useMemo } from "react";

export function HistoricoSidebar({ mostrar, historico, onFechar }) {
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");

  const historicoFiltrado = useMemo(() => {
    if (filtroPeriodo === "todos") return historico;

    const agora = new Date();
    const inicioHoje = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
    ).getTime();
    const inicioOntem = inicioHoje - 86400000;
    const inicioSemana = inicioHoje - 86400000 * 7;

    return historico.filter((h) => {
      if (filtroPeriodo === "hoje") {
        return h.timestamp >= inicioHoje;
      }
      if (filtroPeriodo === "ontem") {
        return h.timestamp >= inicioOntem && h.timestamp < inicioHoje;
      }
      if (filtroPeriodo === "semana") {
        return h.timestamp >= inicioSemana;
      }
      return true;
    });
  }, [historico, filtroPeriodo]);

  return (
    <>
      {/* 1. O Overlay Escuro: z-[60] (Maior que o z-50 do cabeçalho da tabela) */}
      {mostrar && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onFechar}
        />
      )}

      {/* 2. O Painel Lateral: z-[70] (Fica por cima do overlay) */}
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-[400px] bg-slate-50 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${
          mostrar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 bg-blue-900 text-white flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 opacity-80"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
              />
            </svg>
            <h2 className="font-bold uppercase text-xs tracking-widest">
              Auditoria Global
            </h2>
          </div>
          <button
            onClick={onFechar}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {historico.length > 0 && (
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shadow-sm z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Exibir:
            </span>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 font-bold cursor-pointer transition-colors hover:bg-slate-100"
            >
              <option value="todos">Mês Completo</option>
              <option value="hoje">Hoje</option>
              <option value="ontem">Ontem</option>
              <option value="semana">Últimos 7 dias</option>
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-300">
          {historicoFiltrado.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-center">
                Nenhum registro
                <br />
                neste período
              </span>
            </div>
          ) : (
            historicoFiltrado.map((h) => (
              <div
                key={h.id}
                className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm relative group"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${h.corFundo || "bg-blue-500"}`}
                ></div>

                <div className="pl-2 flex flex-col gap-1.5">
                  {/* 3. Layout Flex-Wrap e gap: Se não couber, joga pra baixo em vez de cortar */}
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <span className="font-extrabold text-[12px] text-slate-700 uppercase tracking-tight break-words flex-1 min-w-[120px]">
                      {h.usuario}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                        {h.data}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {h.hora || "00:00"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1">
                    <p
                      className={`font-bold uppercase text-[10px] tracking-widest inline-flex items-center gap-1 px-2.5 py-1 rounded shadow-sm ${h.corBadge || "bg-blue-50 text-blue-600 border border-blue-100"}`}
                    >
                      STATUS ➔ {h.acao}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1 bg-slate-50/50 p-2 rounded-md border border-slate-100">
                    {h.detalhe}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
