import React, { useMemo, useState } from "react";

const getCorStatus = (status) => {
  if (status === "OK")
    return "bg-green-100 text-green-800 font-bold hover:bg-green-200";
  if (status === "NAO")
    return "bg-red-100 text-red-800 font-bold hover:bg-red-200";
  if (status === "Verificar")
    return "bg-amber-100 text-amber-800 font-bold hover:bg-amber-200";
  if (status === "Andamento")
    return "bg-sky-100 text-sky-800 font-bold hover:bg-sky-200";

  return "bg-transparent text-slate-500 font-medium hover:bg-slate-300 transition-colors";
};

const getCorGrupo = (grupoNome) => {
  if (grupoNome === "UTIL SHOW") return "bg-purple-600";
  if (grupoNome === "Simples Nacional") return "bg-orange-500";
  if (grupoNome === "PB") return "bg-green-600";
  if (grupoNome === "RN") return "bg-blue-600";
  return "bg-slate-600";
};

const LinhaDaTabela = React.memo(
  ({
    emp,
    grupo,
    isPrimeiraDoGrupo,
    rowSpanGrupo,
    categorias,
    totalTarefasRequeridas,
    onAtualizarTarefa,
    onAtualizarLinha,
  }) => {
    const [semMovimentos, setSemMovimentos] = useState(false);

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

    const corFundoLinha = semMovimentos
      ? "bg-slate-50"
      : isCompleta
        ? "bg-green-50"
        : "bg-white";
    const corHoverLinha = semMovimentos
      ? "group-hover:bg-slate-100"
      : isCompleta
        ? "group-hover:bg-green-200"
        : "group-hover:bg-slate-200";

    const temCnpj = Boolean(emp.cnpj && emp.cnpj.trim() !== "");
    const temPasta = Boolean(emp.pasta && emp.pasta.trim() !== "");

    return (
      <tr
        className={`border-b border-slate-200 group transition-colors duration-150 ${corFundoLinha} ${corHoverLinha}`}
      >
        {isPrimeiraDoGrupo && (
          <td
            rowSpan={rowSpanGrupo}
            className={`sticky left-0 z-30 w-[26px] min-w-[26px] max-w-[26px] p-0 border-r border-b border-white/20 align-top outline outline-1 outline-slate-300 shadow-sm ${getCorGrupo(grupo)}`}
          >
            <div className="sticky top-[80px] flex items-center justify-center min-h-[60px] py-6">
              <span
                className="text-white font-extrabold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap opacity-90"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {grupo}
              </span>
            </div>
          </td>
        )}

        {/* COLUNA DA EMPRESA */}
        <td
          className={`p-1.5 font-bold text-slate-700 border-r-2 border-slate-300 sticky left-[26px] z-20 outline outline-1 outline-slate-200 shadow-[3px_0_8px_-3px_rgba(0,0,0,0.05)] ${corFundoLinha} ${corHoverLinha}`}
        >
          <div className="flex items-center justify-between gap-1 w-full">
            <div className="flex flex-col w-full gap-0.5 overflow-hidden">
              <span
                className="truncate flex-1 uppercase tracking-tight flex items-center gap-1 text-[10px]"
                title={emp.nome}
              >
                {!semMovimentos && isCompleta && (
                  <span
                    className="text-green-600 text-xs leading-none"
                    title="100% Concluído"
                  >
                    ✔
                  </span>
                )}
                {emp.nome}
              </span>
              <div
                className="w-full bg-slate-200 rounded-full h-1"
                title={`${progresso}% Concluído`}
              >
                <div
                  className={`h-1 rounded-full ${semMovimentos ? "bg-slate-400" : isCompleta ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${semMovimentos ? 100 : progresso}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!semMovimentos && (
                  <>
                    <button
                      onClick={() => onAtualizarLinha(emp.id, "OK")}
                      className="w-4 h-4 rounded bg-green-100 text-green-700 hover:bg-green-700 hover:text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                      title="Preencher tudo com OK"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onAtualizarLinha(emp.id, "NAO")}
                      className="w-4 h-4 rounded bg-red-100 text-red-700 hover:bg-red-700 hover:text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                      title="Preencher tudo com NÃO"
                    >
                      ✕
                    </button>
                    <div className="w-[1px] h-3 bg-slate-400 mx-0.5"></div>
                  </>
                )}

                <button
                  onClick={() => setSemMovimentos(!semMovimentos)}
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] cursor-pointer transition-colors ${
                    semMovimentos
                      ? "bg-slate-600 text-white hover:bg-slate-800"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-500 hover:text-white"
                  }`}
                  title={
                    semMovimentos
                      ? "Desmarcar Sem Movimentos"
                      : "Marcar como Sem Movimentos"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-2.5 h-2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </button>

                <div className="w-[1px] h-3 bg-slate-400 mx-0.5"></div>

                <button
                  title={
                    temCnpj
                      ? `CNPJ: ${emp.cnpj} (Clique para copiar)`
                      : "CNPJ não cadastrado"
                  }
                  onClick={() => {
                    if (temCnpj) navigator.clipboard.writeText(emp.cnpj);
                  }}
                  disabled={!temCnpj}
                  className={`w-4 h-4 rounded flex items-center justify-center text-[9px] transition-colors ${
                    !temCnpj
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white cursor-pointer"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </button>

                <button
                  title={
                    temPasta
                      ? `Pasta: ${emp.pasta} (Clique para copiar)`
                      : "Pasta não configurada"
                  }
                  onClick={() => {
                    if (temPasta) navigator.clipboard.writeText(emp.pasta);
                  }}
                  disabled={!temPasta}
                  className={`w-4 h-4 rounded flex items-center justify-center text-[9px] transition-colors ${
                    !temPasta
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white cursor-pointer"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </td>

        {/* RENDERIZAÇÃO CONDICIONAL */}
        {semMovimentos ? (
          <td
            colSpan={totalTarefasRequeridas}
            className="bg-slate-100 text-slate-400 tracking-[0.4em] uppercase font-bold text-[10px] text-center border-r border-slate-200"
          >
            <div className="flex items-center justify-center gap-2 opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              SEM MOVIMENTOS
            </div>
          </td>
        ) : (
          categorias.map((cat) =>
            cat.filhas.map((sub) => {
              const info = emp.tarefas[`${cat.nome}-${sub}`] || {
                status: "Pendente",
              };
              return (
                <td
                  key={`${cat.nome}-${sub}`}
                  title={`${cat.nome}: ${sub} ➔ ${emp.nome}`}
                  className="p-0.5 border-r border-slate-200 text-center relative z-0 hover:bg-black/10 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] transition-all cursor-crosshair"
                >
                  <select
                    value={info.status}
                    onChange={(e) =>
                      onAtualizarTarefa(emp.id, cat.nome, sub, e.target.value)
                    }
                    className={`w-full p-0.5 rounded text-[8px] font-bold border-none appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-blue-400 text-center ${getCorStatus(info.status)}`}
                  >
                    <option value="Pendente">---</option>
                    <option value="OK">OK</option>
                    <option value="NAO">NÃO</option>
                    <option value="Verificar">VERIF</option>
                    <option value="Andamento">ANDAM.</option>
                  </select>

                  {info.user && info.status !== "Pendente" && (
                    <div className="mt-0.5 text-[6.5px] text-slate-500 leading-none font-bold uppercase truncate max-w-full">
                      <span
                        className={
                          isCompleta ? "text-green-800/70" : "text-blue-900/70"
                        }
                      >
                        {info.user.split(" ")[0]}
                      </span>
                      <br />
                      <span className="text-slate-500 font-medium tracking-tighter">
                        {info.data}
                      </span>
                    </div>
                  )}
                </td>
              );
            }),
          )
        )}
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.emp === nextProps.emp &&
      prevProps.isPrimeiraDoGrupo === nextProps.isPrimeiraDoGrupo &&
      prevProps.rowSpanGrupo === nextProps.rowSpanGrupo
    );
  },
);

export function TabelaFiscal({
  empresas,
  filtro,
  categorias,
  totalTarefasRequeridas,
  onAtualizarTarefa,
  onAtualizarLinha,
}) {
  // Filtro Inteligente: Pesquisa em múltiplos campos simultaneamente
  const empresasFiltradas = useMemo(() => {
    const termo = filtro.toLowerCase().trim();

    if (!termo) return empresas;

    return empresas.filter((e) => {
      return (
        e.nome?.toLowerCase().includes(termo) ||
        e.sigla?.toLowerCase().includes(termo) ||
        e.cnpj?.toLowerCase().includes(termo) ||
        // O grupoNome já contém as informações de UF (RN/PB) e Regime (Simples/Lucro)
        e.grupoNome?.toLowerCase().includes(termo)
      );
    });
  }, [empresas, filtro]);

  const contagemGrupos = useMemo(() => {
    const contagem = {};
    empresasFiltradas.forEach((emp) => {
      const g = emp.grupoNome || "OUTROS";
      contagem[g] = (contagem[g] || 0) + 1;
    });
    return contagem;
  }, [empresasFiltradas]);

  return (
    <main className="max-w-[1920px] w-full h-[calc(100vh-90px)] mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl flex flex-col">
      <div className="overflow-auto flex-1 w-full scrollbar-thin scrollbar-thumb-slate-300">
        <table className="w-full border-collapse table-auto relative">
          <thead>
            <tr className="bg-blue-800 text-white text-[10px] uppercase tracking-wider sticky top-0 z-40 h-[30px]">
              <th
                rowSpan="2"
                className="w-[26px] min-w-[26px] max-w-[26px] p-0 bg-blue-900 border-r border-b border-blue-700/50 sticky left-0 top-0 z-50 outline outline-1 outline-blue-900"
              ></th>
              <th
                rowSpan="2"
                className="p-2 text-left font-bold border-r-2 border-b border-blue-700/50 border-r-blue-900 bg-blue-800 text-white sticky left-[26px] top-0 z-50 w-[18%] outline outline-1 outline-blue-800"
              >
                EMPRESAS
              </th>
              {categorias.map((cat) => (
                <th
                  key={cat.nome}
                  colSpan={cat.filhas.length}
                  className="p-1 text-center border-r border-b border-blue-700/50 leading-tight"
                >
                  {cat.nome}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-200 text-black text-[9px] uppercase font-bold border-b border-blue-800 sticky top-[30px] z-40">
              {categorias.map((cat) =>
                cat.filhas.map((f) => (
                  <th
                    key={`${cat.nome}-${f}`}
                    className="p-0.5 border-r border-slate-300 bg-gray-200 leading-none whitespace-nowrap px-1 shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)]"
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
                  colSpan={totalTarefasRequeridas + 2}
                  className="p-8 text-center text-slate-500 font-medium"
                >
                  Nenhuma empresa encontrada com a busca "{filtro}"
                </td>
              </tr>
            ) : (
              empresasFiltradas.map((emp, index) => {
                const grupo = emp.grupoNome || "OUTROS";
                const grupoAnterior =
                  index > 0
                    ? empresasFiltradas[index - 1].grupoNome || "OUTROS"
                    : null;
                const isPrimeiraDoGrupo =
                  index === 0 || grupo !== grupoAnterior;

                return (
                  <LinhaDaTabela
                    key={emp.id}
                    emp={emp}
                    grupo={grupo}
                    isPrimeiraDoGrupo={isPrimeiraDoGrupo}
                    rowSpanGrupo={contagemGrupos[grupo]}
                    categorias={categorias}
                    totalTarefasRequeridas={totalTarefasRequeridas}
                    onAtualizarTarefa={onAtualizarTarefa}
                    onAtualizarLinha={onAtualizarLinha}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
