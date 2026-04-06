import React, { useState, useEffect } from "react";

export function EmpresaModalInfo({ empresa, isOpen, onClose, tema }) {
	const [copiado, setCopiado] = useState(null);

	// Fechar com a tecla ESC
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen || !empresa) return null;

	const handleCopiar = (texto, id) => {
		navigator.clipboard.writeText(texto);
		setCopiado(id);
		setTimeout(() => setCopiado(null), 2000);
	};

	const estilos = {
		overlay: "bg-slate-900/40 backdrop-blur-sm",
		modal:
			tema === "light"
				? "bg-white/95 backdrop-blur-xl border-white/60 shadow-2xl shadow-blue-900/10"
				: tema === "dark"
					? "bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-black/50"
					: "bg-[#0a0a0a]/95 backdrop-blur-xl border-zinc-800/50 shadow-2xl shadow-black/50",
		texto: tema === "light" ? "text-slate-800" : "text-slate-100",
		textoSecundario: tema === "light" ? "text-slate-500" : "text-slate-400",

		// NOVO: Tom mais escuro e com alto contraste para os títulos dos cards
		tituloLabel:
			tema === "light"
				? "text-slate-700"
				: tema === "dark"
					? "text-slate-300"
					: "text-zinc-300",

		cardInfo:
			tema === "light"
				? "bg-slate-50/80 border-slate-200/60"
				: tema === "dark"
					? "bg-slate-800/50 border-slate-700/50"
					: "bg-[#111]/80 border-zinc-800/50",
		btnCopiar:
			tema === "light"
				? "text-blue-600 hover:bg-blue-50 active:bg-blue-100"
				: "text-blue-400 hover:bg-blue-900/30 active:bg-blue-900/50",
		btnCopiarSucesso:
			tema === "light"
				? "text-emerald-600 bg-emerald-50"
				: "text-emerald-400 bg-emerald-900/30",
		btnFechar:
			tema === "light"
				? "bg-slate-100 text-slate-700 hover:bg-slate-200"
				: tema === "dark"
					? "bg-slate-800 text-slate-300 hover:bg-slate-700"
					: "bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
	};

	const statusAtiva = empresa.active !== false; // Assume true se não definido
	const inicial = (empresa.sigla || empresa.nome || "E")
		.charAt(0)
		.toUpperCase();

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity ${estilos.overlay}`}
			onClick={onClose}
		>
			{/* Container do Modal */}
			<div
				className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2rem] border overflow-hidden ${estilos.modal}`}
				onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
			>
				{/* Cabeçalho do Modal */}
				<div
					className={`flex items-center justify-between p-6 md:p-8 border-b ${tema === "light" ? "border-slate-100" : "border-slate-800/50"}`}
				>
					<div className="flex items-center gap-4 min-w-0 pr-4">
						<div
							className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${tema === "light" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
						>
							{inicial}
						</div>
						<h2
							className={`text-xl md:text-2xl font-black truncate tracking-tight ${estilos.texto}`}
						>
							{empresa.nome}
						</h2>
					</div>

					<button
						onClick={onClose}
						className={`p-2 rounded-full shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${tema === "light" ? "hover:bg-slate-100 text-slate-400 hover:text-slate-600" : "hover:bg-slate-800 text-slate-500 hover:text-slate-300"}`}
						title="Fechar (ESC)"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Corpo do Modal (Scrollable) */}
				<div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Razão Social */}
						<div
							className={`p-5 rounded-2xl border relative group ${estilos.cardInfo}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className={`w-4 h-4 ${estilos.tituloLabel}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
									/>
								</svg>
								<span
									className={`text-[10px] font-black uppercase tracking-widest ${estilos.tituloLabel}`}
								>
									Nome Completo / Razão Social
								</span>
							</div>
							<p
								className={`font-semibold text-sm break-words pr-12 ${estilos.texto}`}
							>
								{empresa.nome}
							</p>
							<button
								onClick={() => handleCopiar(empresa.nome, "nome")}
								className={`absolute top-4 right-4 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-colors ${copiado === "nome" ? estilos.btnCopiarSucesso : estilos.btnCopiar}`}
							>
								{copiado === "nome" ? "Copiado!" : "Copiar"}
							</button>
						</div>

						{/* Sigla */}
						<div
							className={`p-5 rounded-2xl border relative group ${estilos.cardInfo}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className={`w-4 h-4 ${estilos.tituloLabel}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 6h.008v.008H6V6z"
									/>
								</svg>
								<span
									className={`text-[10px] font-black uppercase tracking-widest ${estilos.tituloLabel}`}
								>
									Sigla de Exibição
								</span>
							</div>
							<p
								className={`font-semibold text-sm break-words pr-12 ${estilos.texto}`}
							>
								{empresa.sigla || "N/A"}
							</p>
							{empresa.sigla && (
								<button
									onClick={() => handleCopiar(empresa.sigla, "sigla")}
									className={`absolute top-4 right-4 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-colors ${copiado === "sigla" ? estilos.btnCopiarSucesso : estilos.btnCopiar}`}
								>
									{copiado === "sigla" ? "Copiado!" : "Copiar"}
								</button>
							)}
						</div>

						{/* CNPJ */}
						<div
							className={`p-5 rounded-2xl border relative group ${estilos.cardInfo}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className={`w-4 h-4 ${estilos.tituloLabel}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
									/>
								</svg>
								<span
									className={`text-[10px] font-black uppercase tracking-widest ${estilos.tituloLabel}`}
								>
									CNPJ Oficial
								</span>
							</div>
							<p
								className={`font-semibold text-sm break-words pr-12 text-blue-500`}
							>
								{empresa.cnpj || "Não informado"}
							</p>
							{empresa.cnpj && (
								<button
									onClick={() => handleCopiar(empresa.cnpj, "cnpj")}
									className={`absolute top-4 right-4 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-colors ${copiado === "cnpj" ? estilos.btnCopiarSucesso : estilos.btnCopiar}`}
								>
									{copiado === "cnpj" ? "Copiado!" : "Copiar"}
								</button>
							)}
						</div>

						{/* Grupo Tributário */}
						<div className={`p-5 rounded-2xl border ${estilos.cardInfo}`}>
							<div className="flex items-center gap-2 mb-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className={`w-4 h-4 ${estilos.tituloLabel}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
									/>
								</svg>
								<span
									className={`text-[10px] font-black uppercase tracking-widest ${estilos.tituloLabel}`}
								>
									Grupo / Regime Tributário
								</span>
							</div>
							{empresa.grupoNome ? (
								<span
									className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border ${tema === "light" ? "bg-slate-200/50 border-slate-300 text-slate-700" : "bg-slate-800 border-slate-600 text-slate-300"}`}
								>
									{empresa.grupoNome}
								</span>
							) : (
								<span
									className={`font-semibold text-sm ${estilos.textoSecundario}`}
								>
									Não classificado
								</span>
							)}
						</div>

						{/* Diretório da Rede (Ocupa as duas colunas em telas médias) */}
						<div
							className={`md:col-span-2 p-5 rounded-2xl border relative group ${estilos.cardInfo}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className={`w-4 h-4 ${estilos.tituloLabel}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
									/>
								</svg>
								<span
									className={`text-[10px] font-black uppercase tracking-widest ${estilos.tituloLabel}`}
								>
									Caminho do Diretório (Rede)
								</span>
							</div>
							<p
								className={`font-mono text-xs sm:text-sm break-all pr-12 ${estilos.texto}`}
							>
								{empresa.pasta || "Diretório não configurado"}
							</p>
							{empresa.pasta && (
								<button
									onClick={() => handleCopiar(empresa.pasta, "pasta")}
									className={`absolute top-4 right-4 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-colors ${copiado === "pasta" ? estilos.btnCopiarSucesso : estilos.btnCopiar}`}
								>
									{copiado === "pasta" ? "Copiado!" : "Copiar"}
								</button>
							)}
						</div>

						{/* Status (Ocupa as duas colunas em telas médias) */}
						<div
							className={`md:col-span-2 p-5 rounded-2xl border flex flex-col justify-center ${estilos.cardInfo}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className={`w-4 h-4 ${estilos.tituloLabel}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
									/>
								</svg>
								<span
									className={`text-[10px] font-black uppercase tracking-widest ${estilos.tituloLabel}`}
								>
									Status Atual no Sistema
								</span>
							</div>
							<div className="flex items-center gap-2 mt-1">
								<div className="relative flex h-3 w-3 items-center justify-center">
									{statusAtiva && (
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
									)}
									<span
										className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusAtiva ? "bg-emerald-500" : "bg-rose-500"}`}
									></span>
								</div>
								<span
									className={`font-bold text-sm ${statusAtiva ? "text-emerald-500" : "text-rose-500"}`}
								>
									{statusAtiva ? "Empresa Ativa e Operante" : "Empresa Inativa"}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Rodapé */}
				<div
					className={`p-4 md:px-8 md:py-5 border-t flex justify-end ${tema === "light" ? "border-slate-100 bg-slate-50/50" : "border-slate-800/50 bg-slate-900/30"}`}
				>
					<button
						onClick={onClose}
						className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 ${estilos.btnFechar}`}
					>
						Fechar Janela
					</button>
				</div>
			</div>
		</div>
	);
}
