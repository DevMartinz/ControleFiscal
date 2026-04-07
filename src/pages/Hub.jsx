import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export function Hub({ tema, setTema }) {
	const navigate = useNavigate();
	const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";

	const handleLogout = () => {
		localStorage.removeItem("usuarioLogado");
		navigate("/login");
	};

	const ciclarTema = () => {
		if (tema === "light") setTema("dark");
		else if (tema === "dark") setTema("black");
		else setTema("light");
	};

	const estilos = {
		// Fundo com gradiente cinza claro suave
		fundo:
			tema === "light"
				? "bg-gradient-to-br from-slate-50 to-slate-200"
				: tema === "dark"
					? "bg-gradient-to-br from-slate-800 to-slate-900"
					: "bg-gradient-to-br from-[#111] to-black",

		texto: tema === "light" ? "text-slate-800" : "text-slate-100",
		textoSecundario: tema === "light" ? "text-slate-500" : "text-slate-400",

		// Cards Glassmorphism
		card:
			tema === "light"
				? "bg-white/90 backdrop-blur-md border-white/60 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:bg-white"
				: tema === "dark"
					? "bg-slate-800/80 backdrop-blur-md border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-slate-800/95"
					: "bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:bg-[#111]",

		// Banner
		banner:
			tema === "light"
				? "bg-gradient-to-r from-blue-600/95 to-indigo-600/95 backdrop-blur-md text-white shadow-lg shadow-blue-500/20 border border-white/20"
				: tema === "dark"
					? "bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-md border border-blue-800/50 text-blue-50 shadow-lg shadow-blue-900/20"
					: "bg-gradient-to-r from-zinc-900/90 to-black/90 backdrop-blur-md border border-zinc-800/50 text-zinc-100",
	};

	const dataAtual = new Intl.DateTimeFormat("pt-BR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date());

	return (
		<div
			className={`min-h-screen ${estilos.fundo} transition-colors duration-500 flex flex-col relative overflow-hidden`}
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

			<div className="p-4 md:p-8 pb-0 z-10 relative">
				<Header
					usuarioLogado={usuarioLogado}
					tema={tema}
					onCiclarTema={ciclarTema}
					onLogout={handleLogout}
					titulo="SABINO CGE"
					subtitulo="Hub Central"
				/>
			</div>

			<main className="flex-1 p-4 md:px-8 md:py-6 max-w-6xl mx-auto w-full z-10 flex flex-col gap-6 relative">
				{/* Banner */}
				<div
					className={`px-6 py-5 md:px-8 md:py-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative ${estilos.banner}`}
				>
					<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

					<div className="relative z-10 w-full text-center md:text-left">
						<p
							className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${tema === "light" ? "text-blue-200" : "text-blue-400"}`}
						>
							{dataAtual}
						</p>
						<h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
							Olá, {usuarioLogado}!
						</h2>
						<p
							className={`text-sm font-medium ${tema === "light" ? "text-blue-50/90" : "text-slate-300"}`}
						>
							Bem-vindo(a) ao painel central. Selecione o módulo desejado.
						</p>
					</div>

					<div className="relative z-10 hidden md:flex shrink-0 items-center justify-center p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
							/>
						</svg>
					</div>
				</div>

				{/* Grid de Módulos */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2 relative">
					{/* FISCAL - Azul */}
					<button
						onClick={() => navigate("/fiscal")}
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-blue-500/30">
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
										d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-blue-50 text-blue-500 rounded-full transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Setor Fiscal
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Apurações, fechamentos mensais, Sped e notas fiscais.
							</p>
						</div>
					</button>

					{/* PESSOAL - Verde */}
					<button
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-emerald-500/30">
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
										d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-full transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Setor Pessoal
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Folha de pagamento, férias, rescisões e eSocial.
							</p>
						</div>
					</button>

					{/* CONTÁBIL - Roxo */}
					<button
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-purple-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-purple-500/30">
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
										d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-purple-50 text-purple-500 rounded-full transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white dark:bg-purple-500/10 dark:text-purple-400 dark:group-hover:bg-purple-500 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Setor Contábil
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Balancetes, DRE, conciliação e demonstrações.
							</p>
						</div>
					</button>

					{/* EMPRESAS - Laranja */}
					<button
						onClick={() => navigate("/empresas")}
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-amber-500/30">
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
										d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-amber-50 text-amber-500 rounded-full transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-500/10 dark:text-amber-400 dark:group-hover:bg-amber-500 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Lista de Empresas
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Lista de nossos clientes e empresas.
							</p>
						</div>
					</button>

					{/* T.I - Vermelho */}
					<button
						onClick={() => navigate("/ti")}
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-rose-500/30">
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
										d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-rose-50 text-rose-500 rounded-full transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:group-hover:bg-rose-500 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Chamados
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Abrir e Exibir Chamados de T.I
							</p>
						</div>
					</button>

					{/* CALENDÁRIO - Ciano */}
					<button
						onClick={() => navigate("/calendario")}
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-cyan-500/30">
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
										d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-cyan-50 text-cyan-500 rounded-full transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white dark:bg-cyan-500/10 dark:text-cyan-400 dark:group-hover:bg-cyan-500 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Calendário
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Feriados nacionais, municipais e datas importantes.
							</p>
						</div>
					</button>

					{/* RECEBIMENTOS - Amarelo */}
					<button
						onClick={() => navigate("/recebimentos")}
						className={`group text-left p-6 md:p-7 rounded-[2rem] border transition-all duration-300 flex flex-col gap-5 hover:-translate-y-1.5 ${estilos.card}`}
					>
						<div className="flex items-start justify-between w-full">
							<div className="w-14 h-14 bg-yellow-500 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-yellow-500/30">
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
										d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z"
									/>
								</svg>
							</div>
							<div className="p-2.5 bg-yellow-50 text-yellow-500 rounded-full transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-white dark:bg-yellow-500/10 dark:text-yellow-400 dark:group-hover:bg-yellow-500 dark:group-hover:text-white relative z-20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
									/>
								</svg>
							</div>
						</div>
						<div>
							<h3 className={`text-xl font-black ${estilos.texto}`}>
								Recepção de Arquivos
							</h3>
							<p
								className={`text-sm mt-1.5 leading-relaxed font-medium ${estilos.textoSecundario}`}
							>
								Controle mensal de recebimentos de XML e SPED.
							</p>
						</div>
					</button>
				</div>
			</main>
		</div>
	);
}
