export function NotificacaoSped({ dados, onAceitar, onRecusar }) {
  // Se não houver dados (ou seja, notificacao é null no App), o componente não renderiza nada.
  // Isso economiza linhas no App.jsx!
  if (!dados) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white border-l-4 border-blue-600 shadow-2xl rounded p-5 z-50 flex flex-col gap-3 max-w-sm animate-bounce-short">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🔔</div>
        <p className="text-sm text-slate-700 font-medium leading-tight">
          O SPED de <strong className="text-blue-900">{dados.nome}</strong>{" "}
          acabou de ser feito.
          <br />
          Deseja Verificar quantidade e canceladas?
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <button
          onClick={onRecusar}
          className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors"
        >
          Recusar
        </button>
        <button
          onClick={onAceitar}
          className="px-4 py-1.5 text-xs font-bold bg-blue-800 text-white hover:bg-blue-900 rounded shadow transition-colors"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
