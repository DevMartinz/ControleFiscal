import React, { useMemo, useState } from "react";
import { EmpresaModalInfo } from "./EmpresaModalInfo";

const getCorStatus = (status, tema) => {
	if (tema === "light") {
		if (status === "OK")
			return "bg-green-100 text-green-800 hover:bg-green-200";
		if (status === "NAO") return "bg-red-100 text-red-800 hover:bg-red-200";
		if (status === "Verificar")
			return "bg-amber-100 text-amber-800 hover:bg-amber-200";
		if (status === "Andamento")
			return "bg-sky-100 text-sky-800 hover:bg-sky-200";
		return "bg-transparent text-slate-500 hover:bg-slate-200";
	} else {
		if (status === "OK")
			return "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/70";
		if (status === "NAO")
			return "bg-rose-900/50 text-rose-300 hover:bg-rose-800/70";
		if (status === "Verificar")
			return "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70";
		if (status === "Andamento")
			return "bg-sky-900/60 text-sky-300 hover:bg-sky-800/80";
		return `bg-transparent ${tema === "dark" ? "text-slate-400 hover:bg-slate-700" : "text-zinc-500 hover:bg-zinc-800"}`;
	}
};

const getCorGrupo = (grupoNome) => {
	if (grupoNome === "UTIL SHOW") return "bg-purple-600";
	if (grupoNome === "Simples Nacional") return "bg-orange-500";
	if (grupoNome === "PB") return "bg-green-600";
	if (grupoNome === "RN") return "bg-blue-600";
	return "bg-slate-600";
};

const formatarNomeUsuario = (nomeCompleto) => {
	if (!nomeCompleto) return "";
	const partes = nomeCompleto.trim().split(" ");
	if (partes.length === 1) return partes[0];
	return `${partes[0]} ${partes[1].charAt(0)}.`;
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
		onAbrirModal,
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

		const isLight = tema === "light";
		const isDark = tema === "dark";

		let corFundoLinha = "";
		let corHoverLinha = "";

		// UX: Hover Escurecido no Modo Claro para garantir leitura e orientação visual
		if (semMovimentos) {
			corFundoLinha = isLight
				? "bg-slate-50"
				: isDark
					? "bg-slate-800/50"
					: "bg-[#0a0a0a]";
			corHoverLinha = isLight
				? "group-hover:bg-slate-300"
				: isDark
					? "group-hover:bg-slate-700"
					: "group-hover:bg-zinc-900";
		} else if (isCompleta) {
			corFundoLinha = isLight
				? "bg-green-50/50"
				: isDark
					? "bg-emerald-900/10"
					: "bg-emerald-950/20";
			corHoverLinha = isLight
				? "group-hover:bg-green-200"
				: isDark
					? "group-hover:bg-emerald-900/40"
					: "group-hover:bg-emerald-900/50";
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
					: "group-hover:bg-zinc-800";
		}

		const borderLinha = isLight
			? "border-slate-100"
			: isDark
				? "border-slate-700/50"
				: "border-zinc-800/50";
		const textEmpresa = isLight ? "text-slate-700" : "text-slate-200";
		const textUser = isLight ? "text-slate-400" : "text-slate-500";

		const borderEmpresa = isLight
			? "border-slate-200"
			: isDark
				? "border-slate-700"
				: "border-zinc-800";
		const shadowEmpresa = isLight
			? "shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]"
			: "shadow-[4px_0_12px_-4px_rgba(0,0,0,0.3)]";

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
			? "bg-slate-100"
			: isDark
				? "bg-slate-700"
				: "bg-zinc-800";

		const btnAcaoVerde = isLight
			? "text-green-600 hover:bg-green-500 hover:text-white"
			: "text-emerald-400 hover:bg-emerald-500 hover:text-white";
		const btnAcaoVermelho = isLight
			? "text-red-600 hover:bg-red-500 hover:text-white"
			: "text-rose-400 hover:bg-rose-500 hover:text-white";
		const divisorAcao = isLight
			? "bg-slate-300"
			: isDark
				? "bg-slate-600"
				: "bg-zinc-700";
		const btnSemMovHover = semMovimentos
			? isLight
				? "bg-slate-600 text-white"
				: "bg-slate-500 text-white"
			: isLight
				? "text-slate-400 hover:bg-slate-400 hover:text-white"
				: "text-slate-400 hover:bg-slate-500 hover:text-white";
		const btnCopiarDesativado = isLight
			? "text-slate-300 opacity-50"
			: "text-slate-600 opacity-50";
		const btnCopiarAtivado = isLight
			? "text-blue-500 hover:bg-blue-500 hover:text-white"
			: "text-blue-400 hover:bg-blue-500 hover:text-white";
		const textSemMovimento = isLight
			? "text-slate-400 bg-slate-50 rounded-xl"
			: "text-slate-500 bg-slate-800/30 rounded-xl";
		const acaoFlutuanteBg = isLight
			? "bg-white border-slate-200 shadow-sm"
			: "bg-slate-800 border-slate-600 shadow-md";

		return (
			<tr
				className={`border-b ${borderLinha} group transition-colors duration-150 ${corFundoLinha} ${corHoverLinha}`}
			>
				{isPrimeiraDoGrupo && (
					<td
						rowSpan={rowSpanGrupo}
						className={`sticky left-0 z-30 w-[24px] min-w-[24px] max-w-[24px] p-0 border-r border-b border-white/10 align-top ${getCorGrupo(grupo)}`}
					>
						<div className="sticky top-[80px] w-full flex justify-center py-4">
							<span
								className="text-white font-extrabold text-[9px] uppercase tracking-[0.2em] whitespace-nowrap opacity-90 drop-shadow-sm"
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

				<td
					className={`py-1 px-1.5 font-bold ${textEmpresa} border-r ${borderEmpresa} sticky left-[24px] z-20 w-[220px] min-w-[220px] max-w-[220px] ${shadowEmpresa} transition-colors duration-150 ${corFundoLinha} ${corHoverLinha}`}
				>
					<div className="flex items-center justify-between gap-1 w-full">
						<div className="flex flex-col w-full gap-0.5 overflow-hidden">
							<div className="flex items-center gap-1.5">
								<button
									onClick={() => onAbrirModal(emp)}
									title="Detalhes"
									className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors focus:outline-none ${isLight ? "border-slate-300 text-slate-400 hover:bg-blue-500 hover:text-white hover:border-transparent" : "border-slate-500 text-slate-400 hover:bg-blue-500 hover:text-white hover:border-transparent"}`}
								>
									<span className="font-serif italic text-[9px] font-black leading-none">
										i
									</span>
								</button>

								<span
									className="truncate flex-1 uppercase tracking-tight flex items-center gap-1.5 text-[10px] leading-tight"
									title={emp.nome}
								>
									{!semMovimentos && isCompleta && (
										<span
											className={`${isLight ? "text-green-500" : "text-emerald-400"} text-[10px] leading-none drop-shadow-sm`}
											title="100% Concluído"
										>
											✔
										</span>
									)}
									{emp.nome}
								</span>
							</div>

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

						<div className="flex items-center flex-shrink-0">
							<div
								className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 px-1 py-0.5 rounded-full border ${acaoFlutuanteBg}`}
							>
								{!semMovimentos && (
									<>
										<button
											onClick={() => onAtualizarLinha(emp.id, "OK")}
											className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors ${btnAcaoVerde}`}
											title="Tudo OK"
										>
											✓
										</button>
										<button
											onClick={() => onAtualizarLinha(emp.id, "NAO")}
											className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors ${btnAcaoVermelho}`}
											title="Tudo NÃO"
										>
											✕
										</button>
										<div className={`w-[1px] h-3 mx-0.5 ${divisorAcao}`}></div>
									</>
								)}
								<button
									onClick={() => setSemMovimentos(!semMovimentos)}
									className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors ${btnSemMovHover}`}
									title="Sem Movimentos"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2.5}
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
									disabled={!temCnpj}
									onClick={() => {
										if (temCnpj) navigator.clipboard.writeText(emp.cnpj);
									}}
									className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors ${!temCnpj ? btnCopiarDesativado : btnCopiarAtivado}`}
									title="Copiar CNPJ"
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
											d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
										/>
									</svg>
								</button>
								<button
									disabled={!temPasta}
									onClick={() => {
										if (temPasta) navigator.clipboard.writeText(emp.pasta);
									}}
									className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] transition-colors ${!temPasta ? btnCopiarDesativado : btnCopiarAtivado}`}
									title="Copiar Pasta"
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
											d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</td>

				{semMovimentos ? (
					<td colSpan={totalTarefasRequeridas} className="py-0.5">
						<div
							className={`flex items-center justify-center h-full w-full py-0.5 ${textSemMovimento}`}
						>
							<span className="tracking-[0.4em] uppercase font-bold text-[8px] flex items-center gap-2 opacity-80">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-3 h-3"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
									/>
								</svg>
								Sem Movimentos
							</span>
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
									className="px-0.5 py-0 text-center relative z-0 w-[70px] min-w-[70px] max-w-[70px] transition-all cursor-crosshair group/tooltip"
								>
									<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1.5 bg-slate-800 dark:bg-black text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all delay-0 group-hover/tooltip:delay-[3000ms] pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-700">
										{cat.nome}: {sub} ➔ {emp.nome}
										<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-black"></div>
									</div>

									<select
										value={info.status}
										onChange={(e) =>
											onAtualizarTarefa(emp.id, cat.nome, sub, e.target.value)
										}
										className={`w-full py-[1.5px] px-0.5 rounded-full text-[8px] font-bold border-none appearance-none cursor-crosshair outline-none focus:ring-2 focus:ring-blue-400 text-center shadow-sm ${getCorStatus(info.status, tema)}`}
									>
										<option
											value="Pendente"
											className={
												isLight
													? "bg-white text-slate-800"
													: "bg-slate-800 text-slate-300"
											}
										>
											---
										</option>
										<option
											value="OK"
											className={
												isLight
													? "bg-white text-emerald-700"
													: "bg-emerald-950 text-emerald-400"
											}
										>
											OK
										</option>
										<option
											value="NAO"
											className={
												isLight
													? "bg-white text-rose-700"
													: "bg-rose-950 text-rose-400"
											}
										>
											NÃO
										</option>
										<option
											value="Verificar"
											className={
												isLight
													? "bg-white text-amber-700"
													: "bg-amber-950 text-amber-400"
											}
										>
											VERIF
										</option>
										<option
											value="Andamento"
											className={
												isLight
													? "bg-white text-sky-700"
													: "bg-sky-950 text-sky-400"
											}
										>
											ANDAM.
										</option>
									</select>

									{info.user && info.status !== "Pendente" && (
										<div className="mt-[1px] text-[6px] leading-none font-bold uppercase truncate max-w-full">
											<span
												className={
													isCompleta
														? isLight
															? "text-green-700/80"
															: "text-emerald-500/90"
														: isLight
															? "text-blue-700/80"
															: "text-blue-400/90"
												}
											>
												{formatarNomeUsuario(info.user)}
											</span>
											<br />
											<span
												className={`${textUser} tracking-tighter opacity-60`}
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
	const [empresaModalSelecionada, setEmpresaModalSelecionada] = useState(null);

	const empresasFiltradas = useMemo(() => {
		const termo = filtro.toLowerCase().trim();
		if (!termo) return empresas;
		return empresas.filter((e) => {
			return (
				e.nome?.toLowerCase().includes(termo) ||
				e.name?.toLowerCase().includes(termo) ||
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

	const containerEstilos = {
		light: "border-slate-200 bg-white shadow-xl shadow-slate-200/50",
		dark: "border-slate-700 bg-slate-800 shadow-2xl shadow-black/40",
		black: "border-zinc-800 bg-[#0a0a0a]",
	};

	const cabecalhoPrincipalEstilos = {
		light: "bg-blue-800 text-white border-blue-700 outline-blue-800 shadow-sm",
		dark: "bg-slate-900 text-slate-200 border-slate-700 outline-slate-900 shadow-sm",
		black: "bg-black text-slate-300 border-zinc-800 outline-black shadow-sm",
	};

	const cabecalhoEsqEstilos = {
		light: "bg-blue-900 outline-blue-900",
		dark: "bg-slate-950 outline-slate-950",
		black: "bg-zinc-950 outline-zinc-950",
	};

	const subCabecalhoEstilos = {
		light: "bg-slate-100 text-slate-600 border-b-slate-200",
		dark: "bg-slate-800 text-slate-400 border-b-slate-700",
		black: "bg-[#0a0a0a] text-zinc-500 border-b-zinc-800",
	};

	return (
		<>
			<main
				className={`max-w-[1920px] w-full h-[calc(100vh-90px)] mx-auto overflow-hidden rounded-2xl border flex flex-col transition-colors duration-300 ${containerEstilos[tema]}`}
			>
				<div className="overflow-auto flex-1 w-full bg-inherit scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 rounded-b-2xl">
					<table className="w-max min-w-full border-collapse relative bg-inherit">
						<thead>
							<tr
								className={`text-[10px] uppercase tracking-wider sticky top-0 z-40 h-[34px] transition-colors ${cabecalhoPrincipalEstilos[tema]}`}
							>
								<th
									rowSpan="2"
									className={`w-[24px] min-w-[24px] max-w-[24px] p-0 border-b sticky left-0 top-0 z-50 outline outline-1 transition-colors ${cabecalhoEsqEstilos[tema]} border-transparent`}
								></th>
								<th
									rowSpan="2"
									className={`px-2 py-1 text-left font-black border-r border-b sticky left-[24px] top-0 z-50 w-[220px] min-w-[220px] max-w-[220px] outline outline-1 transition-colors ${cabecalhoPrincipalEstilos[tema]} ${tema === "light" ? "border-blue-700" : "border-slate-700/50"}`}
								>
									EMPRESAS
								</th>
								{categorias.map((cat) => (
									<th
										key={cat.nome}
										colSpan={cat.filhas.length}
										className="p-1 text-center border-b border-inherit leading-tight"
									>
										{cat.nome}
									</th>
								))}
							</tr>
							<tr
								className={`text-[8px] uppercase font-bold border-b sticky top-[34px] z-40 transition-colors ${subCabecalhoEstilos[tema]}`}
							>
								{categorias.map((cat) =>
									cat.filhas.map((f) => (
										<th
											key={`${cat.nome}-${f}`}
											className="py-0.5 px-1 leading-none whitespace-nowrap w-[70px] min-w-[70px] max-w-[70px] opacity-80"
										>
											{f}
										</th>
									)),
								)}
							</tr>
						</thead>

						<tbody>
							{carregando ? (
								<tr>
									<td colSpan={totalTarefasRequeridas + 2} className="p-20">
										<div className="flex flex-col items-center justify-center w-full h-full gap-5 animate-pulse">
											<div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
											<div className="flex flex-col items-center">
												<span
													className={`font-black text-sm tracking-widest uppercase ${tema === "light" ? "text-slate-600" : "text-slate-300"}`}
												>
													Sincronizando Base de Dados
												</span>
												<span
													className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${tema === "light" ? "text-slate-400" : "text-slate-500"}`}
												>
													Buscando empresas, tarefas e histórico no Supabase...
												</span>
											</div>
										</div>
									</td>
								</tr>
							) : empresasFiltradas.length === 0 ? (
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
											onAbrirModal={setEmpresaModalSelecionada}
											tema={tema}
										/>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</main>

			<EmpresaModalInfo
				empresa={empresaModalSelecionada}
				isOpen={!!empresaModalSelecionada}
				onClose={() => setEmpresaModalSelecionada(null)}
				tema={tema}
			/>
		</>
	);
}
