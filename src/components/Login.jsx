// Caminho: src/components/Login.jsx
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export function Login({ onLogin }) {
  const [inputLogin, setInputLogin] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false); // Novo estado para o olhinho

  const loginRef = useRef(null); // Usado para focar no input ao abrir a tela

  // Autofocus no primeiro input assim que a tela carregar
  useEffect(() => {
    if (loginRef.current) loginRef.current.focus();
  }, []);

  const handleEntrar = async (e) => {
    e.preventDefault();
    setErro("");

    // Tratamento extra: .trim() remove espaços em branco digitados sem querer
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 font-sans selection:bg-blue-200">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Cabeçalho */}
        <div className="bg-blue-900 p-8 text-center relative overflow-hidden">
          {/* Efeito de brilho sutil no fundo */}
          <div className="absolute inset-0 bg-blue-800 opacity-50 blur-2xl rounded-full scale-150 transform -translate-y-1/2"></div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter relative z-10">
            Sistema <span className="text-blue-400">Fiscal</span>
          </h1>
          <p className="text-blue-200 text-xs mt-2 uppercase tracking-widest relative z-10 font-medium">
            Acesso Restrito
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleEntrar} className="p-8 flex flex-col gap-5">
          {erro && (
            <div className="text-red-600 text-center font-semibold text-sm bg-red-50 p-3 border border-red-200 rounded-lg animate-pulse">
              {erro}
            </div>
          )}

          {/* Campo de Usuário */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Usuário
            </label>
            <input
              ref={loginRef}
              type="text"
              placeholder="Digite seu login"
              value={inputLogin}
              onChange={(e) => setInputLogin(e.target.value)}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm text-slate-700"
              disabled={carregando}
            />
          </div>

          {/* Campo de Senha com Ícone de Olho */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="••••••••"
                value={inputSenha}
                onChange={(e) => setInputSenha(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm pr-12 text-slate-700 font-medium tracking-wide"
                disabled={carregando}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none rounded-lg cursor-pointer"
                tabIndex="-1"
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {/* SVG do Olho Aberto/Fechado */}
                {mostrarSenha ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
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
                    strokeWidth={1.5}
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
            className={`mt-4 font-bold py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest text-xs text-white flex items-center justify-center gap-2
              ${
                carregando
                  ? "bg-slate-400 cursor-not-allowed scale-[0.98]"
                  : "bg-blue-800 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              }`}
          >
            {carregando ? (
              <>
                {/* SVG do Spinner de Carregamento */}
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
