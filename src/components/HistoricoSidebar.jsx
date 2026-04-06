import React, { useState, useMemo } from "react";

export function HistoricoSidebar({
	mostrar,
	historico,
	onFechar,
	tema = "light",
}) {
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

	// --- ESTILOS PREMIUM ---
	const estilos = {
		overlay: "bg-slate-900/40 backdrop-blur-sm",
		sidebar:
			tema === "light"
				? "bg-white/95 backdrop-blur-2xl border-l border-white/60 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
				: tema === "dark"
					? "bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700/50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
					: "bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-zinc-800/50 shadow-[-10px_0_30px_rgba(0,0,0,0.7)]",
		header:
			tema === "light"
				? "border-b border-slate-200/60 bg-slate-50/50"
				: tema === "dark"
					? "border-b border-slate-800/60 bg-slate-900/50"
					: "border-b border-zinc-900/60 bg-[#050505]/50",
		textoPrincipal: tema === "light" ? "text-slate-800" : "text-slate-100",
		textoSecundario: tema === "light" ? "text-slate-500" : "text-slate-400",
		card:
			tema === "light"
				? "bg-white/80 border-slate-200/60 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5"
				: tema === "dark"
					? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80 hover:-translate-y-0.5"
					: "bg-[#111]/50 border-zinc-800/50 hover:bg-[#111]/80 hover:-translate-y-0.5",
		select:
			tema === "light"
				? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-blue-500/30"
				: tema === "dark"
					? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 focus:ring-blue-500/30"
					: "bg-black border-zinc-800 text-zinc-300 hover:bg-zinc-900 focus:ring-blue-500/30",
		detalheCard:
			tema === "light"
				? "bg-slate-50/80 border-slate-100 text-slate-600"
				: "bg-slate-900/50 border-slate-800 text-slate-400",
	};

	// --- CORREÇÃO DO BUG DAS CORES (Intercepta a cor baseada na Ação) ---
	const getCoresPremium = (acao) => {
		const status = acao?.toUpperCase() || "PENDENTE";
		const isLight = tema === "light";

		if (status === "OK")
			return {
				linha: "bg-emerald-500",
				badge: isLight
					? "bg-emerald-50 text-emerald-600 border-emerald-100"
					: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
			};
		if (status === "NAO" || status === "NÃO")
			return {
				linha: "bg-rose-500",
				badge: isLight
					? "bg-rose-50 text-rose-600 border-rose-100"
					: "bg-rose-900/30 text-rose-400 border-rose-800/50",
			};
		if (status === "ANDAMENTO")
			return {
				linha: "bg-blue-500",
				badge: isLight
					? "bg-blue-50 text-blue-600 border-blue-100"
					: "bg-blue-900/30 text-blue-400 border-blue-800/50",
			};
		if (status === "VERIFICAR")
			return {
				linha: "bg-amber-500",
				badge: isLight
					? "bg-amber-50 text-amber-600 border-amber-100"
					: "bg-amber-900/30 text-amber-400 border-amber-800/50",
			};

		// Status PENDENTE ou Desconhecido (Ganha um Violeta Premium)
		return {
			linha: "bg-violet-500",
			badge: isLight
				? "bg-violet-50 text-violet-600 border-violet-100"
				: "bg-violet-900/30 text-violet-400 border-violet-800/50",
		};
	};

	return (
		<>
			{/* 1. O Overlay Escuro */}
			{mostrar && (
				<div
					className={`fixed inset-0 z-[60] transition-opacity duration-300 ${estilos.overlay}`}
					onClick={onFechar}
				/>
			)}

			{/* 2. O Painel Lateral em Glassmorphism */}
			<div
				className={`fixed top-0 right-0 h-full w-80 sm:w-[420px] z-[70] transform transition-transform duration-500 ease-out flex flex-col ${estilos.sidebar} ${
					mostrar ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Cabeçalho Limpo */}
				<div
					className={`p-6 flex justify-between items-center z-10 ${estilos.header}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${tema === "light" ? "bg-blue-50 text-blue-600" : "bg-blue-900/30 text-blue-400"}`}
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
									d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
								/>
							</svg>
						</div>
						<div>
							<h2
								className={`font-black text-lg tracking-tight ${estilos.textoPrincipal}`}
							>
								Auditoria
							</h2>
							<p
								className={`text-[10px] uppercase font-bold tracking-widest ${estilos.textoSecundario}`}
							>
								Log de Atividades
							</p>
						</div>
					</div>
					<button
						onClick={onFechar}
						className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${tema === "light" ? "hover:bg-slate-200/50 text-slate-400 hover:text-slate-600" : "hover:bg-slate-800 text-slate-500 hover:text-slate-300"}`}
						title="Fechar"
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
					<div
						className={`px-6 py-3 border-b flex items-center justify-between gap-2 z-10 ${estilos.header}`}
					>
						<span
							className={`text-[10px] font-black uppercase tracking-widest ${estilos.textoSecundario}`}
						>
							Filtrar por:
						</span>
						<select
							value={filtroPeriodo}
							onChange={(e) => setFiltroPeriodo(e.target.value)}
							className={`text-xs rounded-lg px-3 py-2 outline-none font-bold cursor-pointer transition-colors border ${estilos.select}`}
						>
							<option value="todos">Mês Completo</option>
							<option value="hoje">Apenas Hoje</option>
							<option value="ontem">Ontem</option>
							<option value="semana">Últimos 7 dias</option>
						</select>
					</div>
				)}

				{/* Lista de Histórico */}
				<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
					{historicoFiltrado.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className={`w-16 h-16 ${estilos.textoSecundario}`}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
								/>
							</svg>
							<span
								className={`text-[11px] font-black uppercase tracking-widest text-center ${estilos.textoSecundario}`}
							>
								Nenhum registro
								<br />
								encontrado
							</span>
						</div>
					) : (
						historicoFiltrado.map((h) => {
							// Aplica o sistema inteligente de cores Premium
							const cores = getCoresPremium(h.acao);

							return (
								<div
									key={h.id}
									className={`p-4 rounded-2xl border relative group transition-all duration-300 ${estilos.card}`}
								>
									{/* Linha colorida lateral */}
									<div
										className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-md transition-colors ${cores.linha}`}
									></div>

									<div className="pl-3 flex flex-col gap-2">
										<div className="flex flex-wrap justify-between items-start gap-2">
											<span
												className={`font-black text-[13px] uppercase tracking-tight break-words flex-1 min-w-[120px] ${estilos.textoPrincipal}`}
											>
												{h.usuario}
											</span>
											<div
												className={`flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-md border ${tema === "light" ? "bg-slate-100/50 border-slate-200" : "bg-slate-900/50 border-slate-700"}`}
											>
												<span
													className={`text-[10px] font-bold tracking-wider ${estilos.textoSecundario}`}
												>
													{h.data}
												</span>
												<span
													className={`text-[10px] font-black ${tema === "light" ? "text-slate-600" : "text-slate-300"}`}
												>
													{h.hora || "00:00"}
												</span>
											</div>
										</div>

										<div className="mt-1">
											<p
												className={`font-bold uppercase text-[10px] tracking-widest inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ${cores.badge}`}
											>
												STATUS ➔ {h.acao}
											</p>
										</div>

										<p
											className={`text-[11px] font-medium leading-relaxed mt-2 p-3 rounded-xl border ${estilos.detalheCard}`}
										>
											{h.detalhe}
										</p>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</>
	);
}
