// Caminho: src/components/Login.jsx

import { useState } from "react";
import { usuariosPermitidos } from "../data/constants";

// O componente recebe uma "prop" chamada onLogin, que é a função para avisar o App que deu certo
export function Login({ onLogin }) {
  const [inputLogin, setInputLogin] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleEntrar = (e) => {
    e.preventDefault();
    // Verifica se o usuário e senha batem com o banco de dados (na lista constants)
    const u = usuariosPermitidos.find(
      (u) => u.login === inputLogin && u.senha === inputSenha,
    );

    if (u) {
      onLogin(u.nome); // Avisa o App passando o nome do usuário
    } else {
      setErro("Credenciais inválidas!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-blue-900 p-6 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Sistema <span className="text-blue-300">Fiscal</span>
          </h1>
        </div>
        <form onSubmit={handleEntrar} className="p-6 flex flex-col gap-4">
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
