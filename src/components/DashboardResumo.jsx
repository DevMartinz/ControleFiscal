import React, { useMemo } from "react";

export function DashboardResumo({
  empresas,
  categorias,
  totalTarefasRequeridas,
  tema,
}) {
  const stats = useMemo(() => {
    let concluidas = 0;
    let pendentes = 0;
    let verificar = 0; // Novo contador
    let empresas100 = 0;

    empresas.forEach((emp) => {
      let tarefasOkEmpresa = 0;
      categorias.forEach((cat) => {
        cat.filhas.forEach((sub) => {
          const status = emp.tarefas[`${cat.nome}-${sub}`]?.status;
          if (status === "OK" || status === "NAO") {
            concluidas++;
            tarefasOkEmpresa++;
          } else if (status === "Verificar") {
            verificar++;
            pendentes++; // Conta como pendência também
          } else {
            pendentes++;
          }
        });
      });
      if (tarefasOkEmpresa === totalTarefasRequeridas) empresas100++;
    });

    const totalTarefas = empresas.length * totalTarefasRequeridas;
    const progresso =
      totalTarefas === 0 ? 0 : Math.round((concluidas / totalTarefas) * 100);

    return {
      progresso,
      empresas100,
      pendentes,
      verificar,
      concluidas,
      total: empresas.length,
    };
  }, [empresas, categorias, totalTarefasRequeridas]);

  const boxEstilos = {
    light: "bg-white border-slate-200",
    dark: "bg-slate-800 border-slate-700",
    black: "bg-[#0a0a0a] border-zinc-900",
  };

  const bgBoxVerde = {
    light: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
    dark: "bg-emerald-900/20 border-emerald-800/30 text-emerald-400",
    black: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400",
  };

  const bgBoxVermelho = {
    light: "bg-rose-50/50 border-rose-100 text-rose-700",
    dark: "bg-rose-900/20 border-rose-800/30 text-rose-400",
    black: "bg-rose-950/30 border-rose-900/50 text-rose-400",
  };

  // Novo estilo de cor para o "Revisar"
  const bgBoxAmarelo = {
    light: "bg-amber-50/50 border-amber-100 text-amber-700",
    dark: "bg-amber-900/20 border-amber-800/30 text-amber-400",
    black: "bg-amber-950/30 border-amber-900/50 text-amber-400",
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto transition-colors duration-300">
      {/* CARD 1: Progresso Geral */}
      <div
        className={`${boxEstilos[tema]} border rounded-xl p-3 shadow-sm flex-1 sm:min-w-[220px] flex flex-col justify-center relative overflow-hidden transition-colors`}
      >
        <div
          className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl ${tema === "light" ? "bg-blue-50" : "bg-blue-900/20"}`}
        ></div>

        <div className="flex justify-between items-end mb-2 relative z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3 text-blue-500"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Progresso Geral
          </span>
          <span className="text-lg font-black text-blue-500 leading-none">
            {stats.progresso}%
          </span>
        </div>
        <div
          className={`w-full rounded-full h-2 relative z-10 ${tema === "light" ? "bg-slate-100" : "bg-slate-700/50"}`}
        >
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            style={{ width: `${stats.progresso}%` }}
          ></div>
        </div>
      </div>

      {/* CARDS Mmétricas */}
      <div className="flex gap-3 flex-wrap">
        {/* Empresas 100% */}
        <div
          className={`${bgBoxVerde[tema]} border rounded-xl px-4 py-2 flex flex-col justify-center min-w-[110px] shadow-sm transition-colors`}
        >
          <span
            className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${tema === "light" ? "text-emerald-600/80" : "text-emerald-500/80"}`}
          >
            Empresas 100%
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black">{stats.empresas100}</span>
            <span className="text-[10px] font-bold opacity-60">
              / {stats.total}
            </span>
          </div>
        </div>

        {/* Pendências */}
        <div
          className={`${bgBoxVermelho[tema]} border rounded-xl px-4 py-2 flex flex-col justify-center min-w-[110px] shadow-sm transition-colors`}
        >
          <span
            className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${tema === "light" ? "text-rose-600/80" : "text-rose-500/80"}`}
          >
            Pendências
          </span>
          <span className="text-xl font-black">{stats.pendentes}</span>
        </div>

        {/* REVISAR (Aparece apenas se houver itens para revisar) */}
        {stats.verificar > 0 && (
          <div
            className={`${bgBoxAmarelo[tema]} border rounded-xl px-4 py-2 flex flex-col justify-center min-w-[110px] shadow-sm transition-colors animate-pulse`}
          >
            <span
              className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${tema === "light" ? "text-amber-600/80" : "text-amber-500/80"}`}
            >
              Para Revisar
            </span>
            <span className="text-xl font-black">{stats.verificar}</span>
          </div>
        )}
      </div>
    </div>
  );
}
