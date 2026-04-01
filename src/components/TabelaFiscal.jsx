import React, { useMemo, useState } from "react";

// Motor de Cores adaptado aos Temas
const getCorStatus = (status, tema) => {
  if (tema === "light") {
    if (status === "OK")
      return "bg-green-100 text-green-800 font-bold hover:bg-green-200";
    if (status === "NAO")
      return "bg-red-100 text-red-800 font-bold hover:bg-red-200";
    if (status === "Verificar")
      return "bg-amber-100 text-amber-800 font-bold hover:bg-amber-200";
    if (status === "Andamento")
      return "bg-sky-100 text-sky-800 font-bold hover:bg-sky-200";
    return "bg-transparent text-slate-500 font-medium hover:bg-slate-300 transition-colors";
  } else {
    // Cores modo Dark/Black (Fundo translúcido e texto brilhante)
    if (status === "OK")
      return "bg-emerald-900/40 text-emerald-400 font-bold hover:bg-emerald-800/60";
    if (status === "NAO")
      return "bg-rose-900/40 text-rose-400 font-bold hover:bg-rose-800/60";
    if (status === "Verificar")
      return "bg-amber-900/40 text-amber-400 font-bold hover:bg-amber-800/60";
    if (status === "Andamento")
      return "bg-sky-900/40 text-sky-400 font-bold hover:bg-sky-800/60";
    return `bg-transparent font-medium transition-colors ${tema === "dark" ? "text-slate-400 hover:bg-slate-700" : "text-zinc-500 hover:bg-zinc-800"}`;
  }
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
    tema,
  }) => {
    const [semMovimentos, setSemMovimentos] = useState(false);

    let tarefasOkCount = 0;
    categorias.forEach((cat) =>
      cat.filhas.forEach((sub) => {
        const status = emp.tarefas[`${cat.nome}-${sub}`]?.status;
        if (status === "OK" || status === "NAO") tarefasOkCount++;
      }),
    );

    const isCompleta = tarefasOkCount === totalTarefasRequeridas;
    const progresso = Math.round(
      (tarefasOkCount / totalTarefasRequeridas) * 100,
    );
    const temCnpj = Boolean(emp.cnpj && emp.cnpj.trim() !== "");
    const temPasta = Boolean(emp.pasta && emp.pasta.trim() !== "");

    // VARIÁVEIS DE TEMA PARA A LINHA
    const isLight = tema === "light";
    const isDark = tema === "dark";

    let corFundoLinha = "";
    let corHoverLinha = "";

    if (semMovimentos) {
      corFundoLinha = isLight
        ? "bg-slate-50"
        : isDark
          ? "bg-slate-800/50"
          : "bg-[#0a0a0a]";
      corHoverLinha = isLight
        ? "group-hover:bg-slate-100"
        : isDark
          ? "group-hover:bg-slate-700/50"
          : "group-hover:bg-zinc-900/50";
    } else if (isCompleta) {
      corFundoLinha = isLight
        ? "bg-green-50"
        : isDark
          ? "bg-emerald-900/10"
          : "bg-emerald-950/20";
      corHoverLinha = isLight
        ? "group-hover:bg-green-200"
        : isDark
          ? "group-hover:bg-emerald-900/30"
          : "group-hover:bg-emerald-900/40";
    } else {
      corFundoLinha = isLight
        ? "bg-white"
        : isDark
          ? "bg-slate-800"
          : "bg-[#0a0a0a]";
      corHoverLinha = isLight
        ? "group-hover:bg-slate-200"
        : isDark
          ? "group-hover:bg-slate-700"
          : "group-hover:bg-zinc-900";
    }

    const borderLinha = isLight
      ? "border-slate-200"
      : isDark
        ? "border-slate-700"
        : "border-zinc-800";
    const textEmpresa = isLight ? "text-slate-700" : "text-slate-300";
    const textUser = isLight ? "text-slate-500" : "text-slate-400";
    const borderEmpresa = isLight
      ? "border-slate-300"
      : isDark
        ? "border-slate-600"
        : "border-zinc-700";
    const outlineEmpresa = isLight
      ? "outline-slate-200"
      : isDark
        ? "outline-slate-700"
        : "outline-zinc-800";

    const bgProgressoTotal = semMovimentos
      ? isLight
        ? "bg-slate-400"
        : "bg-slate-600"
      : isCompleta
        ? isLight
          ? "bg-green-500"
          : "bg-emerald-500"
        : "bg-blue-500";
    const bgProgressoFundo = isLight
      ? "bg-slate-200"
      : isDark
        ? "bg-slate-700"
        : "bg-zinc-800";

    const borderCelula = isLight
      ? "border-slate-200"
      : isDark
        ? "border-slate-700/50"
        : "border-zinc-800/50";
    const hoverCelula = isLight
      ? "hover:bg-black/10 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
      : "hover:bg-white/5 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]";

    const btnAcaoVerde = isLight
      ? "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
      : "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-600 hover:text-white";
    const btnAcaoVermelho = isLight
      ? "bg-red-100 text-red-700 hover:bg-red-700 hover:text-white"
      : "bg-rose-900/40 text-rose-400 hover:bg-rose-600 hover:text-white";

    const divisorAcao = isLight
      ? "bg-slate-400"
      : isDark
        ? "bg-slate-600"
        : "bg-zinc-700";

    const btnSemMovHover = semMovimentos
      ? isLight
        ? "bg-slate-600 text-white hover:bg-slate-800"
        : "bg-slate-500 text-white hover:bg-slate-400"
      : isLight
        ? "bg-slate-200 text-slate-600 hover:bg-slate-500 hover:text-white"
        : "bg-slate-700 text-slate-400 hover:bg-slate-500 hover:text-white";

    const btnCopiarDesativado = isLight
      ? "bg-slate-200 text-slate-400 opacity-60"
      : "bg-slate-800 text-slate-500 opacity-60";
    const btnCopiarAtivado = isLight
      ? "bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white"
      : "bg-blue-900/30 text-blue-400 hover:bg-blue-600 hover:text-white";
    const btnCopiarOkAtivado = isLight
      ? "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
      : "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-600 hover:text-white";

    const textSemMovimento = isLight
      ? "text-slate-400 bg-slate-100"
      : "text-slate-500 bg-slate-800/50";

    return (
      <tr
        className={`border-b ${borderLinha} group transition-colors duration-150 ${corFundoLinha} ${corHoverLinha}`}
      >
        {/* FAIXA LATERAL */}
        {isPrimeiraDoGrupo && (
          <td
            rowSpan={rowSpanGrupo}
            className={`sticky left-0 z-30 w-[26px] min-w-[26px] max-w-[26px] p-0 border-r border-b border-white/20 align-top outline outline-1 ${isLight ? "outline-slate-300" : "outline-slate-800"} shadow-sm ${getCorGrupo(grupo)}`}
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
          className={`p-1.5 font-bold ${textEmpresa} border-r-2 ${borderEmpresa} sticky left-[26px] z-20 outline outline-1 ${outlineEmpresa} shadow-[3px_0_8px_-3px_rgba(0,0,0,0.05)] ${corFundoLinha} ${corHoverLinha}`}
        >
          <div className="flex items-center justify-between gap-1 w-full">
            <div className="flex flex-col w-full gap-0.5 overflow-hidden">
              <span
                className="truncate flex-1 uppercase tracking-tight flex items-center gap-1 text-[10px]"
                title={emp.nome}
              >
                {!semMovimentos && isCompleta && (
                  <span
                    className={`${isLight ? "text-green-600" : "text-emerald-400"} text-xs leading-none`}
                    title="100% Concluído"
                  >
                    ✔
                  </span>
                )}
                {emp.nome}
              </span>
              <div
                className={`w-full rounded-full h-1 ${bgProgressoFundo}`}
                title={`${progresso}% Concluído`}
              >
                <div
                  className={`h-1 rounded-full ${bgProgressoTotal}`}
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
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] cursor-pointer transition-colors ${btnAcaoVerde}`}
                      title="Preencher tudo com OK"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onAtualizarLinha(emp.id, "NAO")}
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] cursor-pointer transition-colors ${btnAcaoVermelho}`}
                      title="Preencher tudo com NÃO"
                    >
                      ✕
                    </button>
                    <div className={`w-[1px] h-3 mx-0.5 ${divisorAcao}`}></div>
                  </>
                )}

                <button
                  onClick={() => setSemMovimentos(!semMovimentos)}
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] cursor-pointer transition-colors ${btnSemMovHover}`}
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

                <div className={`w-[1px] h-3 mx-0.5 ${divisorAcao}`}></div>

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
                      ? btnCopiarDesativado
                      : isCompleta
                        ? btnCopiarOkAtivado
                        : btnCopiarAtivado
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
                      ? btnCopiarDesativado
                      : isCompleta
                        ? btnCopiarOkAtivado
                        : btnCopiarAtivado
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

        {/* TAREFAS */}
        {semMovimentos ? (
          <td
            colSpan={totalTarefasRequeridas}
            className={`tracking-[0.4em] uppercase font-bold text-[10px] text-center border-r ${textSemMovimento} ${borderLinha}`}
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
                  className={`p-0.5 border-r ${borderCelula} text-center relative z-0 ${hoverCelula} transition-all cursor-crosshair group/tooltip`}
                >
                  {/* TOOLTIP CUSTOMIZADO COM ATRASO */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1.5 bg-slate-800 dark:bg-black text-white text-[10px] font-bold rounded opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all delay-0 group-hover/tooltip:delay-[3000ms] pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-700">
                    {cat.nome}: {sub} ➔ {emp.nome}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-black"></div>
                  </div>

                  <select
                    value={info.status}
                    onChange={(e) =>
                      onAtualizarTarefa(emp.id, cat.nome, sub, e.target.value)
                    }
                    className={`w-full p-0.5 rounded text-[8px] font-bold border-none appearance-none cursor-crosshair outline-none focus:ring-1 focus:ring-blue-400 text-center ${getCorStatus(info.status, tema)}`}
                  >
                    <option
                      value="Pendente"
                      className={isLight ? "" : "bg-slate-800 text-slate-300"}
                    >
                      ---
                    </option>
                    <option
                      value="OK"
                      className={
                        isLight ? "" : "bg-emerald-900 text-emerald-400"
                      }
                    >
                      OK
                    </option>
                    <option
                      value="NAO"
                      className={isLight ? "" : "bg-rose-900 text-rose-400"}
                    >
                      NÃO
                    </option>
                    <option
                      value="Verificar"
                      className={isLight ? "" : "bg-amber-900 text-amber-400"}
                    >
                      VERIF
                    </option>
                    <option
                      value="Andamento"
                      className={isLight ? "" : "bg-sky-900 text-sky-400"}
                    >
                      ANDAM.
                    </option>
                  </select>

                  {info.user && info.status !== "Pendente" && (
                    <div className="mt-0.5 text-[6.5px] leading-none font-bold uppercase truncate max-w-full">
                      <span
                        className={
                          isCompleta
                            ? isLight
                              ? "text-green-800/70"
                              : "text-emerald-500/80"
                            : isLight
                              ? "text-blue-900/70"
                              : "text-blue-400/80"
                        }
                      >
                        {info.user.split(" ")[0]}
                      </span>
                      <br />
                      <span
                        className={`${textUser} font-medium tracking-tighter opacity-80`}
                      >
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
      prevProps.rowSpanGrupo === nextProps.rowSpanGrupo &&
      prevProps.tema === nextProps.tema
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
  tema = "light",
  carregando,
}) {
  const empresasFiltradas = useMemo(() => {
    const termo = filtro.toLowerCase().trim();
    if (!termo) return empresas;
    return empresas.filter((e) => {
      return (
        e.nome?.toLowerCase().includes(termo) ||
        e.sigla?.toLowerCase().includes(termo) ||
        e.cnpj?.toLowerCase().includes(termo) ||
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

  // DICIONÁRIOS DO CABEÇALHO DA TABELA
  const containerEstilos = {
    light: "border-slate-200 bg-white",
    dark: "border-slate-700 bg-slate-800",
    black: "border-zinc-800 bg-[#0a0a0a]",
  };

  const cabecalhoPrincipalEstilos = {
    light: "bg-blue-800 text-white border-blue-700/50 outline-blue-800",
    dark: "bg-slate-900 text-slate-200 border-slate-700 outline-slate-900",
    black: "bg-black text-slate-300 border-zinc-800 outline-black",
  };

  const cabecalhoEsqEstilos = {
    light: "bg-blue-900 outline-blue-900",
    dark: "bg-slate-950 outline-slate-950",
    black: "bg-zinc-950 outline-zinc-950",
  };

  const subCabecalhoEstilos = {
    light: "bg-gray-200 text-black border-blue-800 border-r-slate-300",
    dark: "bg-slate-800 text-slate-300 border-slate-900 border-r-slate-700",
    black: "bg-[#0a0a0a] text-slate-400 border-black border-r-zinc-800",
  };

  return (
    <main
      className={`max-w-[1920px] w-full h-[calc(100vh-90px)] mx-auto overflow-hidden rounded-xl border shadow-xl flex flex-col transition-colors duration-300 ${containerEstilos[tema]}`}
    >
      <div className="overflow-auto flex-1 w-full scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        <table className="w-full border-collapse table-auto relative">
          <thead>
            {/* CABEÇALHO AZUL/ESCURO */}
            <tr
              className={`text-[10px] uppercase tracking-wider sticky top-0 z-40 h-[30px] transition-colors ${cabecalhoPrincipalEstilos[tema]}`}
            >
              <th
                rowSpan="2"
                className={`w-[26px] min-w-[26px] max-w-[26px] p-0 border-r border-b sticky left-0 top-0 z-50 outline outline-1 transition-colors ${cabecalhoEsqEstilos[tema]} border-transparent`}
              ></th>
              <th
                rowSpan="2"
                className={`p-2 text-left font-bold border-r-2 border-b sticky left-[26px] top-0 z-50 w-[18%] outline outline-1 transition-colors ${cabecalhoPrincipalEstilos[tema]}`}
              >
                EMPRESAS
              </th>
              {categorias.map((cat) => (
                <th
                  key={cat.nome}
                  colSpan={cat.filhas.length}
                  className="p-1 text-center border-r border-b border-inherit leading-tight"
                >
                  {cat.nome}
                </th>
              ))}
            </tr>
            {/* SUB-CABEÇALHO */}
            <tr
              className={`text-[9px] uppercase font-bold border-b sticky top-[30px] z-40 transition-colors ${subCabecalhoEstilos[tema]}`}
            >
              {categorias.map((cat) =>
                cat.filhas.map((f) => (
                  <th
                    key={`${cat.nome}-${f}`}
                    className="p-0.5 border-r border-inherit leading-none whitespace-nowrap px-1 shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.05)]"
                  >
                    {f}
                  </th>
                )),
              )}
            </tr>
          </thead>

          <tbody>
            {carregando ? (
              // UX DE CARREGAMENTO PREMIUM
              <tr>
                <td colSpan={totalTarefasRequeridas + 2} className="p-20">
                  <div className="flex flex-col items-center justify-center w-full h-full gap-5 animate-pulse">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="flex flex-col items-center">
                      <span
                        className={`font-black text-sm tracking-widest uppercase ${tema === "light" ? "text-slate-600" : "text-slate-300"}`}
                      >
                        Sincronizando Base de Dados
                      </span>
                      <span
                        className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${tema === "light" ? "text-slate-400" : "text-slate-500"}`}
                      >
                        Buscando empresas, tarefas e histórico...
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : empresasFiltradas.length === 0 ? (
              // CASO NÃO ENCONTRE NADA NA BUSCA
              <tr>
                <td
                  colSpan={totalTarefasRequeridas + 2}
                  className="p-8 text-center text-slate-500 font-medium"
                >
                  Nenhuma empresa encontrada com a busca "{filtro}"
                </td>
              </tr>
            ) : (
              // RENDERIZAÇÃO NORMAL DAS EMPRESAS
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
                    tema={tema}
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
