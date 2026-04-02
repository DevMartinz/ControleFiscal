import React, { useEffect } from "react";

export function EmpresaModalInfo({ empresa, isOpen, onClose, tema }) {
	// Trava o scroll do fundo e permite fechar com a tecla ESC
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen || !empresa) return null;

	// DICIONÁRIOS DO TEMA PARA O MODAL (Versão com caixas)
	const modaisTema = {
		light: "bg-white border-slate-200 text-slate-800 shadow-2xl",
		dark: "bg-slate-800 border-slate-700 text-slate-100 shadow-[0_0_40px_rgba(0,0,0,0.5)]",
		black:
			"bg-zinc-950 border-zinc-800 text-slate-200 shadow-[0_0_40px_rgba(0,0,0,0.8)]",
	};

	const bgHeader = {
		light: "bg-slate-50 border-b border-slate-200",
		dark: "bg-slate-900/50 border-b border-slate-700",
		black: "bg-[#0a0a0a] border-b border-zinc-900",
	};

	const labelCor = {
		light: "text-slate-500",
		dark: "text-slate-400",
		black: "text-zinc-500",
	};

	const valueBg = {
		light: "bg-slate-100/50 border border-slate-200",
		dark: "bg-slate-900/50 border border-slate-700",
		black: "bg-black border border-zinc-800",
	};

	// Função para padronizar informações vazias
	const getValue = (val) => {
		if (val === null || val === undefined || val === "") {
			return <span className="italic opacity-50">Não informado na base</span>;
		}
		return val;
	};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
			{/* Fundo escuro desfocado (Backdrop) */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			></div>

			{/* Caixa do Modal */}
			<div
				className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col transform scale-100 animate-in zoom-in-95 duration-200 ${modaisTema[tema]} border`}
			>
				{/* Cabeçalho */}
				<div
					className={`px-6 py-4 flex items-center justify-between ${bgHeader[tema]}`}
				>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/20 shrink-0">
							<span className="text-white font-black text-lg">
								{empresa.sigla
									? empresa.sigla.charAt(0)
									: empresa.nome.charAt(0)}
							</span>
						</div>
						<div>
							{/* Removido o ID do sistema, deixando apenas o nome limpo e bonito */}
							<h2 className="text-lg font-black leading-tight tracking-tight">
								{empresa.nome}
							</h2>
						</div>
					</div>
					<button
						onClick={onClose}
						title="Fechar"
						className={`p-2 rounded-full hover:bg-rose-500 hover:text-white transition-colors shrink-0 ${labelCor[tema]}`}
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
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Corpo de Informações (As "Caixinhas" voltaram!) */}
				<div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 ${valueBg[tema]}`}
						>
							<span
								className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-3.5 h-3.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
									/>
								</svg>
								Nome Completo / Razão Social
							</span>
							<span className="font-medium text-sm">
								{getValue(empresa.name)}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 ${valueBg[tema]}`}
						>
							<span
								className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-3.5 h-3.5"
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
								Sigla de Exibição
							</span>
							<span className="font-medium text-sm">
								{getValue(empresa.sigla)}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 ${valueBg[tema]}`}
						>
							<span
								className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-3.5 h-3.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
									/>
								</svg>
								CNPJ Oficial
							</span>
							<span className="font-mono font-medium text-sm text-blue-500 dark:text-blue-400">
								{getValue(empresa.cnpj)}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 ${valueBg[tema]}`}
						>
							<span
								className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-3.5 h-3.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
									/>
								</svg>
								Grupo / Regime Tributário
							</span>
							<span className="font-medium text-sm">
								{empresa.grupoNome ? (
									<span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase">
										{empresa.grupoNome}
									</span>
								) : (
									getValue(null)
								)}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 sm:col-span-2 ${valueBg[tema]}`}
						>
							<div className="flex items-center justify-between">
								<span
									className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="w-3.5 h-3.5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
										/>
									</svg>
									Caminho do Diretório (Rede)
								</span>
								{empresa.pasta && (
									<button
										onClick={() => navigator.clipboard.writeText(empresa.pasta)}
										className={`text-[9px] uppercase font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400`}
										title="Copiar"
									>
										Copiar
									</button>
								)}
							</div>
							<span
								className="font-mono text-xs truncate"
								title={empresa.pasta}
							>
								{getValue(empresa.pasta)}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 ${valueBg[tema]}`}
						>
							<span
								className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-3.5 h-3.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
									/>
								</svg>
								Status Atual no Banco
							</span>
							<span className="font-medium text-sm">
								{empresa.active ? (
									<span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
										<span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
										Empresa Ativa
									</span>
								) : (
									<span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
										<span className="w-2 h-2 rounded-full bg-rose-500"></span>
										Empresa Inativa
									</span>
								)}
							</span>
						</div>

						<div
							className={`p-3 rounded-lg flex flex-col gap-1.5 ${valueBg[tema]}`}
						>
							<span
								className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${labelCor[tema]}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-3.5 h-3.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
									/>
								</svg>
								Posição de Ordenação
							</span>
							<span className="font-medium text-sm">
								{getValue(empresa.grupo_ordem)}
							</span>
						</div>
					</div>
				</div>

				{/* Rodapé */}
				<div className={`px-6 py-4 flex justify-end ${bgHeader[tema]}`}>
					<button
						onClick={onClose}
						className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-bold px-5 py-2 rounded-lg text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						Voltar para a Tabela
					</button>
				</div>
			</div>
		</div>
	);
}
