import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Header } from "../components/Header";

// Base de dados fixa da estrutura horizontal
const DADOS_PLANILHA = {
	controleInfo: [
		{ uf: "PB", sigla: "ADI" },
		{ uf: "PB", sigla: "MSF 01" },
		{ uf: "PB", sigla: "MST" },
		{ uf: "RN", sigla: "AB&" },
		{ uf: "RN", sigla: "ABD" },
		{ uf: "RN", sigla: "ASL" },
		{ uf: "RN", sigla: "JEF" },
		{ uf: "RN", sigla: "JNN" },
		{ uf: "RN", sigla: "NCA" },
		{ uf: "RN", sigla: "PSL" },
		{ uf: "RN", sigla: "Q&F" },
		{ uf: "RN", sigla: "SDI" },
		{ uf: "RN", sigla: "SFL" },
		{ uf: "RN", sigla: "SSJ" },
		{ uf: "RN", sigla: "SSR" },
		{ uf: "RN", sigla: "NAP" },
		{ uf: "RN", sigla: "MIC" },
		{ uf: "RN", sigla: "FBO" },
		{ uf: "RN", sigla: "RCD" },
		{ uf: "-", sigla: "-" },
	],
	tecnoInfo: [
		{ uf: "PB", sigla: "HCB PB 01" },
		{ uf: "RN", sigla: "AFD" },
		{ uf: "RN", sigla: "AJC" },
		{ uf: "RN", sigla: "ARL" },
		{ uf: "RN", sigla: "CMA" },
		{ uf: "RN", sigla: "DOS" },
		{ uf: "RN", sigla: "FSS" },
		{ uf: "RN", sigla: "HCB RN" },
		{ uf: "RN", sigla: "JFM" },
		{ uf: "RN", sigla: "JNA" },
		{ uf: "RN", sigla: "JSC" },
		{ uf: "RN", sigla: "R&R" },
		{ uf: "RN", sigla: "S&S" },
		{ uf: "RN", sigla: "SCL" },
		{ uf: "RN", sigla: "SSC 01" },
		{ uf: "RN", sigla: "SSC 02" },
		{ uf: "RN", sigla: "SSL" },
		{ uf: "RN", sigla: "STL" },
		{ uf: "RN", sigla: "TTM" },
		{ uf: "-", sigla: "FAL" },
	],
	outrosSistemas: [
		{ rec: "Softcom - GMAIL", uf: "PB", sigla: "LAL" },
		{ rec: "Softcom - GMAIL", uf: "PB", sigla: "FAZ" },
		{ rec: "Edson - Whatsapp", uf: "PB", sigla: "SEL" },
		{ rec: "PrintSoft - Lucio", uf: "PB", sigla: "APL" },
		{ rec: "Yuri CPD", uf: "RN", sigla: "ANH" },
		{ rec: "Dayane - Site", uf: "RN", sigla: "FLC" },
		{ rec: "Dayane - Site", uf: "RN", sigla: "JBS" },
		{ rec: "Wesley - Site", uf: "RN", sigla: "MPB" },
		{ rec: "Maria CPD - Site", uf: "RN", sigla: "SUP" },
		{ rec: "ERP - GMAIL", uf: "RN", sigla: "PMO" },
		{ rec: "ERP - GMAIL", uf: "RN", sigla: "SML" },
		{ rec: "Dilana -Whatsapp", uf: "RN", sigla: "MSB" },
		{ rec: "Tony randal - GMAIL", uf: "RN", sigla: "NFM" },
		{ rec: "Dilana -Whatsapp", uf: "RN", sigla: "BRP" },
		{ rec: "Softcom - GMAIL", uf: "RN", sigla: "AVM" },
		{ rec: "Softcom - GMAIL", uf: "RN", sigla: "SMC" },
		{ rec: "VR sistemas - Ronaldo", uf: "RN", sigla: "EDL" },
		{ rec: "VR sistemas - Pedro H.", uf: "RN", sigla: "MGO" },
		{ rec: "-", uf: "RN", sigla: "VIP" },
		{ rec: "-", uf: "-", sigla: "-" },
	],
};

const normalizarStr = (str) => (str ? String(str).trim().toUpperCase() : "");

const formatarNomeUsuario = (nomeCompleto) => {
	if (!nomeCompleto) return "";
	const partes = nomeCompleto.trim().split(" ");
	if (partes.length === 1) return partes[0];
	return `${partes[0]} ${partes[1].charAt(0)}.`;
};

// --- CORES ORIGINAIS DE VOLTA E "EM ANDAMENTO" MANTIDO ---
const getCorStatus = (status, tema) => {
	if (tema === "light") {
		if (status === "OK")
			return "bg-green-100 text-green-800 hover:bg-green-200 border-transparent shadow-sm";
		if (status === "Em Andamento")
			return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent shadow-sm";
		return "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700 shadow-sm";
	} else {
		if (status === "OK")
			return "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/70 border-emerald-900/50 shadow-sm";
		if (status === "Em Andamento")
			return "bg-amber-900/50 text-amber-300 hover:bg-amber-800/70 border-amber-900/50 shadow-sm";
		return `bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700 hover:text-slate-300 shadow-sm`;
	}
};

const StatusSelect = ({ audit, onSalvar, tema }) => {
	const valor = audit?.status || "Pendente";
	const usuario = audit?.user?.login || audit?.usuarioLocal || "";

	// Lógica para formatar a data (pega do supabase ou a data local do momento do clique)
	let dataFormatada = "";
	if (audit?.created_at) {
		dataFormatada = new Date(audit.created_at).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
		});
	} else if (audit?.dataLocal) {
		dataFormatada = audit.dataLocal;
	}

	return (
		<div className="px-1 w-[80px] mx-auto flex flex-col items-center justify-center min-h-[34px]">
			<select
				value={valor}
				onChange={(e) =>
					onSalvar(e.target.value === "Pendente" ? "" : e.target.value)
				}
				className={`w-full py-[2px] px-0.5 rounded-md text-[8px] font-black border appearance-none cursor-pointer outline-none transition-all duration-200 text-center uppercase tracking-wide ${getCorStatus(valor, tema)}`}
			>
				<option
					value="Pendente"
					className={
						tema === "light"
							? "bg-white text-slate-800"
							: "bg-slate-800 text-slate-300"
					}
				>
					---
				</option>
				<option
					value="Em Andamento"
					className={
						tema === "light"
							? "bg-white text-amber-700 font-black"
							: "bg-amber-950 text-amber-400 font-black"
					}
				>
					Andamento
				</option>
				<option
					value="OK"
					className={
						tema === "light"
							? "bg-white text-emerald-700 font-black"
							: "bg-emerald-950 text-emerald-400 font-black"
					}
				>
					OK
				</option>
			</select>

			{/* Agora exibe nome e data tanto para OK quanto para Em Andamento */}
			{(valor === "OK" || valor === "Em Andamento") && usuario && (
				<div className="mt-[2px] text-[6px] leading-none font-bold uppercase truncate max-w-full text-center">
					<span
						className={tema === "light" ? "text-slate-500" : "text-slate-400"}
					>
						{formatarNomeUsuario(usuario)}{" "}
						{dataFormatada && `• ${dataFormatada}`}
					</span>
				</div>
			)}
		</div>
	);
};

export function Recebimentos({ tema, setTema }) {
	const navigate = useNavigate();
	const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";

	const dataAtual = new Date();
	const [periodo, setPeriodo] = useState({
		ano: dataAtual.getFullYear().toString(),
		mes: String(dataAtual.getMonth() + 1).padStart(2, "0"),
	});

	const [filtroTela, setFiltroTela] = useState("");
	const [filtroValido, setFiltroValido] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setFiltroValido(filtroTela);
		}, 300);
		return () => clearTimeout(timer);
	}, [filtroTela]);

	const [periodoIdBanco, setPeriodoIdBanco] = useState(null);
	const [empresasBanco, setEmpresasBanco] = useState([]);
	const [audits, setAudits] = useState([]);
	const [carregando, setCarregando] = useState(true);

	const [idsGlobais, setIdsGlobais] = useState({ xml: null, sped: null });

	const ciclarTema = () => {
		if (tema === "light") setTema("dark");
		else if (tema === "dark") setTema("black");
		else setTema("light");
	};

	const mudarPeriodo = (novoAno, novoMes) => {
		setPeriodo({ ano: novoAno, mes: novoMes });
	};

	useEffect(() => {
		const fetchBase = async () => {
			const { data: eData } = await supabase
				.from("enterprise")
				.select("id, sigla, name, cnpj, directory");
			if (eData) setEmpresasBanco(eData);

			const { data: actData } = await supabase
				.from("activity_type")
				.select("*");
			let xId = actData?.find(
				(a) =>
					normalizarStr(a.name).includes("XML") ||
					normalizarStr(a.subtype).includes("XML"),
			)?.id;
			let sId = actData?.find(
				(a) =>
					normalizarStr(a.name).includes("SPED") ||
					normalizarStr(a.subtype).includes("SPED"),
			)?.id;

			if (!xId) {
				const { data: nX } = await supabase
					.from("activity_type")
					.insert([{ name: "RECEBIMENTOS", subtype: "XML" }])
					.select("id");
				xId = nX?.[0]?.id;
			}
			if (!sId) {
				const { data: nS } = await supabase
					.from("activity_type")
					.insert([{ name: "RECEBIMENTOS", subtype: "SPED" }])
					.select("id");
				sId = nS?.[0]?.id;
			}

			setIdsGlobais({ xml: xId, sped: sId });
		};
		fetchBase();
	}, []);

	useEffect(() => {
		if (!idsGlobais.xml || !idsGlobais.sped) return;
		let isMounted = true;

		const carregarAuditoriasDoPeriodo = async () => {
			setCarregando(true);
			setAudits([]);

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

			if (periodos && periodos.length > 0) {
				const idEncontrado = periodos[0].id;
				if (isMounted) setPeriodoIdBanco(idEncontrado);

				const { data: auditorias } = await supabase
					.from("audit")
					.select("*, user ( login )")
					.eq("id_period", idEncontrado)
					.in("id_activity_type", [idsGlobais.xml, idsGlobais.sped]);

				if (isMounted && auditorias) setAudits(auditorias);
			} else {
				if (isMounted) setPeriodoIdBanco(null);
			}

			if (isMounted) setCarregando(false);
		};

		carregarAuditoriasDoPeriodo();
		return () => {
			isMounted = false;
		};
	}, [periodo.ano, periodo.mes, idsGlobais]);

	const garantirPeriodoNoBanco = async () => {
		if (periodoIdBanco) return periodoIdBanco;
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

		const { data: novoPeriodo } = await supabase
			.from("period")
			.insert({ month: mesFormatado, year: periodo.ano })
			.select("id");

		if (novoPeriodo && novoPeriodo.length > 0) {
			setPeriodoIdBanco(novoPeriodo[0].id);
			return novoPeriodo[0].id;
		}
		return null;
	};

	const getAudit = (siglaEmpresa, idActivity) => {
		if (siglaEmpresa === "-") return null;
		const emp = empresasBanco.find(
			(e) => normalizarStr(e.sigla) === normalizarStr(siglaEmpresa),
		);
		if (!emp) return null;
		return audits.find(
			(a) => a.id_enterprise === emp.id && a.id_activity_type === idActivity,
		);
	};

	const salvarStatus = async (siglaEmpresa, idActivity, novoStatus) => {
		if (siglaEmpresa === "-") return;
		const emp = empresasBanco.find(
			(e) => normalizarStr(e.sigla) === normalizarStr(siglaEmpresa),
		);
		if (!emp) {
			alert(`Empresa [${siglaEmpresa}] não encontrada no Banco de Dados!`);
			return;
		}

		const backupAudits = [...audits];
		const dataHoje = new Date().toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
		});

		setAudits((prev) => {
			const filtrado = prev.filter(
				(a) =>
					!(a.id_enterprise === emp.id && a.id_activity_type === idActivity),
			);
			if (!novoStatus) return filtrado;
			// Injeta dataLocal no momento para a tela reagir imediatamente
			return [
				...filtrado,
				{
					id: Date.now(),
					id_period: periodoIdBanco || 9999,
					id_enterprise: emp.id,
					id_activity_type: idActivity,
					status: novoStatus,
					usuarioLocal: usuarioLogado,
					dataLocal: dataHoje,
				},
			];
		});

		try {
			const currentPeriodId = await garantirPeriodoNoBanco();
			if (!currentPeriodId) throw new Error("Falha ao recuperar período");

			const auditExistente = getAudit(siglaEmpresa, idActivity);

			if (!novoStatus && auditExistente) {
				const { error } = await supabase
					.from("audit")
					.delete()
					.eq("id", auditExistente.id);
				if (error) throw error;
			} else if (novoStatus) {
				const { data: users } = await supabase
					.from("user")
					.select("id")
					.eq("login", usuarioLogado);
				const userId = users && users.length > 0 ? users[0].id : null;

				if (auditExistente) {
					const { error } = await supabase
						.from("audit")
						.update({ status: novoStatus, id_user: userId })
						.eq("id", auditExistente.id);
					if (error) throw error;
				} else {
					const { error } = await supabase
						.from("audit")
						.insert([
							{
								status: novoStatus,
								id_period: currentPeriodId,
								id_enterprise: emp.id,
								id_activity_type: idActivity,
								id_user: userId,
							},
						]);
					if (error) throw error;
				}
			}
		} catch (err) {
			console.error("Rollback: Falha ao salvar no Supabase", err);
			setAudits(backupAudits);
			alert("Erro de conexão ao salvar. Tente novamente.");
		}
	};

	const copiarParaAreaDeTransferencia = (texto, tipo) => {
		if (!texto) {
			alert(`Essa empresa não possui ${tipo} cadastrado.`);
			return;
		}
		navigator.clipboard.writeText(texto);
	};

	// --- MÁGICA DO WHATSAPP (Design Clean + Inteligência Em Andamento) ---
	const exportarRelacao = () => {
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
		const mesNome = nomesDosMeses[parseInt(periodo.mes, 10)];
		let textoGerado = `*Pendências de Arquivos - ${mesNome}/${periodo.ano}* 📁\n\n`;
		let temPendencia = false;

		const extrairPendencias = (nomeDoGrupo, lista) => {
			let textoGrupo = "";
			lista.forEach((row) => {
				if (!row.sigla || row.sigla === "-" || row.sigla === "FAL") return;

				const auditXml = getAudit(row.sigla, idsGlobais.xml);
				const auditSped = getAudit(row.sigla, idsGlobais.sped);

				const faltaXml = !auditXml || auditXml.status !== "OK";
				const faltaSped = !auditSped || auditSped.status !== "OK";

				if (faltaXml || faltaSped) {
					let pendencias = [];

					if (faltaXml) {
						pendencias.push(
							auditXml?.status === "Em Andamento" ? "XML (Andamento)" : "XML",
						);
					}
					if (faltaSped) {
						pendencias.push(
							auditSped?.status === "Em Andamento"
								? "SPED (Andamento)"
								: "SPED",
						);
					}

					textoGrupo += `▪ ${row.sigla}: ${pendencias.join(" e ")}\n`;
					temPendencia = true;
				}
			});

			if (textoGrupo) {
				textoGerado += `*${nomeDoGrupo}*\n${textoGrupo}\n`;
			}
		};

		extrairPendencias("Controle Info", DADOS_PLANILHA.controleInfo);
		extrairPendencias("Tecnoinfo", DADOS_PLANILHA.tecnoInfo);
		extrairPendencias("Outros Sistemas", DADOS_PLANILHA.outrosSistemas);

		if (!temPendencia) {
			textoGerado += "Todas as empresas enviaram os arquivos! ✅";
		}

		navigator.clipboard.writeText(textoGerado);
		alert("Relatório copiado! Pronto para colar no WhatsApp.");
	};

	const termo = filtroValido.trim().toLowerCase();

	const matchFiltro = (item) => {
		if (!termo) return true;
		if (
			item.sigla &&
			item.sigla !== "-" &&
			item.sigla.toLowerCase().includes(termo)
		)
			return true;
		if (item.uf && item.uf !== "-" && item.uf.toLowerCase().includes(termo))
			return true;
		if (item.rec && item.rec !== "-" && item.rec.toLowerCase().includes(termo))
			return true;

		const empBanco = empresasBanco.find(
			(e) => normalizarStr(e.sigla) === normalizarStr(item.sigla),
		);
		if (
			empBanco &&
			empBanco.name &&
			empBanco.name.toLowerCase().includes(termo)
		)
			return true;

		return false;
	};

	const listaControle = DADOS_PLANILHA.controleInfo.filter(matchFiltro);
	const listaTecno = DADOS_PLANILHA.tecnoInfo.filter(matchFiltro);
	const listaOutros = DADOS_PLANILHA.outrosSistemas.filter(matchFiltro);

	const numLinhas = Math.max(
		listaControle.length,
		listaTecno.length,
		listaOutros.length,
	);
	const linhasArray = Array.from({ length: numLinhas }, (_, i) => i);

	const isLight = tema === "light";
	const isDark = tema === "dark";

	const estilosFundoBase = {
		light: "bg-gradient-to-br from-slate-50 to-slate-200",
		dark: "bg-gradient-to-br from-slate-800 to-slate-900",
		black: "bg-gradient-to-br from-[#111] to-black",
	};
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
	const subCabecalhoEstilos = {
		light: "bg-slate-100 text-slate-600 border-b-slate-200",
		dark: "bg-slate-800 text-slate-400 border-b-slate-700",
		black: "bg-[#0a0a0a] text-zinc-500 border-b-zinc-800",
	};

	const borderLinha = isLight
		? "border-slate-100"
		: isDark
			? "border-slate-700/50"
			: "border-zinc-800/50";
	const corFundoLinha = isLight
		? "bg-white"
		: isDark
			? "bg-slate-800"
			: "bg-[#0a0a0a]";
	const corHoverLinha = isLight
		? "hover:bg-slate-50"
		: isDark
			? "hover:bg-slate-700/50"
			: "hover:bg-zinc-800/50";
	const divisorColunas = isLight
		? "border-r border-slate-200"
		: "border-r border-slate-700/50";

	// --- ÍCONES DE CÓPIA MINIMALISTAS ---
	const renderEmpresaInfo = (sigla) => {
		if (!sigla || sigla === "-" || sigla === "FAL")
			return <span className="text-slate-300 dark:text-slate-600">-</span>;
		const empBanco = empresasBanco.find(
			(e) => normalizarStr(e.sigla) === normalizarStr(sigla),
		);
		const nomeCompleto = empBanco ? empBanco.name : "";

		return (
			<div
				className="flex flex-col justify-center gap-[1px] w-full group/empresa"
				title={nomeCompleto}
			>
				<span
					className={`font-black text-[10px] tracking-tight uppercase leading-none transition-colors ${isLight ? "text-slate-800 group-hover:text-blue-700" : "text-slate-100 group-hover:text-blue-400"}`}
				>
					{sigla}
				</span>
				{nomeCompleto && (
					<span
						className={`text-[8px] font-semibold truncate leading-none ${isLight ? "text-slate-500" : "text-slate-400"}`}
					>
						{nomeCompleto}
					</span>
				)}

				{/* Container limpo de botões de cópia visíveis no hover */}
				{empBanco && (
					<div className="flex gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<button
							onClick={(e) => {
								e.stopPropagation();
								copiarParaAreaDeTransferencia(empBanco.cnpj, "CNPJ");
							}}
							className={`transition-colors p-[1px] ${isLight ? "text-slate-400 hover:text-blue-600" : "text-slate-500 hover:text-blue-400"}`}
							title="Copiar CNPJ"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2.5}
								stroke="currentColor"
								className="w-3.5 h-3.5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
								/>
							</svg>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								copiarParaAreaDeTransferencia(empBanco.directory, "Diretório");
							}}
							className={`transition-colors p-[1px] ${isLight ? "text-slate-400 hover:text-indigo-600" : "text-slate-500 hover:text-indigo-400"}`}
							title="Copiar Diretório"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2.5}
								stroke="currentColor"
								className="w-3.5 h-3.5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
								/>
							</svg>
						</button>
					</div>
				)}
			</div>
		);
	};

	const renderBadgeUF = (uf) => {
		if (!uf || uf === "-")
			return <span className="text-slate-300 dark:text-slate-600">-</span>;
		return (
			<span
				className={`px-1.5 py-[2px] rounded text-[8px] font-black ${isLight ? "bg-slate-200/50 text-slate-600" : "bg-slate-700/50 text-slate-300"}`}
			>
				{uf}
			</span>
		);
	};

	const renderSistema = (rec) => {
		if (!rec || rec === "-")
			return <span className="text-slate-300 dark:text-slate-600">-</span>;
		return (
			<div className="flex items-center gap-1.5">
				<div
					className={`w-1 h-2 rounded-full ${isLight ? "bg-slate-300" : "bg-slate-600"}`}
				></div>
				<span
					className={`text-[9px] font-bold truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}
				>
					{rec}
				</span>
			</div>
		);
	};

	return (
		<div
			className={`min-h-screen ${estilosFundoBase[tema]} transition-colors duration-500 p-4 pt-6 relative font-sans flex flex-col overflow-hidden`}
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
				<div
					className={`absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[130px] opacity-50 transition-colors duration-500 ${tema === "light" ? "bg-blue-200" : tema === "dark" ? "bg-blue-900/30" : "bg-blue-900/10"}`}
				></div>
				<div
					className={`absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-60 transition-colors duration-500 ${tema === "light" ? "bg-indigo-100" : tema === "dark" ? "bg-indigo-900/20" : "bg-zinc-900/40"}`}
				></div>
			</div>

			<div className="relative z-10 flex flex-col flex-1 w-full max-w-[1920px] mx-auto">
				<Header
					usuarioLogado={usuarioLogado}
					periodo={periodo}
					mudarPeriodo={mudarPeriodo}
					filtro={filtroTela}
					setFiltro={setFiltroTela}
					onLogout={() => {
						localStorage.removeItem("usuarioLogado");
						navigate("/login");
					}}
					tema={tema}
					onCiclarTema={ciclarTema}
					iconeEsquerda={
						<button
							onClick={() => navigate("/hub")}
							className={`p-2.5 rounded-xl transition-all duration-300 ${isLight ? "hover:bg-slate-100 text-slate-500 hover:text-blue-600" : isDark ? "hover:bg-slate-800 text-slate-400 hover:text-blue-400" : "hover:bg-zinc-900 text-zinc-400 hover:text-blue-500"}`}
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

				<main
					className={`mt-4 max-w-[1920px] w-full h-[calc(100vh-90px)] mx-auto overflow-hidden rounded-2xl border flex flex-col transition-colors duration-300 ${containerEstilos[tema]}`}
				>
					{/* BARRA DE AÇÕES - BOTÃO DO WHATSAPP OFICIAL */}
					<div
						className={`px-4 py-2 flex justify-end items-center border-b ${isLight ? "border-slate-200 bg-white" : "border-slate-700/50 bg-slate-800"}`}
					>
						<button
							onClick={exportarRelacao}
							className={`flex items-center gap-2 px-4 py-[6px] rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all duration-300 shadow-sm text-white ${isLight ? "bg-[#25D366] hover:bg-[#20bd5a]" : "bg-[#1da851] hover:bg-[#188c43]"}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c.003-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
							</svg>
							Exportar Relação
						</button>
					</div>

					<div className="overflow-auto flex-1 w-full bg-inherit scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 rounded-b-2xl">
						<table className="w-max min-w-full border-collapse relative bg-inherit text-left">
							<thead>
								<tr
									className={`text-[11px] uppercase tracking-wider sticky top-0 z-50 h-[34px] transition-colors ${cabecalhoPrincipalEstilos[tema]}`}
								>
									<th
										colSpan={13}
										className={`px-4 py-1 font-black border-b ${isLight ? "border-blue-700" : "border-slate-700/50"} outline outline-1 outline-inherit`}
									>
										Controle de Recebimento de Arquivos - XML & SPED
									</th>
								</tr>

								<tr
									className={`text-[10px] uppercase tracking-wider sticky top-[34px] z-40 h-[34px] transition-colors ${cabecalhoPrincipalEstilos[tema]}`}
								>
									<th
										colSpan={4}
										className={`px-2 py-1 text-center font-black border-b border-r ${isLight ? "border-blue-700" : "border-slate-700/50"} outline outline-1 outline-inherit`}
									>
										CONTROLE INFO
									</th>
									<th
										colSpan={4}
										className={`px-2 py-1 text-center font-black border-b border-r ${isLight ? "border-blue-700" : "border-slate-700/50"} outline outline-1 outline-inherit`}
									>
										TECNOINFO
									</th>
									<th
										colSpan={5}
										className={`px-2 py-1 text-center font-black border-b ${isLight ? "border-blue-700" : "border-slate-700/50"} outline outline-1 outline-inherit`}
									>
										OUTROS SISTEMAS
									</th>
								</tr>

								<tr
									className={`text-[8px] font-bold uppercase sticky top-[68px] z-30 transition-colors border-b ${subCabecalhoEstilos[tema]}`}
								>
									{/* Controle Info */}
									<th className={`py-1 w-[40px] text-center ${divisorColunas}`}>
										UF
									</th>
									<th className={`py-1 px-3 w-[160px] ${divisorColunas}`}>
										EMPRESA
									</th>
									<th
										className={`py-1 w-[80px] text-center text-blue-500 ${divisorColunas}`}
									>
										XML
									</th>
									<th
										className={`py-1 w-[80px] text-center text-purple-500 ${divisorColunas}`}
									>
										SPED
									</th>

									{/* Tecnoinfo */}
									<th className={`py-1 w-[40px] text-center ${divisorColunas}`}>
										UF
									</th>
									<th className={`py-1 px-3 w-[160px] ${divisorColunas}`}>
										EMPRESA
									</th>
									<th
										className={`py-1 w-[80px] text-center text-blue-500 ${divisorColunas}`}
									>
										XML
									</th>
									<th
										className={`py-1 w-[80px] text-center text-purple-500 ${divisorColunas}`}
									>
										SPED
									</th>

									{/* Outros Sistemas */}
									<th className={`py-1 px-3 w-[180px] ${divisorColunas}`}>
										SISTEMA
									</th>
									<th className={`py-1 w-[40px] text-center ${divisorColunas}`}>
										UF
									</th>
									<th className={`py-1 px-3 w-[160px] ${divisorColunas}`}>
										EMPRESA
									</th>
									<th
										className={`py-1 w-[80px] text-center text-blue-500 ${divisorColunas}`}
									>
										XML
									</th>
									<th className={`py-1 w-[80px] text-center text-purple-500`}>
										SPED
									</th>
								</tr>
							</thead>

							<tbody>
								{carregando ? (
									Array.from({ length: 15 }).map((_, i) => (
										<tr
											key={`skeleton-${i}`}
											className={`border-b ${borderLinha} animate-pulse ${corFundoLinha}`}
										>
											<td className={`p-2 text-center ${divisorColunas}`}>
												<div
													className={`h-3 w-4 mx-auto rounded ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2 px-3 ${divisorColunas}`}>
												<div
													className={`h-3 w-16 rounded mb-1 ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
												<div
													className={`h-2 w-24 rounded ${isLight ? "bg-slate-100" : "bg-slate-600"}`}
												></div>
											</td>
											<td className={`p-2 ${divisorColunas}`}>
												<div
													className={`h-4 w-12 mx-auto rounded-md ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2 ${divisorColunas}`}>
												<div
													className={`h-4 w-12 mx-auto rounded-md ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>

											<td className={`p-2 text-center ${divisorColunas}`}>
												<div
													className={`h-3 w-4 mx-auto rounded ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2 px-3 ${divisorColunas}`}>
												<div
													className={`h-3 w-16 rounded mb-1 ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
												<div
													className={`h-2 w-24 rounded ${isLight ? "bg-slate-100" : "bg-slate-600"}`}
												></div>
											</td>
											<td className={`p-2 ${divisorColunas}`}>
												<div
													className={`h-4 w-12 mx-auto rounded-md ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2 ${divisorColunas}`}>
												<div
													className={`h-4 w-12 mx-auto rounded-md ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>

											<td className={`p-2 px-3 ${divisorColunas}`}>
												<div
													className={`h-3 w-20 rounded ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2 text-center ${divisorColunas}`}>
												<div
													className={`h-3 w-4 mx-auto rounded ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2 px-3 ${divisorColunas}`}>
												<div
													className={`h-3 w-16 rounded mb-1 ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
												<div
													className={`h-2 w-24 rounded ${isLight ? "bg-slate-100" : "bg-slate-600"}`}
												></div>
											</td>
											<td className={`p-2 ${divisorColunas}`}>
												<div
													className={`h-4 w-12 mx-auto rounded-md ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
											<td className={`p-2`}>
												<div
													className={`h-4 w-12 mx-auto rounded-md ${isLight ? "bg-slate-200" : "bg-slate-700"}`}
												></div>
											</td>
										</tr>
									))
								) : numLinhas === 0 ? (
									<tr>
										<td
											colSpan={13}
											className="p-8 text-center text-slate-500 font-medium"
										>
											Nenhum resultado encontrado para "{filtroValido}"
										</td>
									</tr>
								) : (
									linhasArray.map((idx) => {
										const row1 = listaControle[idx] || { uf: "-", sigla: "-" };
										const row2 = listaTecno[idx] || { uf: "-", sigla: "-" };
										const row3 = listaOutros[idx] || {
											rec: "-",
											uf: "-",
											sigla: "-",
										};
										const tdRightBorder = `py-1 border-b ${borderLinha} ${divisorColunas} align-middle`;

										return (
											<tr
												key={idx}
												className={`group transition-colors duration-150 ${corFundoLinha} ${corHoverLinha}`}
											>
												{/* --- CONTROLE INFO --- */}
												<td className={`${tdRightBorder} text-center`}>
													{renderBadgeUF(row1.uf)}
												</td>
												<td className={`${tdRightBorder} px-3`}>
													{renderEmpresaInfo(row1.sigla)}
												</td>
												<td className={`${tdRightBorder} px-0`}>
													{row1.sigla && row1.sigla !== "-" && (
														<StatusSelect
															audit={getAudit(row1.sigla, idsGlobais.xml)}
															onSalvar={(v) =>
																salvarStatus(row1.sigla, idsGlobais.xml, v)
															}
															tema={tema}
														/>
													)}
												</td>
												<td className={`${tdRightBorder} px-0`}>
													{row1.sigla && row1.sigla !== "-" && (
														<StatusSelect
															audit={getAudit(row1.sigla, idsGlobais.sped)}
															onSalvar={(v) =>
																salvarStatus(row1.sigla, idsGlobais.sped, v)
															}
															tema={tema}
														/>
													)}
												</td>

												{/* --- TECNOINFO --- */}
												<td className={`${tdRightBorder} text-center`}>
													{renderBadgeUF(row2.uf)}
												</td>
												<td className={`${tdRightBorder} px-3`}>
													{renderEmpresaInfo(row2.sigla)}
												</td>
												<td className={`${tdRightBorder} px-0`}>
													{row2.sigla &&
														row2.sigla !== "FAL" &&
														row2.sigla !== "-" && (
															<StatusSelect
																audit={getAudit(row2.sigla, idsGlobais.xml)}
																onSalvar={(v) =>
																	salvarStatus(row2.sigla, idsGlobais.xml, v)
																}
																tema={tema}
															/>
														)}
												</td>
												<td className={`${tdRightBorder} px-0`}>
													{row2.sigla &&
														row2.sigla !== "FAL" &&
														row2.sigla !== "-" && (
															<StatusSelect
																audit={getAudit(row2.sigla, idsGlobais.sped)}
																onSalvar={(v) =>
																	salvarStatus(row2.sigla, idsGlobais.sped, v)
																}
																tema={tema}
															/>
														)}
												</td>

												{/* --- OUTROS SISTEMAS --- */}
												<td className={`${tdRightBorder} px-3`}>
													{renderSistema(row3.rec)}
												</td>
												<td className={`${tdRightBorder} text-center`}>
													{renderBadgeUF(row3.uf)}
												</td>
												<td className={`${tdRightBorder} px-3`}>
													{renderEmpresaInfo(row3.sigla)}
												</td>
												<td className={`${tdRightBorder} px-0`}>
													{row3.sigla && row3.sigla !== "-" && (
														<StatusSelect
															audit={getAudit(row3.sigla, idsGlobais.xml)}
															onSalvar={(v) =>
																salvarStatus(row3.sigla, idsGlobais.xml, v)
															}
															tema={tema}
														/>
													)}
												</td>
												<td
													className={`py-1 border-b ${borderLinha} px-0 text-center align-middle`}
												>
													{row3.sigla && row3.sigla !== "-" && (
														<StatusSelect
															audit={getAudit(row3.sigla, idsGlobais.sped)}
															onSalvar={(v) =>
																salvarStatus(row3.sigla, idsGlobais.sped, v)
															}
															tema={tema}
														/>
													)}
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</main>
			</div>
		</div>
	);
}
