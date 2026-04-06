import React from "react";
import { mesesDisponiveis } from "../data/constants"; // Ajuste o caminho se necessário
import logoSabino from "../assets/sabino.jpeg"; // <-- IMPORTANDO A LOGO

export function Header({
	usuarioLogado,
	tema,
	onCiclarTema,
	onLogout,
	periodo,
	mudarPeriodo,
	filtro,
	setFiltro,
	onAbrirHistorico,
	titulo = "SABINO CGE",
	subtitulo = "Controle Fiscal",
	iconeEsquerda,
	children,
}) {
	const headerEstilos = {
		light: "bg-white border-slate-200",
		dark: "bg-slate-800 border-slate-700",
		black: "bg-[#0a0a0a] border-zinc-900",
	};

	const textoEstilos = {
		light: "text-slate-800",
		dark: "text-slate-100",
		black: "text-slate-200",
	};

	const inputEstilos = {
		light:
			"bg-slate-100/50 hover:bg-slate-100 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:bg-white",
		dark: "bg-slate-900/50 hover:bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:bg-slate-800",
		black:
			"bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800 text-slate-300 placeholder:text-zinc-500 focus:bg-black",
	};

	const selectBgEstilos = {
		light:
			"bg-slate-50 border-slate-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]",
		dark: "bg-slate-900 border-slate-700",
		black: "bg-zinc-900 border-zinc-800",
	};

	const btnIconeEstilos = {
		light: "text-slate-400 hover:text-blue-600 hover:bg-blue-50",
		dark: "text-slate-400 hover:text-blue-400 hover:bg-slate-700",
		black: "text-zinc-500 hover:text-blue-500 hover:bg-zinc-900",
	};

	const renderIconeTema = () => {
		if (tema === "light") {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="w-5 h-5 text-amber-500"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
					/>
				</svg>
			);
		}
		if (tema === "dark") {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="w-5 h-5 text-blue-400"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
					/>
				</svg>
			);
		}
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 24 24"
				className="w-5 h-5 text-zinc-300"
			>
				<path
					fillRule="evenodd"
					d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
					clipRule="evenodd"
				/>
			</svg>
		);
	};

	return (
		<header
			className={`${headerEstilos[tema]} border px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between shadow-sm rounded-xl mb-4 max-w-[1920px] mx-auto w-full gap-4 transition-all duration-300`}
		>
			<div className="flex items-center gap-3 w-full sm:w-auto">
				{iconeEsquerda ? (
					iconeEsquerda
				) : (
					/* AQUI ENTROU A LOGO DA SABINO CGE */
					<div className="w-10 h-10 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex items-center justify-center">
						<img
							src={logoSabino}
							alt="Logo SABINO CGE"
							className="w-full h-full object-cover"
						/>
					</div>
				)}
				<div className="flex flex-col">
					<h1
						className={`font-extrabold tracking-tight leading-none text-lg transition-colors ${textoEstilos[tema]}`}
					>
						{titulo}
					</h1>
					<span className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-0.5">
						{subtitulo}
					</span>
				</div>
			</div>

			<div className="flex-1 w-full max-w-2xl sm:mx-8 flex justify-center">
				{children
					? children
					: setFiltro !== undefined && (
							<div className="relative group w-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<input
									type="text"
									placeholder="Buscar empresa por Nome, CNPJ, Sigla, UF ou Regime..."
									value={filtro}
									onChange={(e) => setFiltro(e.target.value)}
									aria-label="Pesquisar empresas"
									className={`w-full text-xs sm:text-sm rounded-full pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all font-medium border ${inputEstilos[tema]}`}
								/>
							</div>
						)}
			</div>

			<div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto justify-between sm:justify-end">
				{periodo && mudarPeriodo && (
					<div
						className={`flex items-center gap-1.5 p-1 rounded-lg border transition-colors ${selectBgEstilos[tema]}`}
					>
						<select
							value={periodo.mes}
							onChange={(e) => mudarPeriodo(periodo.ano, e.target.value)}
							className={`bg-transparent text-xs font-bold outline-none cursor-pointer pl-2 pr-1 appearance-none hover:text-blue-500 transition-colors focus:ring-2 focus:ring-blue-500 rounded ${tema === "light" ? "text-slate-700" : "text-slate-300"}`}
						>
							{mesesDisponiveis?.map((m) => (
								<option
									key={m.val}
									value={m.val}
									className={tema === "light" ? "" : "bg-slate-800"}
								>
									{m.nome}
								</option>
							))}
						</select>
						<span className="text-slate-500 font-light">/</span>
						<select
							value={periodo.ano}
							onChange={(e) => mudarPeriodo(e.target.value, periodo.mes)}
							className={`bg-transparent text-xs font-bold outline-none cursor-pointer pr-2 pl-1 appearance-none hover:text-blue-500 transition-colors focus:ring-2 focus:ring-blue-500 rounded ${tema === "light" ? "text-slate-700" : "text-slate-300"}`}
						>
							<option
								value="2026"
								className={tema === "light" ? "" : "bg-slate-800"}
							>
								2026
							</option>
							<option
								value="2027"
								className={tema === "light" ? "" : "bg-slate-800"}
							>
								2027
							</option>
							<option
								value="2028"
								className={tema === "light" ? "" : "bg-slate-800"}
							>
								2028
							</option>
						</select>
					</div>
				)}

				<div
					className={`hidden sm:block w-[1px] h-8 transition-colors ${tema === "light" ? "bg-slate-200" : "bg-slate-700"}`}
				></div>

				<button
					onClick={onCiclarTema}
					className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${btnIconeEstilos[tema]}`}
					title="Alternar Tema"
				>
					{renderIconeTema()}
				</button>

				{onAbrirHistorico && (
					<button
						onClick={onAbrirHistorico}
						className={`relative p-2 rounded-full transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 ${btnIconeEstilos[tema]}`}
						title="Abrir Auditoria"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5 group-hover:rotate-12 transition-transform"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span
							className={`absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border ${tema === "light" ? "border-white" : "border-slate-800"}`}
						></span>
					</button>
				)}

				<div className="flex items-center gap-3 pl-1">
					<div className="text-right hidden md:block">
						<p
							className={`text-xs font-extrabold leading-none transition-colors ${textoEstilos[tema]}`}
						>
							{usuarioLogado}
						</p>
						<button
							onClick={onLogout}
							className="text-[9px] text-slate-500 hover:text-rose-500 font-bold uppercase tracking-widest mt-1 transition-colors focus:outline-none"
						>
							Sair da Conta
						</button>
					</div>
					<div
						className={`w-9 h-9 bg-gradient-to-tr from-slate-700 to-slate-500 rounded-full border-2 shadow-md flex items-center justify-center text-white font-bold text-sm ring-2 ${tema === "light" ? "border-white ring-slate-100" : "border-slate-800 ring-slate-700"}`}
					>
						{usuarioLogado ? usuarioLogado.charAt(0).toUpperCase() : "U"}
					</div>
				</div>
			</div>
		</header>
	);
}
