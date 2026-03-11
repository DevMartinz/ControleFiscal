import { useState, useEffect } from "react";
import "./index.css";

function App() {
	const [usuarioLogado, setUsuarioLogado] = useState(
		() => localStorage.getItem("usuarioLogado") || null
	);
	const [filtro, setFiltro] = useState("");
	const [mostrarHistorico, setMostrarHistorico] = useState(false);
	const [inputLogin, setInputLogin] = useState("");
	const [inputSenha, setInputSenha] = useState("");
	const [erro, setErro] = useState("");

	// --- ESTADO DA NOTIFICAÇÃO ---
	const [notificacao, setNotificacao] = useState(null);

	// --- CONFIGURAÇÕES DE PERÍODO (Filtro Avançado) ---
	const dataAtual = new Date();
	const [periodo, setPeriodo] = useState({
		ano: dataAtual.getFullYear().toString(),
		mes: String(dataAtual.getMonth() + 1).padStart(2, "0"),
	});

	const anosDisponiveis = ["2025", "2026", "2027"];
	const mesesDisponiveis = [
		{ val: "01", nome: "Janeiro" },
		{ val: "02", nome: "Fevereiro" },
		{ val: "03", nome: "Março" },
		{ val: "04", nome: "Abril" },
		{ val: "05", nome: "Maio" },
		{ val: "06", nome: "Junho" },
		{ val: "07", nome: "Julho" },
		{ val: "08", nome: "Agosto" },
		{ val: "09", nome: "Setembro" },
		{ val: "10", nome: "Outubro" },
		{ val: "11", nome: "Novembro" },
		{ val: "12", nome: "Dezembro" },
	];

	const usuariosPermitidos = [
		{ login: "Bruno", senha: "123", nome: "Bruno (T.I)" },
		{ login: "Pedro", senha: "123", nome: "Pedro (T.I)" },
		{ login: "George", senha: "123", nome: "George (Fiscal)" },
	];

	const categorias = [
		{ nome: "BAIXAR XML DE SAÍDA", filhas: ["NFE", "NFCE"] },
		{ nome: "IMPORTAR XML DE SAÍDA", filhas: ["NFE", "NFCE"] },
		{ nome: "QUEBRAS DE SEQUÊNCIA", filhas: ["NFE", "NFCE"] },
		{ nome: "VERIFICAR CANCELADAS", filhas: ["NFE", "NFCE"] },
		{ nome: "VERIFICAR QUANTIDADE", filhas: ["NFE", "NFCE"] },
		{ nome: "XML DAS NFE DE ENTRADA", filhas: ["Baixar", "Importar"] },
		{ nome: "FUNRURAL", filhas: ["Check"] },
		{ nome: "ENTRADA/SAÍDA", filhas: ["Check"] },
		{ nome: "MALHA", filhas: ["Check"] },
	];

	const totalTarefasRequeridas = categorias.reduce(
		(acc, cat) => acc + cat.filhas.length,
		0
	);

	const dadosIniciais = [
		{ id: 1, nome: "AFD", pasta: "E:/Arquivos/Sabino CGE", tarefas: {} },
		{ id: 2, nome: "AJC", pasta: "C:/Fiscal/0002-Goianinha", tarefas: {} },
		{ id: 3, nome: "ANH", pasta: "C:/Fiscal/0003-NovaCruz", tarefas: {} },
		{ id: 4, nome: "APM", pasta: "C:/Fiscal/0004-SPP", tarefas: {} },
		{ id: 5, nome: "ARL", pasta: "C:/Fiscal/0005-PassaFica", tarefas: {} },
		{ id: 6, nome: "ASL", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
		{ id: 7, nome: "AVM", pasta: "C:/Fiscal/0007-Touros", tarefas: {} },
		{ id: 8, nome: "BHG", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
		{ id: 9, nome: "BRP", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
		{ id: 10, nome: "CMA", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
	];

	const mesclarComDadosIniciais = (dadosSalvos) => {
		const salvosArray =
			typeof dadosSalvos === "string" ? JSON.parse(dadosSalvos) : dadosSalvos;
		return dadosIniciais.map((mestra) => {
			const empSalva = salvosArray?.find((e) => e.id === mestra.id);
			return empSalva
				? { ...empSalva, pasta: mestra.pasta, nome: mestra.nome }
				: { ...mestra, tarefas: {} };
		});
	};

	const [empresas, setEmpresas] = useState(() => {
		const key = `planilhaFiscalDados_${dataAtual.getFullYear()}_${String(
			dataAtual.getMonth() + 1
		).padStart(2, "0")}`;
		const salvos = localStorage.getItem(key);
		return salvos ? mesclarComDadosIniciais(salvos) : dadosIniciais;
	});

	const [historico, setHistorico] = useState(
		() => JSON.parse(localStorage.getItem("planilhaFiscalHistorico")) || []
	);

	const mudarPeriodo = (novoAno, novoMes) => {
		setPeriodo({ ano: novoAno, mes: novoMes });
		const key = `planilhaFiscalDados_${novoAno}_${novoMes}`;
		const salvos = localStorage.getItem(key);

		if (salvos) {
			setEmpresas(mesclarComDadosIniciais(salvos));
		} else {
			setEmpresas(dadosIniciais.map((d) => ({ ...d, tarefas: {} })));
		}
	};

	const atualizarTarefa = (empresaId, cat, sub, status) => {
		const dataLog = new Date().toLocaleString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
		const empNome = empresas.find((e) => e.id === empresaId)?.nome;
		const chave = `${cat}-${sub}`;

		// Gatilho da Notificação: Se for XML de Entrada e marcar como OK
		if (cat === "XML DAS NFE DE ENTRADA" && status === "OK") {
			setNotificacao({ id: empresaId, nome: empNome });
		}

		setHistorico((prev) => {
			const novoHist = [
				{
					id: Date.now(),
					usuario: usuarioLogado,
					acao: status,
					detalhe: `[${periodo.mes}/${periodo.ano}] ${sub} - ${empNome}`,
					data: dataLog,
					cor:
						status === "OK"
							? "text-green-600"
							: status === "NAO"
							? "text-red-600"
							: status === "Verificar"
							? "text-amber-600"
							: status === "Andamento"
							? "text-blue-600"
							: "text-slate-500",
				},
				...prev,
			].slice(0, 50);
			localStorage.setItem("planilhaFiscalHistorico", JSON.stringify(novoHist));
			return novoHist;
		});

		setEmpresas((prev) => {
			const novasEmpresas = prev.map((e) =>
				e.id === empresaId
					? {
							...e,
							tarefas: {
								...e.tarefas,
								[chave]: { status, user: usuarioLogado, data: dataLog },
							},
					  }
					: e
			);
			localStorage.setItem(
				`planilhaFiscalDados_${periodo.ano}_${periodo.mes}`,
				JSON.stringify(novasEmpresas)
			);
			return novasEmpresas;
		});
	};

	// --- FUNÇÃO PARA PROCESSAR O ACEITE DA NOTIFICAÇÃO ---
	const processarNotificacao = (aceitou) => {
		if (aceitou && notificacao) {
			const dataLog = new Date().toLocaleString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});

			setEmpresas((prev) => {
				const novasEmpresas = prev.map((e) => {
					if (e.id === notificacao.id) {
						// Atualiza em lote as 4 tarefas
						return {
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
						};
					}
					return e;
				});
				localStorage.setItem(
					`planilhaFiscalDados_${periodo.ano}_${periodo.mes}`,
					JSON.stringify(novasEmpresas)
				);
				return novasEmpresas;
			});
		}
		setNotificacao(null); // Fecha a notificação independentemente da escolha
	};

	const getCorStatus = (status) => {
		if (status === "OK") return "bg-green-100 border-green-500 text-green-700";
		if (status === "NAO") return "bg-red-100 border-red-500 text-red-700";
		if (status === "Verificar")
			return "bg-amber-100 border-amber-500 text-amber-700";
		if (status === "Andamento") return "bg-sky-100 border-sky-500 text-sky-700";
		return "bg-white border-slate-200 text-slate-400";
	};

	const empresasFiltradas = empresas.filter((e) =>
		e.nome.toLowerCase().includes(filtro.toLowerCase())
	);

	if (!usuarioLogado) {
		return (
			<div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
				<div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
					<div className="bg-blue-900 p-6 text-center">
						<h1 className="text-2xl font-black text-white uppercase tracking-tight">
							Sistema <span className="text-blue-300">Fiscal</span>
						</h1>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const u = usuariosPermitidos.find(
								(u) => u.login === inputLogin && u.senha === inputSenha
							);
							if (u) {
								setUsuarioLogado(u.nome);
								localStorage.setItem("usuarioLogado", u.nome);
							} else setErro("Incorreto!");
						}}
						className="p-6 flex flex-col gap-4"
					>
						{erro && (
							<div className="text-red-600 text-center font-bold text-sm bg-red-50 p-2 border border-red-200 rounded">
								{erro}
							</div>
						)}
						<input
							type="text"
							placeholder="Usuário"
							value={inputLogin}
							onChange={(e) => setInputLogin(e.target.value)}
							className="p-3 border rounded outline-none focus:ring-1 focus:ring-blue-800"
						/>
						<input
							type="password"
							placeholder="Senha"
							value={inputSenha}
							onChange={(e) => setInputSenha(e.target.value)}
							className="p-3 border rounded outline-none focus:ring-1 focus:ring-blue-800"
						/>
						<button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded shadow-md transition-colors uppercase tracking-widest text-xs">
							Entrar
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 p-4 relative font-sans flex flex-col overflow-hidden">
			{/* --- RENDERIZAÇÃO DA NOTIFICAÇÃO (TOAST) --- */}
			{notificacao && (
				<div className="fixed bottom-6 right-6 bg-white border-l-4 border-blue-600 shadow-2xl rounded p-5 z-50 flex flex-col gap-3 max-w-sm animate-bounce-short">
					<div className="flex items-start gap-3">
						<div className="text-2xl">🔔</div>
						<p className="text-sm text-slate-700 font-medium leading-tight">
							O SPED de{" "}
							<strong className="text-blue-900">{notificacao.nome}</strong>{" "}
							acabou de ser feito.
							<br />
							Deseja Verificar quantidade e canceladas?
						</p>
					</div>
					<div className="flex justify-end gap-2 mt-1">
						<button
							onClick={() => processarNotificacao(false)}
							className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded transition-colors"
						>
							Recusar
						</button>
						<button
							onClick={() => processarNotificacao(true)}
							className="px-4 py-1.5 text-xs font-bold bg-blue-800 text-white hover:bg-blue-900 rounded shadow transition-colors"
						>
							Aceitar
						</button>
					</div>
				</div>
			)}

			{mostrarHistorico && (
				<div
					className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
					onClick={() => setMostrarHistorico(false)}
				/>
			)}

			<div
				className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
					mostrarHistorico ? "translate-x-0" : "translate-x-full"
				} flex flex-col`}
			>
				<div className="p-4 bg-blue-900 text-white flex justify-between items-center">
					<h2 className="font-bold uppercase text-xs tracking-widest">
						Histórico Recente
					</h2>
					<button
						onClick={() => setMostrarHistorico(false)}
						className="text-white/70 hover:text-white"
					>
						✕
					</button>
				</div>
				<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
					{historico.map((h) => (
						<div
							key={h.id}
							className="p-3 bg-white border border-slate-200 rounded text-sm shadow-sm"
						>
							<div className="flex justify-between font-bold text-[10px]">
								<span>{h.usuario}</span>
								<span className="text-slate-400">{h.data}</span>
							</div>
							<p className={`font-bold uppercase text-[11px] mt-1 ${h.cor}`}>
								{h.acao}
							</p>
							<p className="text-xs text-slate-500">{h.detalhe}</p>
						</div>
					))}
				</div>
				<button
					onClick={() => {
						setHistorico([]);
						localStorage.removeItem("planilhaFiscalHistorico");
					}}
					className="p-4 text-xs font-bold text-slate-400 hover:text-red-500 uppercase border-t border-slate-100 transition-colors"
				>
					Limpar Histórico
				</button>
			</div>

			<header className="max-w-[1800px] w-full mx-auto mb-6 flex flex-col lg:flex-row gap-4 justify-between lg:items-center border-b pb-4">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-lg uppercase">
						{usuarioLogado.charAt(0)}
					</div>
					<div>
						<h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
							Monitor Fiscal <span className="text-blue-800">v2.0</span>
						</h1>
						<p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
							Rio Grande do Norte • Auditoria
						</p>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row items-end lg:items-center gap-4 w-full lg:w-auto">
					<div className="flex items-center gap-2 bg-white p-1.5 border border-slate-200 rounded-lg shadow-sm">
						<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">
							Período:
						</span>
						<select
							value={periodo.mes}
							onChange={(e) => mudarPeriodo(periodo.ano, e.target.value)}
							className="p-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 cursor-pointer"
						>
							{mesesDisponiveis.map((m) => (
								<option key={m.val} value={m.val}>
									{m.nome}
								</option>
							))}
						</select>
						<select
							value={periodo.ano}
							onChange={(e) => mudarPeriodo(e.target.value, periodo.mes)}
							className="p-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 cursor-pointer"
						>
							{anosDisponiveis.map((a) => (
								<option key={a} value={a}>
									{a}
								</option>
							))}
						</select>
					</div>

					<input
						type="text"
						placeholder="🔍 Buscar empresa..."
						className="w-full lg:w-56 p-2 text-sm border rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-800 shadow-sm transition-all"
						value={filtro}
						onChange={(e) => setFiltro(e.target.value)}
					/>

					<div className="flex gap-4 items-center">
						<span className="text-[10px] text-slate-500 bg-white px-2 py-1 border rounded-full">
							Operador: <b className="text-blue-900">{usuarioLogado}</b>
						</span>
						<button
							onClick={() => setMostrarHistorico(true)}
							className="text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline uppercase"
						>
							Histórico
						</button>
						<button
							onClick={() => {
								setUsuarioLogado(null);
								localStorage.removeItem("usuarioLogado");
							}}
							className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline uppercase"
						>
							Sair
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-[1800px] w-full mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl flex-1">
				<div className="bg-slate-100/50 border-b border-slate-200 p-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
					Exibindo auditoria referente a:{" "}
					<span className="text-blue-800">
						{mesesDisponiveis.find((m) => m.val === periodo.mes)?.nome} de{" "}
						{periodo.ano}
					</span>
				</div>

				<div className="overflow-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-300">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-blue-800 text-white text-[10px] uppercase tracking-wider sticky top-0 z-40 h-[34px]">
								<th
									rowSpan="2"
									className="p-3 text-left font-bold border-r border-b border-blue-700/50 bg-blue-800 text-white sticky left-0 top-0 z-50 w-[170px]"
								>
									EMPRESAS
								</th>
								{categorias.map((cat) => (
									<th
										key={cat.nome}
										colSpan={cat.filhas.length}
										className="p-1 text-center border-r border-b border-blue-700/50"
									>
										{cat.nome}
									</th>
								))}
							</tr>
							<tr className="bg-gray-200 text-black text-[9px] uppercase font-bold border-b border-blue-800 sticky top-[34px] z-40">
								{categorias.map((cat) =>
									cat.filhas.map((f) => (
										<th
											key={`${cat.nome}-${f}`}
											className="p-1 border-r border-blue-600/50 bg-gray-200"
										>
											{f}
										</th>
									))
								)}
							</tr>
						</thead>
						<tbody>
							{empresasFiltradas.length === 0 ? (
								<tr>
									<td
										colSpan={totalTarefasRequeridas + 1}
										className="p-8 text-center text-slate-500 font-medium"
									>
										Nenhuma empresa encontrada com a busca "{filtro}"
									</td>
								</tr>
							) : (
								empresasFiltradas.map((emp) => {
									let tarefasOkCount = 0;
									categorias.forEach((cat) =>
										cat.filhas.forEach((sub) => {
											if (emp.tarefas[`${cat.nome}-${sub}`]?.status === "OK")
												tarefasOkCount++;
										})
									);

									const isCompleta = tarefasOkCount === totalTarefasRequeridas;
									const progresso = Math.round(
										(tarefasOkCount / totalTarefasRequeridas) * 100
									);

									return (
										<tr
											key={emp.id}
											className={`border-b transition-all duration-300 group ${
												isCompleta
													? "bg-green-50 hover:bg-green-100 border-green-200"
													: "border-slate-100 hover:bg-blue-50/50"
											}`}
										>
											<td
												className={`p-2 font-bold text-slate-700 border-r border-slate-200 sticky left-0 z-20 text-[10px] shadow-sm transition-colors duration-300 ${
													isCompleta
														? "bg-green-50 group-hover:bg-green-100"
														: "bg-white group-hover:bg-blue-50/50"
												}`}
											>
												<div className="flex items-center justify-between gap-2 w-full">
													<div className="flex flex-col w-full gap-1 overflow-hidden">
														<span
															className="truncate flex-1 uppercase tracking-tight flex items-center gap-1.5"
															title={emp.nome}
														>
															{isCompleta && (
																<span
																	className="text-green-600 text-sm leading-none"
																	title="100% Concluído"
																>
																	✔
																</span>
															)}
															{emp.nome}
														</span>
														<div
															className="w-full bg-slate-200 rounded-full h-1 mt-0.5"
															title={`${progresso}% Concluído`}
														>
															<div
																className={`h-1 rounded-full transition-all duration-500 ${
																	isCompleta ? "bg-green-500" : "bg-blue-500"
																}`}
																style={{ width: `${progresso}%` }}
															></div>
														</div>
													</div>

													<div
														title={`Pasta: ${emp.pasta || "Não configurada"}`}
														className={`flex-shrink-0 w-3.5 h-3.5 border rounded-full flex items-center justify-center text-[9px] font-serif italic cursor-help transition-all shadow-sm ${
															isCompleta
																? "border-green-300 text-green-600 bg-green-100 hover:bg-green-600 hover:text-white"
																: "border-blue-200 text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white"
														}`}
													>
														i
													</div>
												</div>
											</td>

											{categorias.map((cat) =>
												cat.filhas.map((sub) => {
													const info = emp.tarefas[`${cat.nome}-${sub}`] || {
														status: "Pendente",
													};
													return (
														<td
															key={`${cat.nome}-${sub}`}
															className={`p-2 border-r text-center min-w-[80px] ${
																isCompleta
																	? "border-green-100"
																	: "border-slate-100"
															}`}
														>
															<select
																value={info.status}
																onChange={(e) =>
																	atualizarTarefa(
																		emp.id,
																		cat.nome,
																		sub,
																		e.target.value
																	)
																}
																className={`w-full p-1 rounded text-[9px] font-bold border transition-all cursor-pointer outline-none focus:ring-1 focus:ring-blue-800 shadow-sm ${getCorStatus(
																	info.status
																)}`}
															>
																<option value="Pendente">---</option>
																<option value="OK">OK</option>
																<option value="NAO">NÃO</option>
																<option value="Verificar">VERIF</option>
																<option value="Andamento">ANDAM.</option>
															</select>
															{info.user && info.status !== "Pendente" && (
																<div className="mt-1 text-[7px] text-slate-400 leading-none font-bold uppercase">
																	<span
																		className={
																			isCompleta
																				? "text-green-700/60"
																				: "text-blue-900/60"
																		}
																	>
																		{info.user.split(" ")[0]}
																	</span>
																	<br />
																	{info.data}
																</div>
															)}
														</td>
													);
												})
											)}
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</main>
			<footer className="py-2 text-center text-[8px] text-slate-400 uppercase tracking-widest font-bold">
				SABINO CGE - @DevMartinz
			</footer>
		</div>
	);
}

export default App;
