export function HistoricoSidebar({ mostrar, historico, onFechar, onLimpar }) {
  return (
    <>
      {mostrar && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
          onClick={onFechar}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${mostrar ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="p-4 bg-blue-900 text-white flex justify-between items-center">
          <h2 className="font-bold uppercase text-xs tracking-widest">
            Histórico Recente
          </h2>
          <button onClick={onFechar} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {historico.map((h) => (
            <div
              key={h.id}
              className="p-3 bg-white border border-slate-200 rounded text-sm shadow-sm"
            >
              <div className="flex justify-between font-bold text-[10px]">
                <span>{h.usuario}</span>
                <span className="text-slate-400">{h.data}</span>
              </div>
              <p className={`font-bold uppercase text-[11px] mt-1 ${h.cor}`}>
                {h.acao}
              </p>
              <p className="text-xs text-slate-500">{h.detalhe}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onLimpar}
          className="p-4 text-xs font-bold text-slate-400 hover:text-red-500 uppercase border-t border-slate-100 transition-colors"
        >
          Limpar Histórico
        </button>
      </div>
    </>
  );
}
