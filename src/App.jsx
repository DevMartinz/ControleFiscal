import { useState } from "react";
import "./index.css";

// 1. Importando os Componentes (Telas e Components)
import { Login } from "./components/Login";
import { Header } from "./components/Header";
import { NotificacaoSped } from "./components/NotificacaoSped";
import { HistoricoSidebar } from "./components/HistoricoSidebar";
import { TabelaFiscal } from "./components/TabelaFiscal";
import { DashboardResumo } from "./components/DashboardResumo";

// 2. Importando os Dados
import {
  categorias,
  dadosIniciais,
  mesesDisponiveis,
  totalTarefasRequeridas,
} from "./data/constants";

function App() {
  // --- ESTADOS GERAIS ---
  const [usuarioLogado, setUsuarioLogado] = useState(
    () => localStorage.getItem("usuarioLogado") || null,
  );
  const [filtro, setFiltro] = useState("");
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [notificacao, setNotificacao] = useState(null);

  // --- CONFIGURAÇÕES DE PERÍODO ---
  const dataAtual = new Date();
  const [periodo, setPeriodo] = useState({
    ano: dataAtual.getFullYear().toString(),
    mes: String(dataAtual.getMonth() + 1).padStart(2, "0"),
  });

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
    const key = `planilhaFiscalDados_${dataAtual.getFullYear()}_${String(dataAtual.getMonth() + 1).padStart(2, "0")}`;
    const salvos = localStorage.getItem(key);
    return salvos ? mesclarComDadosIniciais(salvos) : dadosIniciais;
  });

  const [historico, setHistorico] = useState(
    () => JSON.parse(localStorage.getItem("planilhaFiscalHistorico")) || [],
  );

  // --- LÓGICA DE NEGÓCIO ---
  const mudarPeriodo = (novoAno, novoMes) => {
    setPeriodo({ ano: novoAno, mes: novoMes });
    const key = `planilhaFiscalDados_${novoAno}_${novoMes}`;
    const salvos = localStorage.getItem(key);
    setEmpresas(
      salvos
        ? mesclarComDadosIniciais(salvos)
        : dadosIniciais.map((d) => ({ ...d, tarefas: {} })),
    );
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
          cor: status === "OK" ? "text-green-600" : "text-slate-500",
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
          : e,
      );
      localStorage.setItem(
        `planilhaFiscalDados_${periodo.ano}_${periodo.mes}`,
        JSON.stringify(novasEmpresas),
      );
      return novasEmpresas;
    });
  };

  const atualizarLinha = (empresaId, status) => {
    const dataLog = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const empNome = empresas.find((e) => e.id === empresaId)?.nome;

    setHistorico((prev) => {
      const novoHist = [
        {
          id: Date.now(),
          usuario: usuarioLogado,
          acao: status,
          detalhe: `[${periodo.mes}/${periodo.ano}] TODAS AS TAREFAS - ${empNome}`,
          data: dataLog,
          cor: status === "OK" ? "text-green-600" : "text-red-600",
        },
        ...prev,
      ].slice(0, 50);
      localStorage.setItem("planilhaFiscalHistorico", JSON.stringify(novoHist));
      return novoHist;
    });

    setEmpresas((prev) => {
      const novasEmpresas = prev.map((e) => {
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
      });
      localStorage.setItem(
        `planilhaFiscalDados_${periodo.ano}_${periodo.mes}`,
        JSON.stringify(novasEmpresas),
      );
      return novasEmpresas;
    });
  };

  const processarNotificacao = (aceitou) => {
    if (aceitou && notificacao) {
      const dataLog = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setEmpresas((prev) => {
        const novasEmpresas = prev.map((e) =>
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
        localStorage.setItem(
          `planilhaFiscalDados_${periodo.ano}_${periodo.mes}`,
          JSON.stringify(novasEmpresas),
        );
        return novasEmpresas;
      });
    }
    setNotificacao(null);
  };

  const handleLoginSuccess = (nomeUsuario) => {
    setUsuarioLogado(nomeUsuario);
    localStorage.setItem("usuarioLogado", nomeUsuario);
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("usuarioLogado");
  };

  // --- RENDERIZAÇÃO ---
  if (!usuarioLogado) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 relative font-sans flex flex-col overflow-hidden">
      <NotificacaoSped
        dados={notificacao}
        onAceitar={() => processarNotificacao(true)}
        onRecusar={() => processarNotificacao(false)}
      />

      <HistoricoSidebar
        mostrar={mostrarHistorico}
        historico={historico}
        onFechar={() => setMostrarHistorico(false)}
        onLimpar={() => {
          setHistorico([]);
          localStorage.removeItem("planilhaFiscalHistorico");
        }}
      />

      <Header
        usuarioLogado={usuarioLogado}
        periodo={periodo}
        mudarPeriodo={mudarPeriodo}
        filtro={filtro}
        setFiltro={setFiltro}
        onAbrirHistorico={() => setMostrarHistorico(true)}
        onLogout={handleLogout}
      />

      <div className="bg-slate-100/80 border-b border-slate-200 p-2 max-w-[1800px] w-full mx-auto rounded-t-xl flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Exibindo auditoria referente a:{" "}
          <span className="text-blue-800">
            {mesesDisponiveis.find((m) => m.val === periodo.mes)?.nome} de{" "}
            {periodo.ano}
          </span>
        </div>

        <DashboardResumo
          empresas={empresas}
          categorias={categorias}
          totalTarefasRequeridas={totalTarefasRequeridas}
        />
      </div>

      <TabelaFiscal
        empresas={empresas}
        filtro={filtro}
        categorias={categorias}
        totalTarefasRequeridas={totalTarefasRequeridas}
        onAtualizarTarefa={atualizarTarefa}
        onAtualizarLinha={atualizarLinha} //
      />

      <footer className="py-2 text-center text-[8px] text-slate-400 uppercase tracking-widest font-bold">
        SABINO CGE - @DevMartinz
      </footer>
    </div>
  );
}

export default App;
