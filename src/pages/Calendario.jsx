import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import confetti from "canvas-confetti"; // Lembre-se de rodar: npm install canvas-confetti

// Base de Eventos
const EVENTOS = [
	// Feriados Nacionais (Vermelho Forte)
	{ mes: 0, dia: 1, nome: "Ano Novo", tipo: "Nacional" },
	{ mes: 1, dia: 17, nome: "Carnaval", tipo: "Móvel" },
	{ mes: 3, dia: 3, nome: "Paixão de Cristo", tipo: "Móvel" },
	{ mes: 3, dia: 21, nome: "Tiradentes", tipo: "Nacional" },
	{ mes: 4, dia: 1, nome: "Dia do Trabalhador", tipo: "Nacional" },
	{ mes: 5, dia: 4, nome: "Corpus Christi", tipo: "Móvel" },
	{ mes: 8, dia: 7, nome: "Independência do Brasil", tipo: "Nacional" },
	{ mes: 9, dia: 12, nome: "N. Sra. Aparecida", tipo: "Nacional" },
	{ mes: 10, dia: 2, nome: "Finados", tipo: "Nacional" },
	{ mes: 10, dia: 15, nome: "Proclamação da República", tipo: "Nacional" },
	{ mes: 11, dia: 25, nome: "Natal", tipo: "Nacional" },

	// Feriados Regionais / Municipais (Laranja Forte)
	{ mes: 0, dia: 20, nome: "São Sebastião", tipo: "Municipal" },
	{ mes: 2, dia: 15, nome: "Emancipação de Nova Cruz", tipo: "Municipal" },
	{ mes: 5, dia: 29, nome: "São Pedro", tipo: "Municipal" },
	{ mes: 9, dia: 3, nome: "Mártires de Cunhaú e Uruaçu", tipo: "Estadual" },
	{ mes: 11, dia: 3, nome: "Emancipação Política", tipo: "Municipal" },
	{
		mes: 11,
		dia: 8,
		nome: "N. Sra. da Conceição (Padroeira)",
		tipo: "Municipal",
	},
	{ mes: 11, dia: 13, nome: "Santa Luzia", tipo: "Municipal" },

	// Aniversários da Equipe (Azul)
	{ mes: 3, dia: 2, nome: "Michael", tipo: "Aniversario" },
	{ mes: 4, dia: 3, nome: "Pedro L.", tipo: "Aniversario" },
	{ mes: 5, dia: 29, nome: "Bruno Martins", tipo: "Aniversario" },

	// Jogos do Brasil - Copa do Mundo 2026 (Easter Egg Oculto nas Legendas)
	{ mes: 5, dia: 15, nome: "Brasil x Jogo 1", tipo: "Copa" },
	{ mes: 5, dia: 20, nome: "Brasil x Jogo 2", tipo: "Copa" },
	{ mes: 5, dia: 25, nome: "Brasil x Jogo 3", tipo: "Copa" },
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

export function Calendario({ tema, setTema }) {
	const navigate = useNavigate();
	const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";

	const hoje = new Date();
	const [dataCalendario, setDataCalendario] = useState(
		new Date(hoje.getFullYear(), hoje.getMonth(), 1),
	);

	const anoAtual = dataCalendario.getFullYear();
	const mesAtual = dataCalendario.getMonth();

	const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
	const primeiroDiaDaSemana = new Date(anoAtual, mesAtual, 1).getDay();

	const mesAnterior = () =>
		setDataCalendario(new Date(anoAtual, mesAtual - 1, 1));
	const proximoMes = () =>
		setDataCalendario(new Date(anoAtual, mesAtual + 1, 1));
	const irParaHoje = () =>
		setDataCalendario(new Date(hoje.getFullYear(), hoje.getMonth(), 1));

	// --- MELHORIA: Easter Egg 1: Aniversários Turbinado ---
	const dispararConfetes = (e) => {
		e.stopPropagation();

		// Paleta de cores de festa variada e vibrante
		const coresFesta = [
			"#2b91ff", // Azul Principal
			"#60a5fa", // Azul Claro
			"#ff4d4d", // Vermelho
			"#ffdf00", // Dourado/Amarelo
			"#00ff00", // Verde
			"#ff00ff", // Magenta
			"#ffffff", // Branco
		];

		// Configuração base para um disparo massivo
		const configBase = {
			particleCount: 150, // Alto volume de partículas
			spread: 70, // Boa abertura angular
			startVelocity: 55, // Velocidade para cruzar a tela
			gravity: 0.8, // Ligeiramente mais leve para flutuar
			ticks: 250, // Durar mais tempo na tela
			scalar: 1.1, // Tamanho ligeiramente maior
			colors: coresFesta,
			zIndex: 9999,
			disableForReducedMotion: true,
		};

		// Canhão 1: Dispara do canto inferior esquerdo para cima/direita
		confetti({
			...configBase,
			angle: 60,
			origin: { x: 0, y: 1 }, // Origem: Canto inferior esquerdo da tela
		});

		// Canhão 2: Dispara do canto inferior direito para cima/esquerda
		// Com um mini delay para dar dinâmica
		setTimeout(() => {
			confetti({
				...configBase,
				angle: 120,
				origin: { x: 1, y: 1 }, // Origem: Canto inferior direito da tela
			});
		}, 150);
	};

	// Easter Egg 2: Copa do Mundo (Bolas de Futebol)
	const dispararGol = (e) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (rect.left + rect.width / 2) / window.innerWidth;
		const y = (rect.top + rect.height / 2) / window.innerHeight;

		confetti({
			particleCount: 40,
			spread: 90,
			origin: { x, y },
			colors: ["#ffffff", "#1a1a1a", "#009c3b", "#ffdf00"],
			shapes: ["circle"],
			disableForReducedMotion: true,
			zIndex: 9999,
			scalar: 1.8,
			gravity: 1.2,
		});
	};

	// --- ESTILOS PREMIUM (Glassmorphism & Gradientes) ---
	const estilos = {
		fundoBase: {
			light: "bg-gradient-to-br from-slate-50 to-slate-200",
			dark: "bg-gradient-to-br from-slate-800 to-slate-900",
			black: "bg-gradient-to-br from-[#111] to-black",
		},
		textoPrincipal: {
			light: "text-slate-800",
			dark: "text-slate-100",
			black: "text-slate-200",
		},
		textoSecundario: {
			light: "text-slate-500",
			dark: "text-slate-400",
			black: "text-zinc-500",
		},
		painel: {
			light:
				"bg-white/70 backdrop-blur-md border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
			dark: "bg-slate-800/60 backdrop-blur-md border-slate-700/50 shadow-xl",
			black: "bg-[#0a0a0a]/60 backdrop-blur-md border-zinc-800/50 shadow-xl",
		},
		celula: {
			light:
				"bg-white/50 border-white/60 hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5",
			dark: "bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/60 hover:shadow-lg hover:-translate-y-0.5",
			black:
				"bg-[#0a0a0a]/40 border-zinc-800/50 hover:bg-[#111]/80 hover:shadow-lg hover:-translate-y-0.5",
		},
		celulaVazia: {
			light: "bg-transparent border-white/40",
			dark: "bg-transparent border-slate-700/30",
			black: "bg-transparent border-zinc-800/30",
		},
		celulaFDS: {
			light:
				"bg-slate-100/50 border-white/60 hover:bg-white/60 hover:shadow-sm hover:-translate-y-0.5",
			dark: "bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/50 hover:shadow-sm hover:-translate-y-0.5",
			black:
				"bg-black/40 border-zinc-800/50 hover:bg-[#0a0a0a]/50 hover:shadow-sm hover:-translate-y-0.5",
		},
		celulaVaziaFDS: {
			light: "bg-slate-50/30 border-white/40",
			dark: "bg-slate-900/20 border-slate-700/30",
			black: "bg-black/20 border-zinc-800/30",
		},
		hojeBadge: {
			light:
				"bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-100",
			dark: "bg-blue-500 text-white shadow-lg shadow-blue-900/60 ring-2 ring-slate-800",
			black: "bg-blue-600 text-white ring-2 ring-zinc-900",
		},
		btnNav: {
			light: "hover:bg-slate-200/60 text-slate-600 active:bg-slate-300/50",
			dark: "hover:bg-slate-700/60 text-slate-300 active:bg-slate-600/50",
			black: "hover:bg-zinc-800/60 text-zinc-300 active:bg-zinc-700/50",
		},
	};

	const getEventoEstilo = (tipo) => {
		switch (tipo) {
			case "Aniversario":
				return tema === "light"
					? "bg-blue-100/80 text-blue-800 border-blue-200 font-bold cursor-pointer hover:bg-blue-200 hover:shadow-sm transition-all"
					: "bg-blue-500/20 text-blue-300 border-blue-500/30 font-bold cursor-pointer hover:bg-blue-500/30 hover:border-blue-500/50 transition-all";
			case "Copa":
				return tema === "light"
					? "bg-emerald-100/80 text-emerald-800 border-emerald-200 font-bold cursor-pointer hover:bg-emerald-200 hover:shadow-sm transition-all"
					: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold cursor-pointer hover:bg-emerald-500/30 hover:border-emerald-500/50 transition-all";
			case "Estadual":
			case "Municipal":
				return tema === "light"
					? "bg-orange-50 text-orange-800 border-orange-200/60 font-bold"
					: "bg-orange-500/10 text-orange-400 border-orange-500/20 font-bold";
			default: // Nacional
				return tema === "light"
					? "bg-red-50 text-red-800 border-red-200/60 font-bold"
					: "bg-red-500/10 text-red-400 border-red-500/20 font-bold";
		}
	};

	const getAcaoClique = (tipo, e) => {
		if (tipo === "Aniversario") return dispararConfetes(e);
		if (tipo === "Copa") return dispararGol(e);
		return undefined;
	};

	const feriadosNacionais = EVENTOS.filter(
		(e) => e.mes === mesAtual && (e.tipo === "Nacional" || e.tipo === "Móvel"),
	);
	const feriadosRegionais = EVENTOS.filter(
		(e) =>
			e.mes === mesAtual && (e.tipo === "Municipal" || e.tipo === "Estadual"),
	);
	const aniversariosMes = EVENTOS.filter(
		(e) => e.mes === mesAtual && e.tipo === "Aniversario",
	);

	const renderDias = () => {
		let blocos = [];

		for (let i = 0; i < primeiroDiaDaSemana; i++) {
			const isFDS = i === 0 || i === 6;
			const bgClass = isFDS
				? estilos.celulaVaziaFDS[tema]
				: estilos.celulaVazia[tema];
			blocos.push(
				<div
					key={`vazio-${i}`}
					className={`p-1.5 sm:p-2 border-b border-r min-h-[90px] sm:min-h-[110px] ${bgClass}`}
				></div>,
			);
		}

		for (let dia = 1; dia <= diasNoMes; dia++) {
			const isHoje =
				hoje.getDate() === dia &&
				hoje.getMonth() === mesAtual &&
				hoje.getFullYear() === anoAtual;
			const diaDaSemanaIndex = (primeiroDiaDaSemana + dia - 1) % 7;
			const isFDS = diaDaSemanaIndex === 0 || diaDaSemanaIndex === 6;

			const bgClass = isFDS ? estilos.celulaFDS[tema] : estilos.celula[tema];
			const eventosDoDia = EVENTOS.filter(
				(e) => e.dia === dia && e.mes === mesAtual,
			);

			blocos.push(
				<div
					key={dia}
					className={`p-1.5 sm:p-2 border-b border-r min-h-[90px] sm:min-h-[110px] transition-all duration-300 relative flex flex-col gap-1 ${bgClass}`}
				>
					<div className="flex justify-between items-start mb-1">
						<span
							className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-black transition-colors ${isHoje ? estilos.hojeBadge[tema] : isFDS && tema === "light" ? "text-slate-400" : estilos.textoPrincipal[tema]}`}
						>
							{dia}
						</span>
					</div>

					<div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar z-10 relative">
						{eventosDoDia.map((evento, index) => (
							<div
								key={index}
								onClick={(e) => getAcaoClique(evento.tipo, e)}
								className={`px-1.5 py-1 rounded-md border text-[9px] sm:text-[10px] leading-tight flex items-center gap-1.5 ${getEventoEstilo(evento.tipo)}`}
							>
								{evento.tipo === "Aniversario" && (
									<span className="text-xs">🎂</span>
								)}
								{evento.tipo === "Copa" && <span className="text-xs">⚽</span>}
								<span className="truncate select-none">{evento.nome}</span>
							</div>
						))}
					</div>
				</div>,
			);
		}

		return blocos;
	};

	return (
		<div
			className={`min-h-screen ${estilos.fundoBase[tema]} transition-colors duration-500 flex flex-col font-sans relative overflow-hidden`}
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

			<div className="relative z-10 flex flex-col flex-1 w-full max-w-7xl mx-auto">
				<div className="px-4 pt-4 md:px-8 md:pt-6 pb-0">
					<Header
						usuarioLogado={usuarioLogado}
						tema={tema}
						onCiclarTema={() =>
							setTema(
								tema === "light" ? "dark" : tema === "dark" ? "black" : "light",
							)
						}
						onLogout={() => {
							localStorage.removeItem("usuarioLogado");
							navigate("/login");
						}}
						titulo="Calendário"
						subtitulo="Agenda de Eventos"
						iconeEsquerda={
							<button
								onClick={() => navigate("/hub")}
								className={`p-2.5 rounded-xl transition-all duration-300 ${
									tema === "light"
										? "hover:bg-slate-100/80 text-slate-500 hover:text-blue-600"
										: tema === "dark"
											? "hover:bg-slate-800/80 text-slate-400 hover:text-blue-400"
											: "hover:bg-zinc-900/80 text-zinc-400 hover:text-blue-500"
								}`}
								title="Voltar"
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

				<main className="flex-1 px-4 py-3 md:px-8 md:py-4 w-full flex flex-col gap-5">
					{/* Painel de Controles */}
					<div
						className={`px-5 py-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${estilos.painel[tema]}`}
					>
						<div className="flex items-center gap-4">
							<button
								onClick={mesAnterior}
								className={`p-2 rounded-xl transition-colors ${estilos.btnNav[tema]}`}
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
										d="M15.75 19.5L8.25 12l7.5-7.5"
									/>
								</svg>
							</button>
							<h2
								className={`text-xl sm:text-2xl font-black w-40 sm:w-48 text-center capitalize tracking-tight ${estilos.textoPrincipal[tema]}`}
							>
								{MESES[mesAtual]}{" "}
								<span
									className={`font-medium ${tema === "light" ? "text-slate-400" : "text-slate-500"}`}
								>
									{anoAtual}
								</span>
							</h2>
							<button
								onClick={proximoMes}
								className={`p-2 rounded-xl transition-colors ${estilos.btnNav[tema]}`}
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
										d="M8.25 4.5l7.5 7.5-7.5 7.5"
									/>
								</svg>
							</button>
						</div>

						<button
							onClick={irParaHoje}
							className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${
								tema === "light"
									? "bg-white/80 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md"
									: tema === "dark"
										? "bg-slate-800/80 border-slate-700/50 text-slate-300 hover:text-blue-400 hover:border-blue-500/30"
										: "bg-zinc-900/80 border-zinc-800/50 text-zinc-400 hover:text-blue-500 hover:border-blue-500/30"
							}`}
						>
							Ir para Hoje
						</button>
					</div>

					{/* Calendário Principal */}
					<div
						className={`rounded-[2rem] border overflow-hidden transition-all ${estilos.painel[tema]}`}
					>
						<div
							className={`grid grid-cols-7 border-b ${tema === "light" ? "bg-blue-50/50 border-slate-200/60" : tema === "dark" ? "bg-blue-900/10 border-slate-700/50" : "bg-blue-900/5 border-zinc-800/50"}`}
						>
							{DIAS_SEMANA.map((dia, idx) => (
								<div
									key={dia}
									className={`py-4 text-center text-[10px] sm:text-xs font-black uppercase tracking-widest ${idx === 0 || idx === 6 ? "text-red-500/90" : tema === "light" ? "text-slate-500" : "text-slate-400"}`}
								>
									{dia}
								</div>
							))}
						</div>

						<div className="grid grid-cols-7">{renderDias()}</div>
					</div>

					{/* Legendas */}
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-2 px-2">
						<div className="flex items-center gap-2">
							<div
								className={`w-2.5 h-2.5 rounded-full ${tema === "light" ? "bg-red-400" : "bg-red-500/80"}`}
							></div>
							<span
								className={`text-[10px] font-black uppercase tracking-widest ${estilos.textoSecundario[tema]}`}
							>
								Nacional
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className={`w-2.5 h-2.5 rounded-full ${tema === "light" ? "bg-orange-400" : "bg-orange-500/80"}`}
							></div>
							<span
								className={`text-[10px] font-black uppercase tracking-widest ${estilos.textoSecundario[tema]}`}
							>
								Regional
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className={`w-2.5 h-2.5 rounded-full ${tema === "light" ? "bg-blue-400" : "bg-blue-500/80"}`}
							></div>
							<span
								className={`text-[10px] font-black uppercase tracking-widest ${estilos.textoSecundario[tema]}`}
							>
								Aniversários
							</span>
						</div>
					</div>

					{/* Resumo do Mês */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-12">
						{/* Box Nacionais */}
						<div
							className={`p-6 rounded-[2rem] border transition-all ${estilos.painel[tema]}`}
						>
							<h3
								className={`text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2.5 ${tema === "light" ? "text-red-600" : "text-red-400"}`}
							>
								<span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/20"></span>
								Feriados Nacionais
							</h3>
							{feriadosNacionais.length > 0 ? (
								<ul className="flex flex-col gap-3">
									{feriadosNacionais.map((f, i) => (
										<li
											key={i}
											className="text-sm font-semibold flex items-center justify-between group"
										>
											<span
												className={`truncate pr-2 transition-colors ${estilos.textoSecundario[tema]} group-hover:${estilos.textoPrincipal[tema]}`}
											>
												{f.nome}
											</span>
											<span
												className={`font-black px-2.5 py-1 rounded-md text-[10px] shrink-0 border ${tema === "light" ? "bg-slate-100/50 border-slate-200 text-slate-500" : "bg-slate-800/50 border-slate-700 text-slate-400"}`}
											>
												{f.dia.toString().padStart(2, "0")}/
												{(f.mes + 1).toString().padStart(2, "0")}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p
									className={`text-[11px] uppercase tracking-widest font-bold opacity-50 ${estilos.textoSecundario[tema]}`}
								>
									Nenhum feriado
								</p>
							)}
						</div>

						{/* Box Regionais */}
						<div
							className={`p-6 rounded-[2rem] border transition-all ${estilos.painel[tema]}`}
						>
							<h3
								className={`text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2.5 ${tema === "light" ? "text-orange-600" : "text-orange-400"}`}
							>
								<span className="w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></span>
								Regionais / Municipais
							</h3>
							{feriadosRegionais.length > 0 ? (
								<ul className="flex flex-col gap-3">
									{feriadosRegionais.map((f, i) => (
										<li
											key={i}
											className="text-sm font-semibold flex items-center justify-between group"
										>
											<span
												className={`truncate pr-2 transition-colors ${estilos.textoSecundario[tema]} group-hover:${estilos.textoPrincipal[tema]}`}
											>
												{f.nome}
											</span>
											<span
												className={`font-black px-2.5 py-1 rounded-md text-[10px] shrink-0 border ${tema === "light" ? "bg-slate-100/50 border-slate-200 text-slate-500" : "bg-slate-800/50 border-slate-700 text-slate-400"}`}
											>
												{f.dia.toString().padStart(2, "0")}/
												{(f.mes + 1).toString().padStart(2, "0")}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p
									className={`text-[11px] uppercase tracking-widest font-bold opacity-50 ${estilos.textoSecundario[tema]}`}
								>
									Nenhum feriado
								</p>
							)}
						</div>

						{/* Box Aniversários */}
						<div
							className={`p-6 rounded-[2rem] border transition-all ${estilos.painel[tema]}`}
						>
							<h3
								className={`text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2.5 ${tema === "light" ? "text-blue-600" : "text-blue-400"}`}
							>
								<span className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></span>
								Aniversários da Equipe
							</h3>
							{aniversariosMes.length > 0 ? (
								<ul className="flex flex-col gap-3">
									{aniversariosMes.map((f, i) => (
										<li
											key={i}
											className="text-sm font-semibold flex items-center justify-between group"
										>
											<span
												className={`truncate pr-2 flex items-center gap-2 transition-colors ${estilos.textoSecundario[tema]} group-hover:${estilos.textoPrincipal[tema]}`}
											>
												<span className="text-sm">🎂</span> {f.nome}
											</span>
											<span
												className={`font-black px-2.5 py-1 rounded-md text-[10px] shrink-0 border ${tema === "light" ? "bg-slate-100/50 border-slate-200 text-slate-500" : "bg-slate-800/50 border-slate-700 text-slate-400"}`}
											>
												{f.dia.toString().padStart(2, "0")}/
												{(f.mes + 1).toString().padStart(2, "0")}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p
									className={`text-[11px] uppercase tracking-widest font-bold opacity-50 ${estilos.textoSecundario[tema]}`}
								>
									Nenhum aniversariante
								</p>
							)}
						</div>
					</div>
				</main>
			</div>

			<style
				dangerouslySetInnerHTML={{
					__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
				}}
			/>
		</div>
	);
}
