import React from "react";
import { useNavigate } from "react-router-dom";
// Importa o seu componente de login que já estava pronto na pasta components
import { Login as ComponenteLogin } from "../components/Login";

export function Login() {
	const navigate = useNavigate(); // O motorista do nosso roteador

	const handleLoginSuccess = (nomeUsuario) => {
		// 1. Salva o usuário no navegador (como você já fazia)
		localStorage.setItem("usuarioLogado", nomeUsuario);

		// 2. O Comando Mágico: Navega o usuário direto para o Hub Central!
		navigate("/hub");
	};

	return (
		// Um fundo básico caso o componente de login não preencha a tela toda
		<div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
			<ComponenteLogin onLogin={handleLoginSuccess} />
		</div>
	);
}
