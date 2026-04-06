import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Imports atualizados com "../" pois agora estamos dentro da pasta "pages"
import { Header } from "../components/Header";
import { NotificacaoSped } from "../components/NotificacaoSped";
import { HistoricoSidebar } from "../components/HistoricoSidebar";
import { TabelaFiscal } from "../components/TabelaFiscal";
import { DashboardResumo } from "../components/DashboardResumo";
import { categorias, totalTarefasRequeridas } from "../data/constants";

export function Fiscal({ tema, setTema }) {
	const navigate = useNavigate();
	const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";

	const [filtroTela, setFiltroTela] = useState("");
	const [filtroValido, setFiltroValido] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setFiltroValido(filtroTela);
		}, 300);
		return () => clearTimeout(timer);
	}, [filtroTela]);

	const [mostrarHistorico, setMostrarHistorico] = useState(false);
	const [notificacao, setNotificacao] = useState(null);

	const dataAtual = new Date();
	const [periodo, setPeriodo] = useState({
		ano: dataAtual.getFullYear().toString(),
		mes: String(dataAtual.getMonth() + 1).padStart(2, "0"),
	});

	const [empresas, setEmpresas] = useState([]);
	const [historico, setHistorico] = useState([]);
	const [carregando, setCarregando] = useState(true);

	// Função para deslogar via Router
	const handleLogout = () => {
		localStorage.removeItem("usuarioLogado");
		navigate("/login");
	};

	// Função de alternar temas adaptada para usar o setTema que vem do App.jsx
	const ciclarTema = () => {
		if (tema === "light") setTema("dark");
		else if (tema === "dark") setTema("black");
		else setTema("light");
	};

	// --- ESTILOS PREMIUM (Fundo Gradiente) ---
	const estilosFundoBase = {
		light: "bg-gradient-to-br from-slate-50 to-slate-200",
		dark: "bg-gradient-to-br from-slate-800 to-slate-900",
		black: "bg-gradient-to-br from-[#111] to-black",
	};

	useEffect(() => {
		const carregarDadosDoBanco = async (mostrarLoading = true) => {
			if (mostrarLoading) setCarregando(true);

			const { data: listaEmpresas, error: erroEmpresas } = await supabase
				.from("enterprise")
				.select("*")
				.eq("active", true)
				.order("grupo_ordem", { ascending: true })
				.order("sigla", { ascending: true });

			if (erroEmpresas || !listaEmpresas) return;

			const nomesDosMeses = [
				"",
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
			const mesFormatado = nomesDosMeses[parseInt(periodo.mes, 10)];

			const { data: periodos } = await supabase
				.from("period")
				.select("id")
				.eq("month", mesFormatado)
				.eq("year", periodo.ano);

			const periodoData = periodos && periodos.length > 0 ? periodos[0] : null;

			let auditoriasDaTela = [];

			if (periodoData) {
				const { data: auditorias } = await supabase
					.from("audit")
					.select(`*, activity_type ( name, subtype ), user ( login )`)
					.eq("id_period", periodoData.id);

				if (auditorias) auditoriasDaTela = auditorias;
			}

			const empresasFormatadas = listaEmpresas.map((emp) => {
				const tarefasDessaEmpresa = {};
				const auditoriasDaEmpresa = auditoriasDaTela.filter(
					(a) => a.id_enterprise === emp.id,
				);

				auditoriasDaEmpresa.forEach((aud) => {
					if (aud.activity_type) {
						const chave = `${aud.activity_type.name}-${aud.activity_type.subtype}`;
						tarefasDessaEmpresa[chave] = {
							status: aud.status,
							user: aud.user?.login || "Sistema",
							data: new Date(aud.created_at || aud.date).toLocaleDateString(
								"pt-BR",
							),
						};
					}
				});

				return {
					...emp,
					nome: emp.sigla || emp.name,
					grupoNome: emp.grupo_nome,
					pasta: emp.directory,
					tarefas: tarefasDessaEmpresa,
				};
			});

			setEmpresas(empresasFormatadas);

			const historicoGlobal = auditoriasDaTela.map((aud) => {
				const emp = listaEmpresas.find((e) => e.id === aud.id_enterprise);
				const cat = aud.activity_type?.name || "Desconhecido";
				const sub = aud.activity_type?.subtype || "Tarefa";
				const status = aud.status;

				let dataCriacao;
				try {
					const rawDate = aud.created_at || aud.date;
					dataCriacao = rawDate ? new Date(rawDate) : new Date();
					if (isNaN(dataCriacao.getTime())) throw new Error("Data Inválida");
				} catch (e) {
					dataCriacao = new Date();
				}

				let corFundo = "bg-slate-500";
				let corBadge = "bg-slate-50 text-slate-600";

				if (status === "OK") {
					corFundo = "bg-green-500";
					corBadge = "bg-green-100 text-green-700";
				} else if (status === "NAO") {
					corFundo = "bg-red-500";
					corBadge = "bg-red-100 text-red-700";
				} else if (status === "Andamento") {
					corFundo = "bg-sky-500";
					corBadge = "bg-sky-100 text-sky-700";
				} else if (status === "Verificar") {
					corFundo = "bg-amber-500";
					corBadge = "bg-amber-100 text-amber-700";
				}

				return {
					id: aud.id || crypto.randomUUID(),
					usuario: aud.user?.login || "Sistema",
					data: dataCriacao.toLocaleDateString("pt-BR"),
					hora:
						dataCriacao.toLocaleTimeString("pt-BR", {
							hour: "2-digit",
							minute: "2-digit",
						}) || "00:00",
					acao: status,
					detalhe: `${cat}: ${sub} ➔ ${emp?.nome || emp?.sigla || "Empresa"}`,
					corFundo,
					corBadge,
					timestamp: dataCriacao.getTime(),
				};
			});

			historicoGlobal.sort((a, b) => b.timestamp - a.timestamp);
			setHistorico(historicoGlobal);
			if (mostrarLoading) setCarregando(false);
		};

		carregarDadosDoBanco(true);

		const inscricaoRealtime = supabase
			.channel("escutar-auditorias")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "audit" },
				() => {
					carregarDadosDoBanco(false);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(inscricaoRealtime);
		};
	}, [periodo.mes, periodo.ano]);

	const mudarPeriodo = (novoAno, novoMes) => {
		setPeriodo({ ano: novoAno, mes: novoMes });
	};

	const garantirPeriodoNoBanco = useCallback(async () => {
		const nomesDosMeses = [
			"",
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
		const mesFormatado = nomesDosMeses[parseInt(periodo.mes, 10)];

		const { data: periodos } = await supabase
			.from("period")
			.select("id")
			.eq("month", mesFormatado)
			.eq("year", periodo.ano);

		if (periodos && periodos.length > 0) return periodos[0].id;

		const { data: novoPeriodo, error } = await supabase
			.from("period")
			.insert({ month: mesFormatado, year: periodo.ano })
			.select("id");

		if (novoPeriodo && novoPeriodo.length > 0) return novoPeriodo[0].id;

		console.error("Erro ao criar/buscar o período:", error);
		return null;
	}, [periodo.ano, periodo.mes]);

	const atualizarTarefa = useCallback(
		async (empresaId, cat, sub, status) => {
			const dataLog = new Date().toLocaleString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
			const chave = `${cat}-${sub}`;

			setEmpresas((prev) =>
				prev.map((e) =>
					e.id === empresaId
						? {
								...e,
								tarefas: {
									...e.tarefas,
									[chave]: { status, user: usuarioLogado, data: dataLog },
								},
							}
						: e,
				),
			);

			try {
				const { data: tarefas, error: errTarefa } = await supabase
					.from("activity_type")
					.select("id")
					.eq("name", cat)
					.eq("subtype", sub);

				if (errTarefa || !tarefas || tarefas.length === 0) return;

				const { data: users, error: errUser } = await supabase
					.from("user")
					.select("id")
					.eq("login", usuarioLogado);

				if (errUser || !users || users.length === 0) return;

				const currentPeriodId = await garantirPeriodoNoBanco();
				if (!currentPeriodId) return;

				await supabase
					.from("audit")
					.upsert(
						{
							id_enterprise: empresaId,
							id_activity_type: tarefas[0].id,
							id_period: currentPeriodId,
							id_user: users[0].id,
							status: status,
							date: new Date().toISOString().split("T")[0],
						},
						{ onConflict: "id_period, id_enterprise, id_activity_type" },
					)
					.select();
			} catch (err) {
				console.error("Erro fatal no JS ao salvar tarefa:", err);
			}
		},
		[usuarioLogado, garantirPeriodoNoBanco],
	);

	const atualizarLinha = useCallback(
		async (empresaId, status) => {
			const dataLog = new Date().toLocaleString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});

			setEmpresas((prev) =>
				prev.map((e) => {
					if (e.id === empresaId) {
						const novasTarefas = { ...e.tarefas };
						categorias.forEach((cat) => {
							cat.filhas.forEach((sub) => {
								novasTarefas[`${cat.nome}-${sub}`] = {
									status,
									user: usuarioLogado,
									data: dataLog,
								};
							});
						});
						return { ...e, tarefas: novasTarefas };
					}
					return e;
				}),
			);

			try {
				const { data: users, error: errUser } = await supabase
					.from("user")
					.select("id")
					.eq("login", usuarioLogado);

				if (errUser || !users || users.length === 0) return;

				const currentPeriodId = await garantirPeriodoNoBanco();
				if (!currentPeriodId) return;

				const { data: atividades } = await supabase
					.from("activity_type")
					.select("id");
				if (!atividades || atividades.length === 0) return;

				const pacoteDeTarefas = atividades.map((ativ) => ({
					id_enterprise: empresaId,
					id_activity_type: ativ.id,
					id_period: currentPeriodId,
					id_user: users[0].id,
					status: status,
					date: new Date().toISOString().split("T")[0],
				}));

				await supabase
					.from("audit")
					.upsert(pacoteDeTarefas, {
						onConflict: "id_period, id_enterprise, id_activity_type",
					})
					.select();
			} catch (err) {
				console.error("Erro fatal no JS ao salvar linha:", err);
			}
		},
		[usuarioLogado, garantirPeriodoNoBanco],
	);

	const processarNotificacao = (aceitou) => {
		if (aceitou && notificacao) {
			const dataLog = new Date().toLocaleString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
			setEmpresas((prev) => {
				return prev.map((e) =>
					e.id === notificacao.id
						? {
								...e,
								tarefas: {
									...e.tarefas,
									"VERIFICAR CANCELADAS-NFE": {
										status: "Andamento",
										user: usuarioLogado,
										data: dataLog,
									},
									"VERIFICAR CANCELADAS-NFCE": {
										status: "Andamento",
										user: usuarioLogado,
										data: dataLog,
									},
									"VERIFICAR QUANTIDADE-NFE": {
										status: "Andamento",
										user: usuarioLogado,
										data: dataLog,
									},
									"VERIFICAR QUANTIDADE-NFCE": {
										status: "Andamento",
										user: usuarioLogado,
										data: dataLog,
									},
								},
							}
						: e,
				);
			});
		}
		setNotificacao(null);
	};

	return (
		<div
			className={`min-h-screen ${estilosFundoBase[tema]} transition-colors duration-500 p-4 pt-6 relative font-sans flex flex-col overflow-hidden`}
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

			<div className="relative z-10 flex flex-col flex-1 w-full max-w-[1920px] mx-auto">
				<NotificacaoSped
					dados={notificacao}
					onAceitar={() => processarNotificacao(true)}
					onRecusar={() => processarNotificacao(false)}
				/>

				{/* --- CORREÇÃO: Prop tema={tema} ADICIONADA AQUI --- */}
				<HistoricoSidebar
					mostrar={mostrarHistorico}
					historico={historico}
					onFechar={() => setMostrarHistorico(false)}
					tema={tema}
				/>

				<Header
					usuarioLogado={usuarioLogado}
					periodo={periodo}
					mudarPeriodo={mudarPeriodo}
					filtro={filtroTela}
					setFiltro={setFiltroTela}
					onAbrirHistorico={() => setMostrarHistorico(true)}
					onLogout={handleLogout}
					tema={tema}
					onCiclarTema={ciclarTema}
					// Botão voltar mais discreto e alinhado com as outras telas
					iconeEsquerda={
						<button
							onClick={() => navigate("/hub")}
							className={`p-2.5 rounded-xl transition-all duration-300 ${
								tema === "light"
									? "hover:bg-slate-100 text-slate-500 hover:text-blue-600"
									: tema === "dark"
										? "hover:bg-slate-800 text-slate-400 hover:text-blue-400"
										: "hover:bg-zinc-900 text-zinc-400 hover:text-blue-500"
							}`}
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

				<div className="w-full flex justify-center items-center mb-6 mt-4 px-4 sm:px-6">
					<DashboardResumo
						empresas={empresas}
						categorias={categorias}
						totalTarefasRequeridas={totalTarefasRequeridas}
						tema={tema}
					/>
				</div>

				<TabelaFiscal
					empresas={empresas}
					filtro={filtroValido}
					categorias={categorias}
					totalTarefasRequeridas={totalTarefasRequeridas}
					onAtualizarTarefa={atualizarTarefa}
					onAtualizarLinha={atualizarLinha}
					tema={tema}
					carregando={carregando}
				/>

				<footer
					className={`py-4 mt-auto text-center text-[10px] uppercase tracking-widest font-black transition-colors ${tema === "light" ? "text-slate-400/80" : "text-slate-600/50"}`}
				>
					SABINO CGE - SETOR FISCAL
				</footer>
			</div>
		</div>
	);
}
