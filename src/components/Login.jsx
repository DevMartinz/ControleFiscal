// Caminho: src/pages/Login.jsx  (ou src/components/Login.jsx dependendo da sua estrutura)
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import logoSabino from "../assets/sabino.jpeg"; // Trazendo a logo oficial

export function Login({ onLogin }) {
	const [inputLogin, setInputLogin] = useState("");
	const [inputSenha, setInputSenha] = useState("");
	const [erro, setErro] = useState("");
	const [carregando, setCarregando] = useState(false);
	const [mostrarSenha, setMostrarSenha] = useState(false);

	const loginRef = useRef(null);

	useEffect(() => {
		if (loginRef.current) loginRef.current.focus();
	}, []);

	const handleEntrar = async (e) => {
		e.preventDefault();
		setErro("");

		if (!inputLogin.trim() || !inputSenha.trim()) {
			setErro("Por favor, preencha usuário e senha.");
			return;
		}

		setCarregando(true);

		try {
			const { data: usuarioDb, error } = await supabase
				.from("user")
				.select("*")
				.eq("login", inputLogin.trim())
				.eq("password", inputSenha)
				.single();

			if (error || !usuarioDb) {
				setErro("Credenciais inválidas. Verifique os dados digitados.");
				return;
			}

			if (usuarioDb.active === false) {
				setErro("Acesso suspenso. Contate o administrador do sistema.");
				return;
			}

			onLogin(usuarioDb.login);
		} catch (errorGeral) {
			console.error(errorGeral);
			setErro("Erro de conexão com o banco de dados.");
		} finally {
			setCarregando(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-blue-200">
			{/* LUZES DE FUNDO (GLOW) IGUAIS AO DO HUB */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[130px] opacity-50 bg-blue-200 transition-colors duration-500"></div>
				<div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-60 bg-indigo-100 transition-colors duration-500"></div>
			</div>

			{/* CARD DE LOGIN (Estilo Vidro/Premium) */}
			<div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden border border-white/60 relative z-10 p-8 flex flex-col gap-8">
				{/* Cabeçalho Limpo e Moderno */}
				<div className="flex flex-col items-center text-center mt-2">
					<div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden mb-5">
						<img
							src={logoSabino}
							alt="Logo SABINO CGE"
							className="w-full h-full object-cover"
						/>
					</div>
					<h1 className="text-2xl font-black text-slate-800 tracking-tight">
						SABINO CGE
					</h1>
					<p className="text-blue-600 text-[10px] font-bold mt-1.5 uppercase tracking-widest">
						Acesso Restrito
					</p>
				</div>

				{/* Formulário */}
				<form onSubmit={handleEntrar} className="flex flex-col gap-5">
					{erro && (
						<div className="text-rose-600 text-center font-bold text-xs bg-rose-50 p-4 border border-rose-100 rounded-xl animate-pulse">
							{erro}
						</div>
					)}

					{/* Campo de Usuário */}
					<div className="flex flex-col gap-2">
						<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
							Usuário
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
									/>
								</svg>
							</div>
							<input
								ref={loginRef}
								type="text"
								placeholder="Digite seu login"
								value={inputLogin}
								onChange={(e) => setInputLogin(e.target.value)}
								className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all shadow-sm text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal"
								disabled={carregando}
							/>
						</div>
					</div>

					{/* Campo de Senha com Ícone de Olho */}
					<div className="flex flex-col gap-2">
						<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
							Senha
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
									/>
								</svg>
							</div>
							<input
								type={mostrarSenha ? "text" : "password"}
								placeholder="••••••••"
								value={inputSenha}
								onChange={(e) => setInputSenha(e.target.value)}
								className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all shadow-sm text-slate-700 font-medium tracking-wide placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-normal"
								disabled={carregando}
							/>
							<button
								type="button"
								onClick={() => setMostrarSenha(!mostrarSenha)}
								className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none rounded-lg cursor-pointer"
								tabIndex="-1"
								title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
							>
								{mostrarSenha ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="w-5 h-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="w-5 h-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>

					{/* Botão de Entrar */}
					<button
						type="submit"
						disabled={carregando}
						className={`mt-4 font-bold py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest text-[11px] text-white flex items-center justify-center gap-2
              ${
								carregando
									? "bg-blue-400 shadow-none cursor-not-allowed scale-[0.98]"
									: "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
							}`}
					>
						{carregando ? (
							<>
								<svg
									className="animate-spin h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Autenticando...
							</>
						) : (
							"Entrar no Sistema"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
