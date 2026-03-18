export function TabelaFiscal({
  empresas,
  filtro,
  categorias,
  totalTarefasRequeridas,
  onAtualizarTarefa,
}) {
  // Função que decide as cores fica aqui dentro, pois só a tabela a utiliza!
  const getCorStatus = (status) => {
    if (status === "OK") return "bg-green-100 border-green-500 text-green-700";
    if (status === "NAO") return "bg-red-100 border-red-500 text-red-700";
    if (status === "Verificar")
      return "bg-amber-100 border-amber-500 text-amber-700";
    if (status === "Andamento") return "bg-sky-100 border-sky-500 text-sky-700";
    return "bg-white border-slate-200 text-slate-400";
  };

  // Filtra as empresas antes de desenhar a tabela
  const empresasFiltradas = empresas.filter((e) =>
    e.nome.toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <main className="max-w-[1800px] w-full mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl flex-1">
      <div className="overflow-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-300">
        <table className="w-full border-collapse">
          <thead>
            {/* LINHA 1: Categorias */}
            <tr className="bg-blue-800 text-white text-[10px] uppercase tracking-wider sticky top-0 z-40 h-[34px]">
              <th
                rowSpan="2"
                className="p-3 text-left font-bold border-r border-b border-blue-700/50 bg-blue-800 text-white sticky left-0 top-0 z-50 w-[170px]"
              >
                EMPRESAS
              </th>
              {categorias.map((cat) => (
                <th
                  key={cat.nome}
                  colSpan={cat.filhas.length}
                  className="p-1 text-center border-r border-b border-blue-700/50"
                >
                  {cat.nome}
                </th>
              ))}
            </tr>
            {/* LINHA 2: Sub-filhas */}
            <tr className="bg-gray-200 text-black text-[9px] uppercase font-bold border-b border-blue-800 sticky top-[34px] z-40">
              {categorias.map((cat) =>
                cat.filhas.map((f) => (
                  <th
                    key={`${cat.nome}-${f}`}
                    className="p-1 border-r border-blue-600/50 bg-gray-200"
                  >
                    {f}
                  </th>
                )),
              )}
            </tr>
          </thead>

          <tbody>
            {empresasFiltradas.length === 0 ? (
              <tr>
                <td
                  colSpan={totalTarefasRequeridas + 1}
                  className="p-8 text-center text-slate-500 font-medium"
                >
                  Nenhuma empresa encontrada com a busca "{filtro}"
                </td>
              </tr>
            ) : (
              empresasFiltradas.map((emp) => {
                let tarefasOkCount = 0;
                categorias.forEach((cat) =>
                  cat.filhas.forEach((sub) => {
                    if (emp.tarefas[`${cat.nome}-${sub}`]?.status === "OK")
                      tarefasOkCount++;
                  }),
                );

                const isCompleta = tarefasOkCount === totalTarefasRequeridas;
                const progresso = Math.round(
                  (tarefasOkCount / totalTarefasRequeridas) * 100,
                );

                return (
                  <tr
                    key={emp.id}
                    className={`border-b transition-all duration-300 group ${isCompleta ? "bg-green-50 hover:bg-green-100 border-green-200" : "border-slate-100 hover:bg-blue-50/50"}`}
                  >
                    <td
                      className={`p-2 font-bold text-slate-700 border-r border-slate-200 sticky left-0 z-20 text-[10px] shadow-sm transition-colors duration-300 ${isCompleta ? "bg-green-50 group-hover:bg-green-100" : "bg-white group-hover:bg-blue-50/50"}`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex flex-col w-full gap-1 overflow-hidden">
                          <span
                            className="truncate flex-1 uppercase tracking-tight flex items-center gap-1.5"
                            title={emp.nome}
                          >
                            {isCompleta && (
                              <span
                                className="text-green-600 text-sm leading-none"
                                title="100% Concluído"
                              >
                                ✔
                              </span>
                            )}
                            {emp.nome}
                          </span>
                          <div
                            className="w-full bg-slate-200 rounded-full h-1 mt-0.5"
                            title={`${progresso}% Concluído`}
                          >
                            <div
                              className={`h-1 rounded-full transition-all duration-500 ${isCompleta ? "bg-green-500" : "bg-blue-500"}`}
                              style={{ width: `${progresso}%` }}
                            ></div>
                          </div>
                        </div>

                        <div
                          title={`Pasta: ${emp.pasta || "Não configurada"}`}
                          className={`flex-shrink-0 w-3.5 h-3.5 border rounded-full flex items-center justify-center text-[9px] font-serif italic cursor-help transition-all shadow-sm ${isCompleta ? "border-green-300 text-green-600 bg-green-100 hover:bg-green-600 hover:text-white" : "border-blue-200 text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white"}`}
                        >
                          i
                        </div>
                      </div>
                    </td>

                    {categorias.map((cat) =>
                      cat.filhas.map((sub) => {
                        const info = emp.tarefas[`${cat.nome}-${sub}`] || {
                          status: "Pendente",
                        };
                        return (
                          <td
                            key={`${cat.nome}-${sub}`}
                            className={`p-2 border-r text-center min-w-[80px] ${isCompleta ? "border-green-100" : "border-slate-100"}`}
                          >
                            <select
                              value={info.status}
                              onChange={(e) =>
                                onAtualizarTarefa(
                                  emp.id,
                                  cat.nome,
                                  sub,
                                  e.target.value,
                                )
                              }
                              className={`w-full p-1 rounded text-[9px] font-bold border transition-all cursor-pointer outline-none focus:ring-1 focus:ring-blue-800 shadow-sm ${getCorStatus(info.status)}`}
                            >
                              <option value="Pendente">---</option>
                              <option value="OK">OK</option>
                              <option value="NAO">NÃO</option>
                              <option value="Verificar">VERIF</option>
                              <option value="Andamento">ANDAM.</option>
                            </select>
                            {info.user && info.status !== "Pendente" && (
                              <div className="mt-1 text-[7px] text-slate-400 leading-none font-bold uppercase">
                                <span
                                  className={
                                    isCompleta
                                      ? "text-green-700/60"
                                      : "text-blue-900/60"
                                  }
                                >
                                  {info.user.split(" ")[0]}
                                </span>
                                <br />
                                {info.data}
                              </div>
                            )}
                          </td>
                        );
                      }),
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
