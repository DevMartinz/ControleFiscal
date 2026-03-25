// src/components/DashboardResumo.jsx

export function DashboardResumo({
  empresas,
  categorias,
  totalTarefasRequeridas,
}) {
  const totalEmpresas = empresas.length;
  const totalTarefasGeral = totalEmpresas * totalTarefasRequeridas;

  let tarefasConcluidas = 0;
  let empresasCompletas = 0;
  let tarefasComAtencao = 0;

  empresas.forEach((emp) => {
    let okCount = 0;
    categorias.forEach((cat) => {
      cat.filhas.forEach((sub) => {
        const status = emp.tarefas[`${cat.nome}-${sub}`]?.status;
        if (status === "OK" || status === "NAO") {
          okCount++;
          tarefasConcluidas++;
        } else if (status === "Verificar") {
          tarefasComAtencao++;
        }
      });
    });
    if (okCount === totalTarefasRequeridas) {
      empresasCompletas++;
    }
  });

  const progressoGeral =
    totalTarefasGeral === 0
      ? 0
      : Math.round((tarefasConcluidas / totalTarefasGeral) * 100);

  return (
    <div className="flex items-center gap-2">
      <div
        title="Progresso geral do mês"
        className="flex items-center gap-1.5 bg-blue-100/50 border border-blue-200 text-blue-800 px-2 py-1 rounded text-[10px] font-bold shadow-sm"
      >
        <span>📈</span> {progressoGeral}% Concluído
      </div>

      <div
        title="Empresas totalmente finalizadas"
        className="flex items-center gap-1.5 bg-green-100/50 border border-green-200 text-green-800 px-2 py-1 rounded text-[10px] font-bold shadow-sm"
      >
        <span>✅</span> {empresasCompletas}/{totalEmpresas} Empresas
      </div>

      {/* Só mostra o alerta se houver alguma pendência, para não poluir a tela à toa */}
      {tarefasComAtencao > 0 && (
        <div
          title="Tarefas marcadas como NÃO ou VERIF"
          className="flex items-center gap-1.5 bg-amber-100/50 border border-amber-200 text-amber-800 px-2 py-1 rounded text-[10px] font-bold shadow-sm"
        >
          <span>⚠️</span> {tarefasComAtencao} Revisões
        </div>
      )}
    </div>
  );
}
