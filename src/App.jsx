import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Importando as nossas páginas
import { Login } from "./pages/Login";
import { Hub } from "./pages/Hub";
import { Fiscal } from "./pages/Fiscal";
import { Empresas } from "./pages/Empresas";
import { TI } from "./pages/TI";
import { Calendario } from "./pages/Calendario";
import { Recebimentos } from "./pages/Recebimentos";
import { SalaReuniao } from "./pages/SalaReuniao";

// --- CONFIGURAÇÃO DE ACESSOS ---
const ADMINS_TI = ["Bruno M"];

const RotaProtegida = ({ children }) => {
	const usuarioLogado = localStorage.getItem("usuarioLogado");
	if (!usuarioLogado) return <Navigate to="/login" replace />;
	return children;
};

// Componente de Loading de fallback
const TelaCarregamento = () => (
	<div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
		<div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
	</div>
);

export default function App() {
	const [tema, setTema] = useState(
		() => localStorage.getItem("temaSistema") || "light",
	);
	const [notificacaoTI, setNotificacaoTI] = useState(null);

	const notificacaoTitulo = notificacaoTI
		? notificacaoTI.tipo === "status"
			? notificacaoTI.status === "Em Andamento"
				? "Chamado em andamento"
				: "Chamado concluído"
			: "Novo Chamado de T.I"
		: "";

	// Motor de Temas
	useEffect(() => {
		const htmlTag = document.documentElement;
		htmlTag.classList.remove("light", "dark", "black");
		htmlTag.classList.add(tema);
		if (tema === "dark" || tema === "black") htmlTag.classList.add("dark");
		localStorage.setItem("temaSistema", tema);
	}, [tema]);

	// Radar Global de Chamados
	useEffect(() => {
		const usuarioAtual = localStorage.getItem("usuarioLogado");
		const canalChamados = supabase.channel("notificacoes-ti");

		if (ADMINS_TI.includes(usuarioAtual)) {
			canalChamados.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "chamados" },
				(payload) => {
					setNotificacaoTI({ ...payload.new, tipo: "novo" });
				},
			);
		}

		if (usuarioAtual) {
			canalChamados.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "chamados",
					filter: `solicitante=eq.${usuarioAtual}`,
				},
				(payload) => {
					const novoStatus = payload.new.status;
					if (novoStatus === "Em Andamento" || novoStatus === "Concluido") {
						setNotificacaoTI({ ...payload.new, tipo: "status" });
					}
				},
			);
		}

		const subscription = canalChamados.subscribe();

		return () => {
			supabase.removeChannel(canalChamados);
		};
	}, []);

	return (
		<BrowserRouter>
			{/* UI DA NOTIFICAÇÃO PUSH GLOBAL */}
			{notificacaoTI && (
				<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md animate-in slide-in-from-top duration-500">
					<div
						className={`rounded-2xl border-2 shadow-2xl overflow-hidden ${tema === "light" ? "bg-white border-blue-200" : "bg-slate-800 border-blue-500/50"}`}
					>
						<div
							className={`p-4 ${tema === "light" ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "bg-gradient-to-r from-blue-900/20 to-indigo-900/20"}`}
						>
							<div className="flex items-start gap-3">
								<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md animate-pulse">
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
											d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
										/>
									</svg>
								</div>
								<div className="flex-1 min-w-0">
									<span
										className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${tema === "light" ? "text-blue-600" : "text-blue-400"}`}
									>
										{notificacaoTitulo}
									</span>
									<p
										className={`text-sm font-medium leading-relaxed ${tema === "light" ? "text-slate-700" : "text-slate-300"}`}
									>
										{notificacaoTI.tipo === "status"
											? `Seu chamado "${notificacaoTI.motivo}" está ${notificacaoTI.status.toLowerCase()}.`
											: `${notificacaoTI.solicitante}: ${notificacaoTI.motivo}`}
									</p>
								</div>
								<div className="flex gap-1 flex-shrink-0">
									<button
										onClick={() => {
											setNotificacaoTI(null);
											window.location.href = "/ti";
										}}
										className="bg-blue-600 text-white text-[10px] font-black px-3 py-2 rounded-lg uppercase hover:bg-blue-700 transition-colors"
									>
										Ver Agora
									</button>
									<button
										onClick={() => setNotificacaoTI(null)}
										className={`p-1 rounded-full transition-colors ${tema === "light" ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100" : "text-slate-500 hover:text-slate-300 hover:bg-slate-700"}`}
										title="Fechar"
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
							</div>
						</div>
						<div
							className={`h-1 bg-gradient-to-r ${notificacaoTI.tipo === "status" ? (notificacaoTI.status === "Em Andamento" ? "from-amber-400 to-amber-500" : "from-sky-400 to-sky-500") : "from-blue-400 to-blue-500"} animate-pulse`}
						></div>
					</div>
				</div>
			)}

			{/* Suspense envolve as rotas para garantir que se algo falhar na renderização, mostre um loading */}
			<Suspense fallback={<TelaCarregamento />}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/hub"
						element={
							<RotaProtegida>
								<Hub tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route
						path="/fiscal"
						element={
							<RotaProtegida>
								<Fiscal tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route
						path="/empresas"
						element={
							<RotaProtegida>
								<Empresas tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route
						path="/ti"
						element={
							<RotaProtegida>
								<TI tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route
						path="/calendario"
						element={
							<RotaProtegida>
								<Calendario tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route
						path="/recebimentos"
						element={
							<RotaProtegida>
								<Recebimentos tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route
						path="/salaReuniao"
						element={
							<RotaProtegida>
								<SalaReuniao tema={tema} setTema={setTema} />
							</RotaProtegida>
						}
					/>
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
