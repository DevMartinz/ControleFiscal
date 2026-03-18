import { anosDisponiveis, mesesDisponiveis } from "../data/constants";

export function Header({
  usuarioLogado,
  periodo,
  mudarPeriodo,
  filtro,
  setFiltro,
  onAbrirHistorico,
  onLogout,
}) {
  return (
    <header className="max-w-[1800px] w-full mx-auto mb-6 flex flex-col lg:flex-row gap-4 justify-between lg:items-center border-b pb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-lg uppercase">
          {usuarioLogado.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Monitor Fiscal <span className="text-blue-800">v2.0</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
            Rio Grande do Norte • Auditoria
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-end lg:items-center gap-4 w-full lg:w-auto">
        {/* FILTROS DE PERÍODO */}
        <div className="flex items-center gap-2 bg-white p-1.5 border border-slate-200 rounded-lg shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">
            Período:
          </span>
          <select
            value={periodo.mes}
            onChange={(e) => mudarPeriodo(periodo.ano, e.target.value)}
            className="p-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 cursor-pointer"
          >
            {mesesDisponiveis.map((m) => (
              <option key={m.val} value={m.val}>
                {m.nome}
              </option>
            ))}
          </select>
          <select
            value={periodo.ano}
            onChange={(e) => mudarPeriodo(e.target.value, periodo.mes)}
            className="p-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 cursor-pointer"
          >
            {anosDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* BARRA DE BUSCA */}
        <input
          type="text"
          placeholder="🔍 Buscar empresa..."
          className="w-full lg:w-56 p-2 text-sm border rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-800 shadow-sm transition-all"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {/* CONTROLES DE USUÁRIO */}
        <div className="flex gap-4 items-center">
          <span className="text-[10px] text-slate-500 bg-white px-2 py-1 border rounded-full">
            Operador: <b className="text-blue-900">{usuarioLogado}</b>
          </span>
          <button
            onClick={onAbrirHistorico}
            className="text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline uppercase"
          >
            Histórico
          </button>
          <button
            onClick={onLogout}
            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline uppercase"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
