import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Header } from "../components/Header";

export function SalaReuniao({ tema, setTema }) {
	const navigate = useNavigate();

	// Garantindo string
	const usuarioLogado = String(
		localStorage.getItem("usuarioLogado") || "Usuário",
	);
	const isAdmin = usuarioLogado === "Bruno M" || usuarioLogado === "Pedro L";

	// Retorna a data de hoje no formato YYYY-MM-DD
	const getHojeFormatado = () => {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	};

	const hoje = getHojeFormatado();
	const [dataFiltro, setDataFiltro] = useState(hoje);
	const [agendamentos, setAgendamentos] = useState([]);
	const [carregando, setCarregando] = useState(true);

	const [novoAgendamento, setNovoAgendamento] = useState({
		titulo: "",
		data_agendamento: hoje,
		hora_inicio: "",
		hora_fim: "",
	});

	const ciclarTema = () => {
		if (tema === "light") setTema("dark");
		else if (tema === "dark") setTema("black");
		else setTema("light");
	};

	// NAVEGAÇÃO DE DIAS
	const mudarDia = (incremento) => {
		const [ano, mes, dia] = dataFiltro.split("-");
		const novaData = new Date(ano, mes - 1, dia);
		novaData.setDate(novaData.getDate() + incremento);

		const novoAno = novaData.getFullYear();
		const novoMes = String(novaData.getMonth() + 1).padStart(2, "0");
		const novoDia = String(novaData.getDate()).padStart(2, "0");

		setDataFiltro(`${novoAno}-${novoMes}-${novoDia}`);
	};

	const irParaHoje = () => setDataFiltro(getHojeFormatado());

	const carregarAgendamentos = useCallback(async () => {
		setCarregando(true);
		try {
			const { data, error } = await supabase
				.from("sala_reuniao")
				.select("*")
				.eq("data_agendamento", dataFiltro)
				.order("hora_inicio", { ascending: true });

			if (error) throw error;
			setAgendamentos(data || []);
		} catch (err) {
			console.error("Erro ao carregar agenda:", err);
		} finally {
			setCarregando(false);
		}
	}, [dataFiltro]);

	useEffect(() => {
		carregarAgendamentos();
	}, [carregarAgendamentos]);

	const handleSolicitar = async (e) => {
		e.preventDefault();
		if (
			!novoAgendamento.titulo ||
			!novoAgendamento.hora_inicio ||
			!novoAgendamento.hora_fim
		) {
			alert("Preencha todos os campos obrigatórios!");
			return;
		}
		if (novoAgendamento.hora_inicio >= novoAgendamento.hora_fim) {
			alert("A hora de início deve ser anterior à hora de fim.");
			return;
		}

		try {
			const { error } = await supabase.from("sala_reuniao").insert([
				{
					usuario_solicitante: usuarioLogado,
					titulo: novoAgendamento.titulo,
					data_agendamento: novoAgendamento.data_agendamento,
					hora_inicio: novoAgendamento.hora_inicio,
					hora_fim: novoAgendamento.hora_fim,
					status: "Pendente",
				},
			]);

			if (error) throw error;

			alert("Solicitação enviada! Aguarde a aprovação da administração.");
			setNovoAgendamento({
				...novoAgendamento,
				titulo: "",
				hora_inicio: "",
				hora_fim: "",
			});
			carregarAgendamentos();
		} catch (err) {
			console.error("Erro ao salvar:", err);
			alert("Falha ao processar o agendamento.");
		}
	};

	const handleAprovar = async (id) => {
		if (!isAdmin) return;
		try {
			const { error } = await supabase
				.from("sala_reuniao")
				.update({ status: "Aprovado" })
				.eq("id", id);
			if (error) throw error;
			carregarAgendamentos();
		} catch (err) {
			alert("Erro ao aprovar.");
		}
	};

	// AGORA RECEBE O SOLICITANTE PARA VALIDAR A EXCLUSÃO
	const handleExcluir = async (id, solicitante) => {
		const isOwner = solicitante === usuarioLogado;

		// Trava de segurança: Se não for admin E não for o dono do agendamento, barra.
		if (!isAdmin && !isOwner) {
			alert("Você só pode cancelar os seus próprios agendamentos.");
			return;
		}

		const mensagem =
			isAdmin && !isOwner
				? "Deseja realmente excluir/recusar este agendamento?"
				: "Deseja cancelar o seu agendamento?";

		if (!window.confirm(mensagem)) return;

		try {
			const { error } = await supabase
				.from("sala_reuniao")
				.delete()
				.eq("id", id);
			if (error) throw error;
			carregarAgendamentos();
		} catch (err) {
			alert("Erro ao excluir.");
		}
	};

	const formatarHora = (horaBanco) =>
		horaBanco ? String(horaBanco).substring(0, 5) : "";

	// Definições visuais adaptativas
	const isLight = tema === "light";
	const isBlack = tema === "black";

	const bgScreen = isLight
		? "bg-slate-50"
		: isBlack
			? "bg-black"
			: "bg-slate-900";
	const bgCard = isLight
		? "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
		: isBlack
			? "bg-[#0a0a0a] border-zinc-800"
			: "bg-slate-800 border-slate-700 shadow-2xl shadow-black/40";
	const textTitle = isLight
		? "text-slate-800"
		: isBlack
			? "text-zinc-100"
			: "text-slate-100";
	const textSub = isLight
		? "text-slate-500"
		: isBlack
			? "text-zinc-400"
			: "text-slate-400";

	const inputStyle = isLight
		? "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
		: isBlack
			? "bg-[#111] border-zinc-800 text-zinc-100 focus:border-blue-500 focus:bg-[#1a1a1a] focus:ring-4 focus:ring-blue-500/10"
			: "bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-400 focus:bg-slate-900 focus:ring-4 focus:ring-blue-400/10";

	const btnNavStyle = isLight
		? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600"
		: isBlack
			? "bg-[#111] border-zinc-800 text-zinc-400 hover:bg-[#1a1a1a] hover:text-blue-400"
			: "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-blue-400";

	return (
		<div
			className={`min-h-screen ${bgScreen} transition-colors duration-500 p-4 pt-6 relative font-sans flex flex-col overflow-hidden`}
		>
			{/* Hack CSS: Esconde o Header nativo para não conflitar */}
			<style>{`
        .header-search-nuker div:has(> input[type="text"]),
        .header-search-nuker div:has(> select) { display: none !important; }
        .header-search-nuker select, 
        .header-search-nuker input[type="text"] { display: none !important; }
      `}</style>

			{!isBlack && (
				<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
					<div
						className={`absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[130px] opacity-50 transition-colors duration-500 ${isLight ? "bg-blue-200" : "bg-blue-900/30"}`}
					></div>
					<div
						className={`absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-60 transition-colors duration-500 ${isLight ? "bg-indigo-100" : "bg-indigo-900/20"}`}
					></div>
				</div>
			)}

			<div className="relative z-10 flex flex-col flex-1 w-full max-w-[1400px] mx-auto">
				<div className="header-search-nuker">
					<Header
						usuarioLogado={usuarioLogado}
						periodo={{
							ano: String(new Date().getFullYear()),
							mes: String(new Date().getMonth() + 1).padStart(2, "0"),
						}}
						mudarPeriodo={() => {}}
						filtro=""
						setFiltro={() => {}}
						tema={tema}
						onCiclarTema={ciclarTema}
						onLogout={() => {
							localStorage.removeItem("usuarioLogado");
							navigate("/login");
						}}
						iconeEsquerda={
							<button
								onClick={() => navigate("/hub")}
								className={`p-2.5 rounded-xl transition-all duration-300 ${isLight ? "hover:bg-slate-100 text-slate-500 hover:text-blue-600" : isBlack ? "hover:bg-zinc-900 text-zinc-400 hover:text-blue-400" : "hover:bg-slate-800 text-slate-400 hover:text-blue-400"}`}
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

				<div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
					{/* LADO ESQUERDO: Formulário */}
					<div className={`p-6 rounded-3xl border flex flex-col ${bgCard}`}>
						<div className="flex items-center gap-3 mb-6">
							<div
								className={`p-2.5 rounded-xl ${isLight ? "bg-blue-100 text-blue-600" : isBlack ? "bg-blue-900/30 text-blue-400" : "bg-blue-900/40 text-blue-400"}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path
										fillRule="evenodd"
										d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h2
								className={`text-xl font-black uppercase tracking-wide ${textTitle}`}
							>
								Agendar Sala
							</h2>
						</div>

						<form onSubmit={handleSolicitar} className="flex flex-col gap-5">
							<div>
								<label
									className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ml-1 ${textSub}`}
								>
									Motivo da Reunião
								</label>
								<input
									type="text"
									value={novoAgendamento.titulo}
									onChange={(e) =>
										setNovoAgendamento({
											...novoAgendamento,
											titulo: e.target.value,
										})
									}
									placeholder="Ex: Apresentação de Resultados"
									className={`w-full rounded-xl px-4 py-3.5 text-sm font-medium border transition-all shadow-sm ${inputStyle}`}
								/>
							</div>

							<div>
								<label
									className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ml-1 ${textSub}`}
								>
									Data
								</label>
								<input
									type="date"
									value={novoAgendamento.data_agendamento}
									onChange={(e) =>
										setNovoAgendamento({
											...novoAgendamento,
											data_agendamento: e.target.value,
										})
									}
									className={`w-full rounded-xl px-4 py-3.5 text-sm font-medium border transition-all cursor-pointer shadow-sm ${inputStyle}`}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ml-1 ${textSub}`}
									>
										Início
									</label>
									<input
										type="time"
										value={novoAgendamento.hora_inicio}
										onChange={(e) =>
											setNovoAgendamento({
												...novoAgendamento,
												hora_inicio: e.target.value,
											})
										}
										className={`w-full rounded-xl px-4 py-3.5 text-sm font-medium border transition-all cursor-pointer shadow-sm ${inputStyle}`}
									/>
								</div>
								<div>
									<label
										className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ml-1 ${textSub}`}
									>
										Fim
									</label>
									<input
										type="time"
										value={novoAgendamento.hora_fim}
										onChange={(e) =>
											setNovoAgendamento({
												...novoAgendamento,
												hora_fim: e.target.value,
											})
										}
										className={`w-full rounded-xl px-4 py-3.5 text-sm font-medium border transition-all cursor-pointer shadow-sm ${inputStyle}`}
									/>
								</div>
							</div>

							<button
								type="submit"
								className={`mt-4 w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all duration-300 shadow-lg hover:-translate-y-1 text-white ${isLight ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30" : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 shadow-blue-900/40"}`}
							>
								Solicitar Horário
							</button>
						</form>

						<div className={`mt-auto pt-8`}>
							<div
								className={`p-5 rounded-2xl border ${isLight ? "bg-slate-50 border-slate-200" : isBlack ? "bg-[#111] border-zinc-800" : "bg-slate-800/50 border-slate-700"}`}
							>
								<div className="flex items-center gap-2 mb-2">
									<span className="text-base">📌</span>
									<span
										className={`text-[11px] font-black uppercase tracking-wider ${textTitle}`}
									>
										Regras da Sala
									</span>
								</div>
								<p
									className={`text-[11px] leading-relaxed font-medium ${textSub}`}
								>
									As solicitações ficam pendentes até a aprovação de um
									Administrador. Por favor, respeite o horário limite.
								</p>
							</div>
						</div>
					</div>

					{/* LADO DIREITO: Timeline de Agenda */}
					<div
						className={`lg:col-span-2 p-6 rounded-3xl border flex flex-col ${bgCard}`}
					>
						{/* CABEÇALHO DA TIMELINE */}
						<div
							className={`flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-6 pb-6 border-b border-dashed ${isLight ? "border-slate-300" : isBlack ? "border-zinc-800" : "border-slate-700"}`}
						>
							<h2
								className={`text-xl font-black uppercase tracking-wide flex items-center gap-3 ${textTitle}`}
							>
								<div
									className={`p-2 rounded-lg ${isLight ? "bg-slate-100 text-slate-600" : isBlack ? "bg-zinc-900 text-zinc-400" : "bg-slate-800 text-slate-400"}`}
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
											d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
										/>
									</svg>
								</div>
								Programação do Dia
							</h2>

							<div className="flex flex-wrap items-center gap-2">
								<button
									onClick={() => mudarDia(-1)}
									className={`p-2.5 rounded-xl border transition-all ${btnNavStyle}`}
									title="Dia Anterior"
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

								<input
									type="date"
									value={dataFiltro}
									onChange={(e) => setDataFiltro(e.target.value)}
									className={`rounded-xl px-4 py-2.5 text-sm font-bold border transition-all cursor-pointer shadow-sm min-w-[140px] text-center ${inputStyle}`}
								/>

								<button
									onClick={() => mudarDia(1)}
									className={`p-2.5 rounded-xl border transition-all ${btnNavStyle}`}
									title="Próximo Dia"
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

								<button
									onClick={irParaHoje}
									className={`px-4 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wide transition-all ml-1 ${
										dataFiltro === hoje
											? isLight
												? "bg-blue-50 border-blue-200 text-blue-600 opacity-50 cursor-default"
												: "bg-blue-900/20 border-blue-900/30 text-blue-400 opacity-50 cursor-default"
											: btnNavStyle
									}`}
									disabled={dataFiltro === hoje}
								>
									Hoje
								</button>
							</div>
						</div>

						<div
							className={`flex-1 overflow-auto pr-2 scrollbar-thin ${isLight ? "scrollbar-thumb-slate-300" : isBlack ? "scrollbar-thumb-zinc-800" : "scrollbar-thumb-slate-700"}`}
						>
							{carregando ? (
								<div className="flex justify-center items-center h-40">
									<span
										className={`text-sm font-bold uppercase tracking-widest animate-pulse ${textSub}`}
									>
										Carregando agenda...
									</span>
								</div>
							) : agendamentos.length === 0 ? (
								<div
									className={`h-full min-h-[350px] flex flex-col items-center justify-center rounded-3xl border ${isLight ? "border-blue-100 bg-gradient-to-b from-blue-50/50 to-transparent" : isBlack ? "border-zinc-800/80 bg-gradient-to-b from-[#111] to-transparent" : "border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-transparent"}`}
								>
									<div
										className={`w-28 h-28 mb-6 rounded-full flex items-center justify-center shadow-inner ${isLight ? "bg-white border border-slate-100" : isBlack ? "bg-[#0a0a0a] border border-zinc-800" : "bg-slate-800/80 border border-slate-700"}`}
									>
										<span className="text-6xl drop-shadow-sm opacity-90">
											🛋️
										</span>
									</div>
									<h3
										className={`text-xl font-black uppercase tracking-widest mb-2 ${textTitle}`}
									>
										Sala Livre Hoje!
									</h3>
									<p
										className={`text-sm font-medium text-center max-w-[280px] ${textSub}`}
									>
										Aproveite, não há reuniões marcadas para esta data. Solicite
										um horário ao lado!
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-4 pl-1 pb-4">
									{agendamentos.map((ag) => {
										const isAprovado = ag.status === "Aprovado";
										const isOwner = ag.usuario_solicitante === usuarioLogado;

										// Condicionais de exibição dos botões
										const canApprove = isAdmin && !isAprovado;
										const canDelete = isAdmin || isOwner;

										const bgItem = isLight
											? "bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
											: isBlack
												? "bg-[#111] border-zinc-800 hover:border-zinc-700 hover:-translate-y-0.5"
												: "bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-0.5";

										const timeBlockBg = isLight
											? "bg-blue-50 text-blue-700 border-blue-100 shadow-inner"
											: isBlack
												? "bg-blue-900/10 text-blue-400 border-blue-900/30"
												: "bg-blue-900/20 text-blue-300 border-blue-800/50";

										return (
											<div
												key={ag.id}
												className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${bgItem}`}
											>
												<div className="flex items-center gap-4 sm:gap-6">
													<div
														className={`flex flex-col items-center justify-center min-w-[85px] py-3 rounded-xl border transition-colors ${timeBlockBg}`}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={2.5}
															stroke="currentColor"
															className="w-4 h-4 mb-1 opacity-80"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														<span className="text-base font-black leading-none">
															{formatarHora(ag.hora_inicio)}
														</span>
														<span className="text-[9px] font-extrabold uppercase tracking-widest my-0.5 opacity-60">
															Até
														</span>
														<span className="text-xs font-bold leading-none opacity-90">
															{formatarHora(ag.hora_fim)}
														</span>
													</div>

													<div
														className={`hidden sm:block w-px h-16 ${isLight ? "bg-slate-200" : isBlack ? "bg-zinc-800" : "bg-slate-700"}`}
													></div>

													<div className="flex flex-col">
														<span
															className={`text-base sm:text-lg font-black tracking-tight mb-1 flex items-center gap-2 ${textTitle}`}
														>
															{ag.titulo}
															{/* TAG VISUAL SE O AGENDAMENTO FOR DO USUÁRIO */}
															{isOwner && (
																<span
																	className={`px-1.5 py-0.5 text-[8px] uppercase tracking-widest rounded bg-blue-500/10 text-blue-500 border border-blue-500/20`}
																>
																	Meu
																</span>
															)}
														</span>
														<span
															className={`text-[11px] font-bold uppercase tracking-wide ${textSub}`}
														>
															Por:{" "}
															<span
																className={
																	isLight ? "text-blue-600" : "text-blue-400"
																}
															>
																{ag.usuario_solicitante}
															</span>
														</span>

														<div className="mt-3">
															<span
																className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
																	isAprovado
																		? isLight
																			? "bg-emerald-100 text-emerald-700"
																			: isBlack
																				? "bg-emerald-900/30 text-emerald-400"
																				: "bg-emerald-900/40 text-emerald-400"
																		: isLight
																			? "bg-amber-100 text-amber-700"
																			: isBlack
																				? "bg-amber-900/30 text-amber-400"
																				: "bg-amber-900/40 text-amber-400"
																}`}
															>
																<span
																	className={`w-1.5 h-1.5 rounded-full ${isAprovado ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
																></span>
																{isAprovado ? "Aprovado" : "Pendente"}
															</span>
														</div>
													</div>
												</div>

												{/* CONTROLES DE AÇÃO (ADMIN E/OU DONO DO AGENDAMENTO) */}
												{(canApprove || canDelete) && (
													<div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 ml-0 sm:ml-4 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 pl-0 sm:pl-4 border-dashed border-slate-200 dark:border-slate-700">
														{canApprove && (
															<button
																onClick={() => handleAprovar(ag.id)}
																title="Aprovar Horário"
																className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${isLight ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white" : isBlack ? "bg-emerald-900/20 text-emerald-400 hover:bg-emerald-800 hover:text-white" : "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-600 hover:text-white"}`}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={3}
																	stroke="currentColor"
																	className="w-5 h-5"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M4.5 12.75l6 6 9-13.5"
																	/>
																</svg>
															</button>
														)}

														{canDelete && (
															<button
																onClick={() =>
																	handleExcluir(ag.id, ag.usuario_solicitante)
																}
																title={
																	isAdmin
																		? "Excluir Horário"
																		: "Cancelar Meu Agendamento"
																}
																className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${isLight ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white" : isBlack ? "bg-red-900/20 text-red-400 hover:bg-red-900 hover:text-white" : "bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white"}`}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={3}
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
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
