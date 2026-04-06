import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { EmpresaModalInfo } from "../components/EmpresaModalInfo";
import { Header } from "../components/Header";

export function Empresas({ tema, setTema }) {
	const navigate = useNavigate();
	const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";

	const [empresas, setEmpresas] = useState([]);
	const [carregando, setCarregando] = useState(true);
	const [filtro, setFiltro] = useState("");
	const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

	const handleLogout = () => {
		localStorage.removeItem("usuarioLogado");
		navigate("/login");
	};

	const ciclarTema = () => {
		if (tema === "light") setTema("dark");
		else if (tema === "dark") setTema("black");
		else setTema("light");
	};

	// --- ESTILOS PREMIUM (Glassmorphism) ---
	const estilos = {
		fundo:
			tema === "light"
				? "bg-gradient-to-br from-slate-50 to-slate-200"
				: tema === "dark"
					? "bg-gradient-to-br from-slate-800 to-slate-900"
					: "bg-gradient-to-br from-[#111] to-black",
		texto: tema === "light" ? "text-slate-800" : "text-slate-100",
		textoSecundario: tema === "light" ? "text-slate-500" : "text-slate-400",

		card:
			tema === "light"
				? "bg-white/90 backdrop-blur-md border-white/60 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-0.5"
				: tema === "dark"
					? "bg-slate-800/80 backdrop-blur-md border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-slate-800/95 hover:-translate-y-0.5"
					: "bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:bg-[#111] hover:-translate-y-0.5",

		headerLista:
			tema === "light"
				? "bg-slate-200/50 backdrop-blur-md border-white/40 shadow-sm text-slate-500"
				: tema === "dark"
					? "bg-slate-800/80 backdrop-blur-md border-slate-700 text-slate-400"
					: "bg-zinc-900/80 backdrop-blur-md border-zinc-800 text-zinc-500",

		voltarBotao:
			tema === "light"
				? "hover:bg-white/50 text-slate-600 border border-transparent hover:border-white"
				: tema === "dark"
					? "hover:bg-slate-800 text-slate-400"
					: "hover:bg-zinc-900 text-zinc-400",

		btnDetalhes:
			tema === "light"
				? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 shadow-sm"
				: tema === "dark"
					? "bg-blue-900/30 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-800/50 hover:border-blue-600"
					: "bg-blue-900/20 text-blue-500 hover:bg-blue-600 hover:text-white border border-blue-900/50 hover:border-blue-600",
	};

	useEffect(() => {
		const buscarEmpresas = async () => {
			setCarregando(true);
			const { data, error } = await supabase.from("enterprise").select("*");

			if (!error && data) {
				const formatadas = data.map((emp) => ({
					...emp,
					nome: emp.name,
					grupoNome: emp.grupo_nome,
					pasta: emp.directory,
				}));
				setEmpresas(formatadas);
			}
			setCarregando(false);
		};

		buscarEmpresas();
	}, []);

	const empresasFiltradasEOrdenadas = useMemo(() => {
		let resultado = empresas;

		const termo = filtro.toLowerCase().trim();
		if (termo) {
			resultado = resultado.filter(
				(e) =>
					e.nome?.toLowerCase().includes(termo) ||
					e.sigla?.toLowerCase().includes(termo) ||
					e.cnpj?.toLowerCase().includes(termo) ||
					e.grupoNome?.toLowerCase().includes(termo),
			);
		}

		resultado.sort((a, b) => {
			const termoA = (a.sigla || a.nome || "").toLowerCase();
			const termoB = (b.sigla || b.nome || "").toLowerCase();
			return termoA.localeCompare(termoB);
		});

		return resultado;
	}, [empresas, filtro]);

	return (
		<div
			className={`min-h-screen ${estilos.fundo} transition-colors duration-500 flex flex-col font-sans relative overflow-hidden`}
		>
			{/* ===== LUZES DE FUNDO (GLOW) ===== */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
				<div
					className={`absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[130px] opacity-50 transition-colors duration-500 ${tema === "light" ? "bg-blue-200" : tema === "dark" ? "bg-blue-900/30" : "bg-blue-900/10"}`}
				></div>
				<div
					className={`absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-60 transition-colors duration-500 ${tema === "light" ? "bg-indigo-100" : tema === "dark" ? "bg-indigo-900/20" : "bg-zinc-900/40"}`}
				></div>
			</div>

			{/* 1. Header Global Integrado */}
			<div className="p-4 md:p-8 pb-0 relative z-10">
				<Header
					usuarioLogado={usuarioLogado}
					tema={tema}
					onCiclarTema={ciclarTema}
					onLogout={handleLogout}
					titulo="Empresas"
					subtitulo="Visão Geral"
					filtro={filtro}
					setFiltro={setFiltro}
					iconeEsquerda={
						<button
							onClick={() => navigate("/hub")}
							className={`p-2.5 rounded-xl transition-all ${estilos.voltarBotao}`}
							title="Voltar para o Hub"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
								/>
							</svg>
						</button>
					}
				/>
			</div>

			<main className="flex-1 p-4 md:p-8 pt-4 max-w-6xl mx-auto w-full flex flex-col gap-5 relative z-10">
				{/* Cabeçalho da Lista (Glassmorphism) */}
				<div
					className={`flex items-center justify-between px-6 py-4 rounded-2xl border ${estilos.headerLista}`}
				>
					<div className="flex items-center gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-4 h-4 text-blue-500"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
							/>
						</svg>
						<span className="text-[11px] uppercase font-black tracking-widest">
							Relação de Empresas
						</span>
					</div>
					<span className="text-[11px] uppercase font-black tracking-widest hidden sm:block pr-2">
						Controle de Dados
					</span>
				</div>

				{carregando ? (
					<div className="flex flex-col items-center justify-center py-24 gap-5">
						<div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
						<p
							className={`font-bold uppercase tracking-widest text-xs ${estilos.textoSecundario}`}
						>
							Buscando Cadastros...
						</p>
					</div>
				) : empresasFiltradasEOrdenadas.length === 0 ? (
					<div
						className={`p-16 mt-4 text-center rounded-[2rem] font-bold uppercase tracking-widest flex flex-col items-center justify-center gap-4 ${tema === "light" ? "bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 text-slate-400" : tema === "dark" ? "bg-slate-800/50 border-2 border-dashed border-slate-700 text-slate-500" : "bg-[#0a0a0a] border border-dashed border-zinc-800 text-zinc-600"}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-16 h-16 opacity-50 mb-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
							/>
						</svg>
						<span className="text-sm">Nenhum resultado encontrado.</span>
					</div>
				) : (
					<div className="flex flex-col gap-4 mt-2">
						{empresasFiltradasEOrdenadas.map((emp) => (
							<div
								key={emp.id}
								onClick={() => setEmpresaSelecionada(emp)}
								className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl transition-all duration-300 cursor-pointer group relative border ${estilos.card}`}
							>
								{/* Indicador de Status Lateral */}
								<div
									className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-md transition-colors ${emp.active ? "bg-emerald-500" : "bg-rose-500"}`}
								></div>

								<div className="flex items-center gap-5 pl-4 min-w-0 flex-1">
									<div
										className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner ${tema === "light" ? "bg-blue-50 border border-blue-100 text-blue-500 group-hover:shadow-blue-500/30 group-hover:bg-blue-500 group-hover:text-white" : "bg-blue-900/30 border border-blue-800/50 text-blue-400 group-hover:bg-blue-600 group-hover:text-white"}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-7 h-7"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
											/>
										</svg>
									</div>

									<div className="flex flex-col min-w-0 py-1">
										<div className="flex items-center gap-3">
											<span
												className={`font-black text-xl truncate transition-colors group-hover:text-blue-500 ${estilos.texto}`}
											>
												{emp.sigla || emp.nome}
											</span>
											<span
												className={`hidden sm:inline-flex px-2.5 py-1 rounded-md text-[9px] uppercase font-bold tracking-widest border ${emp.active ? (tema === "light" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-900/20 border-emerald-800 text-emerald-400") : tema === "light" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-rose-900/20 border-rose-800 text-rose-400"}`}
											>
												{emp.active ? "Ativa" : "Inativa"}
											</span>
										</div>
										<span
											className={`text-sm font-medium mt-1 truncate ${estilos.textoSecundario}`}
										>
											{emp.nome}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between sm:justify-end gap-4 mt-5 sm:mt-0 pl-20 sm:pl-0">
									<span
										className={`sm:hidden px-2.5 py-1 rounded-md text-[9px] uppercase font-bold tracking-widest border ${emp.active ? (tema === "light" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-900/20 border-emerald-800 text-emerald-400") : tema === "light" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-rose-900/20 border-rose-800 text-rose-400"}`}
									>
										{emp.active ? "Ativa" : "Inativa"}
									</span>

									<button
										onClick={(e) => {
											e.stopPropagation();
											setEmpresaSelecionada(emp);
										}}
										className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:shadow-md ${estilos.btnDetalhes}`}
									>
										Exibir Dados
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2.5}
											stroke="currentColor"
											className="w-4 h-4 transition-transform group-hover:translate-x-1"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
											/>
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>

			<EmpresaModalInfo
				empresa={empresaSelecionada}
				isOpen={!!empresaSelecionada}
				onClose={() => setEmpresaSelecionada(null)}
				tema={tema}
			/>
		</div>
	);
}
