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
		let verificar = 0;
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
						pendentes++;
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
			totalTarefas,
		};
	}, [empresas, categorias, totalTarefasRequeridas]);

	const temaGeral = {
		light:
			"bg-white/80 border-slate-200 shadow-sm text-slate-700 backdrop-blur-md",
		dark: "bg-slate-800/80 border-slate-700/50 shadow-md text-slate-200 backdrop-blur-md",
		black:
			"bg-[#0a0a0a]/90 border-zinc-800/50 shadow-lg text-slate-300 backdrop-blur-md",
	};

	const corTexto = {
		progresso: "text-blue-500",
		concluidas: tema === "light" ? "text-emerald-600" : "text-emerald-400",
		pendentes: tema === "light" ? "text-rose-600" : "text-rose-400",
		revisar: tema === "light" ? "text-amber-600" : "text-amber-400",
	};

	return (
		<div className="flex flex-col sm:flex-row gap-3 w-full transition-colors duration-300">
			{/* 1. Progresso Geral (Barra Fina com o % ao lado) */}
			<div
				className={`flex-1 rounded-xl border px-5 py-2.5 flex flex-col justify-center sm:min-w-[280px] ${temaGeral[tema]}`}
			>
				<div className="flex justify-between items-center mb-1.5">
					<span
						className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-80 ${tema === "light" ? "text-slate-500" : "text-slate-400"}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className={`w-3.5 h-3.5 ${corTexto.progresso}`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.5-1.5H9"
							/>
						</svg>
						Progresso Geral
					</span>
					<span
						className={`text-sm font-black ${corTexto.progresso} leading-none`}
					>
						{stats.progresso}%
					</span>
				</div>
				<div
					className={`w-full rounded-full h-1.5 ${tema === "light" ? "bg-slate-100" : "bg-slate-700/50"}`}
				>
					<div
						className={`bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]`}
						style={{ width: `${stats.progresso}%` }}
					></div>
				</div>
			</div>

			{/* 2. Empresas 100% */}
			<div
				className={`rounded-xl border px-4 py-2 flex flex-col justify-center min-w-[120px] ${temaGeral[tema]}`}
			>
				<span
					className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 opacity-80 ${tema === "light" ? "text-emerald-700" : "text-emerald-500"}`}
				>
					Empresas 100%
				</span>
				<div className="flex items-baseline gap-1">
					<span
						className={`text-xl font-black leading-none ${corTexto.concluidas}`}
					>
						{stats.empresas100}
					</span>
					<span className="text-[9px] font-bold opacity-50">
						/ {stats.total}
					</span>
				</div>
			</div>

			{/* 3. Pendências */}
			<div
				className={`rounded-xl border px-4 py-2 flex flex-col justify-center min-w-[120px] ${temaGeral[tema]}`}
			>
				<span
					className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 opacity-80 ${tema === "light" ? "text-rose-700" : "text-rose-500"}`}
				>
					Pendências
				</span>
				<span
					className={`text-xl font-black leading-none ${corTexto.pendentes}`}
				>
					{stats.pendentes}
				</span>
			</div>

			{/* 4. Para Revisar */}
			{stats.verificar > 0 && (
				<div
					className={`rounded-xl border px-4 py-2 flex flex-col justify-center min-w-[120px] animate-pulse ${temaGeral[tema]}`}
				>
					<span
						className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 opacity-80 ${tema === "light" ? "text-amber-700" : "text-amber-500"}`}
					>
						Para Revisar
					</span>
					<span
						className={`text-xl font-black leading-none ${corTexto.revisar}`}
					>
						{stats.verificar}
					</span>
				</div>
			)}
		</div>
	);
}
