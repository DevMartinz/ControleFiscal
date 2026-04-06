import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Header } from "../components/Header";

const ADMINS_TI = ["Bruno M"];

// --- 1. CONFIGURAÇÕES E CORES SEMÂNTICAS DE ALTO CONTRASTE ---
const getCorStatus = (status, tema) => {
	const isLight = tema === "light";
	switch (status) {
		case "Aberto":
			return isLight
				? "bg-rose-100 text-rose-800 border-rose-300 font-extrabold shadow-sm"
				: "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold";
		case "Em Andamento":
			return isLight
				? "bg-amber-100 text-amber-800 border-amber-300 font-extrabold shadow-sm"
				: "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold";
		case "Concluido":
			return isLight
				? "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold shadow-sm"
				: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold";
		case "Cancelado":
			return isLight
				? "bg-slate-200 text-slate-700 border-slate-400 font-bold shadow-sm"
				: "bg-slate-800 text-slate-400 border-slate-600 font-bold";
		default:
			return isLight
				? "bg-sky-100 text-sky-800 border-sky-300 font-bold shadow-sm"
				: "bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold";
	}
};

// SVGs minificados
const SvgEquip = () => (
	<svg
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-8 h-8"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
		/>
	</svg>
);
const SvgSis = () => (
	<svg
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-8 h-8"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
		/>
	</svg>
);
const SvgRede = () => (
	<svg
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-8 h-8"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
		/>
	</svg>
);
const SvgOutros = () => (
	<svg
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-8 h-8"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
		/>
	</svg>
);

const CATEGORIAS = [
	{
		id: "equipamentos",
		nome: "Equipamentos",
		descricao: "Computador, Mouse, Impressoras...",
		icone: <SvgEquip />,
		motivos: [
			"Computador não liga",
			"Monitor sem vídeo",
			"Mouse/Teclado não funciona",
			"Impressora falhando",
			"Outro problema físico",
		],
	},
	{
		id: "sistemas",
		nome: "Sistemas e Acessos",
		descricao: "Login, Senhas, ERP, eCac...",
		icone: <SvgSis />,
		motivos: [
			"Reset de Senha",
			"Sistema bloqueado",
			"Erro ao emitir nota",
			"Novo usuário",
			"Outro erro de sistema",
		],
	},
	{
		id: "rede",
		nome: "Rede e Internet",
		descricao: "Wi-Fi, Cabos, Conexão lenta...",
		icone: <SvgRede />,
		motivos: [
			"Sem acesso à Internet",
			"Rede muito lenta",
			"Wi-Fi caindo",
			"Não acessa pasta da rede",
			"Outro problema de rede",
		],
	},
	{
		id: "outros",
		nome: "Dúvidas e Outros",
		descricao: "Instalações, Dúvidas gerais...",
		icone: <SvgOutros />,
		motivos: [
			"Instalação de Programa",
			"Dúvida de Excel/Word",
			"Sugestão para a T.I",
			"Outros",
		],
	},
];

// --- 2. COMPONENTES ISOLADOS ---

const TabButton = ({ id, label, atual, onClick, estilos, badge }) => (
	<button
		onClick={() => onClick(id)}
		className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center ${atual === id ? estilos.abaSelecionada : estilos.abaNaoSelecionada}`}
	>
		{label}{" "}
		{badge && (
			<span className="ml-2 bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[8px] animate-pulse shadow-sm shadow-rose-500/50">
				{badge}
			</span>
		)}
	</button>
);

const ChamadoCard = ({
	c,
	isGerenciar,
	tema,
	estilos,
	onAtualizar,
	onCancelar,
}) => {
	const isAtivo = c.status === "Aberto" || c.status === "Em Andamento";
	const dataFormatada = new Date(c.created_at).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div
			className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all duration-300 ${estilos.card}`}
		>
			<div className="flex-1">
				<div className="flex items-center flex-wrap gap-3 mb-2">
					<span
						className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border ${getCorStatus(c.status, tema)}`}
					>
						{c.status}
					</span>
					<span className="text-xs text-slate-500 font-bold flex-1">
						{dataFormatada}
					</span>

					{c.status === "Concluido" && (
						<span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-4 h-4"
							>
								<path
									fillRule="evenodd"
									d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
									clipRule="evenodd"
								/>
							</svg>
							Resolvido
						</span>
					)}
				</div>

				<h3 className={`text-lg font-black ${estilos.texto} mt-1`}>
					{c.motivo}
				</h3>
				<div className="flex flex-wrap items-center gap-2 mt-1 mb-3 text-sm text-slate-500 font-medium">
					<span
						className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-widest border border-transparent ${estilos.categoriaBadge}`}
					>
						{c.categoria}
					</span>
					{isGerenciar && (
						<>
							<span>•</span>
							<span className="font-bold text-slate-400">
								Solicitante:{" "}
								<span className={estilos.texto}>{c.solicitante}</span>
							</span>
						</>
					)}
				</div>

				{c.descricao && (
					<div
						className={`p-4 rounded-xl text-sm border-l-4 border-slate-300 dark:border-slate-600 font-medium ${tema === "light" ? "bg-slate-50 text-slate-700" : tema === "dark" ? "bg-slate-900/50 text-slate-300" : "bg-[#111] text-zinc-300"}`}
					>
						{c.descricao}
					</div>
				)}
			</div>

			<div className="flex sm:flex-col gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200/50 dark:border-slate-700/50 pt-4 sm:pt-0 sm:pl-5 mt-2 sm:mt-0 justify-center min-w-[150px]">
				{isGerenciar ? (
					<>
						{c.status === "Aberto" && (
							<button
								onClick={() => onAtualizar(c.id, "Em Andamento")}
								className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-center shadow-lg shadow-blue-500/30 ring-1 ring-blue-500/50 hover:-translate-y-0.5"
							>
								Iniciar
							</button>
						)}
						{isAtivo && (
							<button
								onClick={() => onAtualizar(c.id, "Concluido")}
								className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white transition-all px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-center shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-500/50 hover:-translate-y-0.5"
							>
								Concluir
							</button>
						)}
					</>
				) : (
					isAtivo && (
						<button
							onClick={() => onCancelar(c.id)}
							className="w-full bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-white transition-all px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-center shadow-lg shadow-rose-500/30 ring-1 ring-rose-500/50 hover:-translate-y-0.5"
							title="Cancelar Chamado"
						>
							Cancelar
						</button>
					)
				)}
			</div>
		</div>
	);
};

// --- 3. TELA PRINCIPAL (T.I) ---
export function TI({ tema, setTema }) {
	const navigate = useNavigate();
	const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";
	const isAdmin = ADMINS_TI.includes(usuarioLogado);

	const [abaAtiva, setAbaAtiva] = useState("solicitar");
	const [catSelecionada, setCatSelecionada] = useState(null);
	const [motivo, setMotivo] = useState("");
	const [descricao, setDescricao] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [sucesso, setSucesso] = useState(false);
	const [notificacao, setNotificacao] = useState(null);

	const [chamadosUsuario, setChamadosUsuario] = useState([]);
	const [chamadosFila, setChamadosFila] = useState([]);
	const [loading, setLoading] = useState(false);

	// ESTILOS PREMIUM - Glassmorphism
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
				? "bg-white/90 backdrop-blur-md border-white/60 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:bg-white"
				: tema === "dark"
					? "bg-slate-800/80 backdrop-blur-md border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-slate-800/95"
					: "bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:bg-[#111]",
		input:
			tema === "light"
				? "bg-white/80 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 shadow-sm transition-all"
				: tema === "dark"
					? "bg-slate-900/50 border-slate-700 focus:bg-slate-900 focus:border-blue-500 text-white transition-all"
					: "bg-black/50 border-zinc-800 focus:bg-black focus:border-zinc-500 text-zinc-100 transition-all",
		voltarBotao:
			tema === "light"
				? "hover:bg-white/50 text-slate-600 border border-transparent hover:border-white"
				: "hover:bg-slate-800 text-slate-400",
		abasFundo:
			tema === "light"
				? "bg-slate-200/50 backdrop-blur-md border border-white/40 shadow-inner"
				: "bg-slate-800/80 backdrop-blur-md border border-slate-700",
		abaSelecionada:
			tema === "light"
				? "bg-white text-blue-700 shadow-md ring-1 ring-slate-200/50 scale-105"
				: "bg-blue-600 text-white shadow-md scale-105",
		abaNaoSelecionada:
			tema === "light"
				? "text-slate-500 hover:text-slate-800"
				: "text-slate-400 hover:text-white",
		botaoAtualizar:
			tema === "light"
				? "bg-white/80 backdrop-blur-sm border border-white/60 text-slate-500 hover:text-blue-600 hover:shadow-md hover:bg-white"
				: "bg-slate-800/80 text-slate-400 hover:text-blue-400",
		iconeCategoria:
			tema === "light"
				? "bg-blue-50 text-blue-600"
				: "bg-slate-700 text-blue-400",
		categoriaSelecionada:
			tema === "light"
				? "bg-white ring-2 ring-blue-500 border-transparent shadow-xl shadow-blue-500/10 scale-[1.02] -translate-y-1"
				: "bg-slate-800 ring-2 ring-blue-500 border-transparent shadow-xl shadow-blue-900/20 scale-[1.02] -translate-y-1",
		categoriaBadge:
			tema === "light"
				? "bg-slate-100 text-slate-500"
				: "bg-slate-700 text-slate-300",
	};

	const fetchChamados = useCallback(
		async (isGerenciar) => {
			setLoading(true);
			let query = supabase
				.from("chamados")
				.select("*")
				.order("created_at", { ascending: false });
			if (!isGerenciar) query = query.eq("solicitante", usuarioLogado);

			const { data, error } = await query;
			if (!error && data) {
				isGerenciar ? setChamadosFila(data) : setChamadosUsuario(data);
			}
			setLoading(false);
		},
		[usuarioLogado],
	);

	useEffect(() => {
		const carregarDados = async () => {
			if (abaAtiva === "gerenciar" && isAdmin) await fetchChamados(true);
			else if (abaAtiva === "acompanhar") await fetchChamados(false);
		};
		carregarDados();
	}, [abaAtiva, isAdmin, fetchChamados]);

	useEffect(() => {
		if (isAdmin) return;
		const canal = supabase
			.channel(`ti-${usuarioLogado}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "chamados",
					filter: `solicitante=eq.${usuarioLogado}`,
				},
				(payload) => {
					if (["Em Andamento", "Concluido"].includes(payload.new.status)) {
						setNotificacao({
							status: payload.new.status,
							motivo: payload.new.motivo,
						});
					}
				},
			)
			.subscribe();
		return () => supabase.removeChannel(canal);
	}, [isAdmin, usuarioLogado]);

	// --- CONTROLE DE TEMPO AUMENTADO PARA 8 SEGUNDOS ---
	useEffect(() => {
		if (notificacao) {
			const timer = setTimeout(() => setNotificacao(null), 8000);
			return () => clearTimeout(timer);
		}
	}, [notificacao]);

	const enviarChamado = async (e) => {
		e.preventDefault();
		if (!catSelecionada || !motivo) return;
		setEnviando(true);
		const { error } = await supabase.from("chamados").insert([
			{
				solicitante: usuarioLogado,
				categoria: catSelecionada.nome,
				motivo,
				descricao,
			},
		]);
		if (!error) {
			setSucesso(true);
			setTimeout(() => {
				setSucesso(false);
				setCatSelecionada(null);
				setMotivo("");
				setDescricao("");
			}, 3000);
		} else alert("Erro ao enviar chamado.");
		setEnviando(false);
	};

	const atualizarStatus = async (id, status) => {
		const { error } = await supabase
			.from("chamados")
			.update({ status })
			.eq("id", id);
		if (!error) fetchChamados(true);
	};

	const cancelarChamado = async (id) => {
		if (!confirm("Tem certeza que deseja cancelar este chamado?")) return;
		const { error } = await supabase
			.from("chamados")
			.update({ status: "Cancelado" })
			.eq("id", id);
		if (!error) fetchChamados(false);
	};

	const isGerenciar = abaAtiva === "gerenciar";
	const listaAtual = isGerenciar ? chamadosFila : chamadosUsuario;

	return (
		<div
			className={`min-h-screen ${estilos.fundo} flex flex-col font-sans transition-colors duration-500 relative overflow-hidden`}
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

			{/* --- NOTIFICAÇÃO PREMIUM FLUTUANTE NO CANTO INFERIOR DIREITO --- */}
			{notificacao && (
				<div className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-[100] w-full max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-500">
					<div
						className={`relative flex flex-col overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-xl ${
							tema === "light"
								? "bg-white/95 border-slate-200/80 shadow-blue-900/20"
								: tema === "dark"
									? "bg-slate-800/95 border-slate-700/50 shadow-black/50"
									: "bg-[#111]/95 border-zinc-800/50 shadow-black/50"
						}`}
					>
						<div className="flex items-start gap-4 p-5">
							{/* Ícone de Atualização */}
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
									tema === "light"
										? "bg-blue-100 text-blue-600"
										: "bg-blue-900/40 text-blue-400"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
									/>
								</svg>
							</div>

							{/* Textos da Notificação */}
							<div className="flex-1 min-w-0 pt-0.5">
								<p
									className={`text-[10px] font-black uppercase tracking-widest ${tema === "light" ? "text-blue-600" : "text-blue-400"}`}
								>
									Atualização de Chamado
								</p>
								<p
									className={`text-sm font-bold mt-1 leading-tight line-clamp-2 ${estilos.texto}`}
								>
									{notificacao.motivo}
								</p>
								<div className="mt-2.5 flex items-center gap-2">
									<span
										className={`${getCorStatus(notificacao.status, tema).split(" ")[0]} text-white px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm`}
									>
										➔ {notificacao.status}
									</span>
								</div>
							</div>

							{/* Botão de Fechar Expresso */}
							<button
								onClick={() => setNotificacao(null)}
								className={`p-1.5 rounded-full transition-colors ${tema === "light" ? "hover:bg-slate-100 text-slate-400 hover:text-slate-600" : "hover:bg-slate-700 text-slate-500 hover:text-slate-300"}`}
								title="Dispensar alerta"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Barra de Progresso Animada */}
						<div
							className={`h-1 w-full absolute bottom-0 left-0 ${tema === "light" ? "bg-slate-200" : "bg-slate-700/50"}`}
						>
							<div
								className="h-full bg-blue-500 origin-left animate-progress"
								style={{
									animationDuration: "8s",
									animationTimingFunction: "linear",
									animationFillMode: "forwards",
								}}
							></div>
						</div>
					</div>
				</div>
			)}

			<div className="p-4 md:p-8 pb-0 relative z-10">
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
					titulo="T.I e Configurações"
					subtitulo="Suporte Técnico"
					iconeEsquerda={
						<button
							onClick={() => navigate("/hub")}
							className={`p-2 rounded-xl transition-all ${estilos.voltarBotao}`}
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
				>
					<div
						className={`flex ${estilos.abasFundo} p-1.5 rounded-2xl w-full sm:w-auto justify-center shadow-sm`}
					>
						<TabButton
							id="solicitar"
							label="Solicitar"
							atual={abaAtiva}
							onClick={setAbaAtiva}
							estilos={estilos}
						/>
						{!isAdmin && (
							<TabButton
								id="acompanhar"
								label="Acompanhar"
								atual={abaAtiva}
								onClick={setAbaAtiva}
								estilos={estilos}
							/>
						)}
						{isAdmin && (
							<TabButton
								id="gerenciar"
								label="Fila"
								atual={abaAtiva}
								onClick={setAbaAtiva}
								estilos={estilos}
								badge="Admin"
							/>
						)}
					</div>
				</Header>
			</div>

			<main className="flex-1 p-4 md:p-10 pt-4 max-w-5xl mx-auto w-full relative z-10">
				{abaAtiva === "solicitar" ? (
					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
						{sucesso ? (
							<div className="bg-white/80 backdrop-blur-md border border-white text-slate-800 p-10 rounded-3xl text-center flex flex-col items-center gap-4 mt-10 shadow-2xl shadow-emerald-500/10">
								<div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2.5}
										stroke="currentColor"
										className="w-10 h-10"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.5 12.75l6 6 9-13.5"
										/>
									</svg>
								</div>
								<h2 className="text-3xl font-black text-emerald-600">
									Chamado Aberto!
								</h2>
								<p className="font-medium text-sm text-slate-500">
									Sua solicitação foi enviada para a equipe de T.I e você será
									atendido em breve.
								</p>
							</div>
						) : (
							<>
								<div className="mb-6">
									<h2
										className={`text-2xl font-black tracking-tight ${estilos.texto}`}
									>
										O que está acontecendo?
									</h2>
									<p
										className={`${estilos.textoSecundario} font-medium mt-1 text-sm`}
									>
										Selecione uma categoria para relatar seu problema.
									</p>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
									{CATEGORIAS.map((cat) => (
										<button
											key={cat.id}
											onClick={() => {
												setCatSelecionada(cat);
												setMotivo("");
											}}
											className={`p-5 rounded-3xl border text-left flex items-center gap-4 transition-all duration-300 ${catSelecionada?.id === cat.id ? estilos.categoriaSelecionada : estilos.card}`}
										>
											<div
												className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${catSelecionada?.id === cat.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : estilos.iconeCategoria}`}
											>
												{cat.icone}
											</div>
											<div>
												<h3
													className={`font-black text-sm sm:text-base ${estilos.texto}`}
												>
													{cat.nome}
												</h3>
												<p
													className={`text-[10px] font-bold uppercase mt-1 line-clamp-1 ${estilos.textoSecundario}`}
												>
													{cat.descricao}
												</p>
											</div>
										</button>
									))}
								</div>

								{catSelecionada && (
									<form
										onSubmit={enviarChamado}
										className={`animate-in fade-in slide-in-from-bottom-4 duration-300 p-8 rounded-3xl border shadow-xl flex flex-col gap-6 ${estilos.card}`}
									>
										<div className="flex flex-col gap-2">
											<label
												className={`text-[10px] font-black uppercase tracking-widest ${estilos.textoSecundario}`}
											>
												Qual o motivo exato?
											</label>
											<select
												required
												value={motivo}
												onChange={(e) => setMotivo(e.target.value)}
												className={`w-full p-3.5 rounded-xl outline-none font-medium text-sm ${estilos.input}`}
											>
												<option value="" disabled>
													Selecione uma opção...
												</option>
												{catSelecionada.motivos.map((mot) => (
													<option key={mot} value={mot}>
														{mot}
													</option>
												))}
											</select>
										</div>
										<div className="flex flex-col gap-2">
											<label
												className={`text-[10px] font-black uppercase tracking-widest ${estilos.textoSecundario}`}
											>
												Descrição (Opcional)
											</label>
											<textarea
												rows="3"
												placeholder="Detalhes adicionais ou código do erro..."
												value={descricao}
												onChange={(e) => setDescricao(e.target.value)}
												className={`w-full p-4 rounded-xl outline-none text-sm resize-none ${estilos.input}`}
											/>
										</div>
										<button
											type="submit"
											disabled={enviando || !motivo}
											className={`mt-2 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] text-white flex items-center justify-center gap-2 transition-all
                        ${
													enviando || !motivo
														? "bg-slate-300 cursor-not-allowed shadow-none text-slate-500"
														: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg shadow-blue-500/30"
												}`}
										>
											{enviando ? "Enviando..." : "Abrir Chamado Técnico"}
										</button>
									</form>
								)}
							</>
						)}
					</div>
				) : (
					<div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
						<div className="flex items-center justify-between mb-6">
							<h2
								className={`text-2xl font-black tracking-tight ${estilos.texto}`}
							>
								{isGerenciar ? "Fila de Atendimento" : "Meus Chamados"}
							</h2>
							<button
								onClick={() => fetchChamados(isGerenciar)}
								className={`p-2.5 rounded-full transition-all ${estilos.botaoAtualizar}`}
								title="Atualizar"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2.5}
									stroke="currentColor"
									className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
									/>
								</svg>
							</button>
						</div>

						{loading ? (
							<div className="flex justify-center py-20">
								<div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
							</div>
						) : listaAtual.length === 0 ? (
							<div
								className={`p-16 text-center rounded-[2rem] font-bold uppercase tracking-widest flex flex-col items-center justify-center gap-4 ${tema === "light" ? "bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 text-slate-400" : tema === "dark" ? "bg-slate-800/50 border-2 border-dashed border-slate-700 text-slate-500" : "bg-[#0a0a0a] border border-dashed border-zinc-800 text-zinc-600"}`}
							>
								<span className="text-4xl">☕</span>
								{isGerenciar
									? "Fila limpa! Bom trabalho."
									: "Você não possui chamados."}
							</div>
						) : (
							<div className="flex flex-col gap-5">
								{listaAtual.map((c) => (
									<ChamadoCard
										key={c.id}
										c={c}
										isGerenciar={isGerenciar}
										tema={tema}
										estilos={estilos}
										onAtualizar={atualizarStatus}
										onCancelar={cancelarChamado}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</main>

			{/* --- ESTILO PARA A ANIMAÇÃO DA BARRA DE TEMPO --- */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
        @keyframes shrink-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-progress {
          animation-name: shrink-progress;
        }
      `,
				}}
			/>
		</div>
	);
}
