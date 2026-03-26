import { useState, useEffect } from "react";
import "./index.css";
import { supabase } from "./supabaseClient";

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

  const [empresas, setEmpresas] = useState([]);
  const [periodoId, setPeriodoId] = useState(null); // NOVO: Vai guardar o ID numérico do mês (ex: 1) que vem do banco

  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const carregarDadosDoBanco = async () => {
      // 1. Buscar TODAS as empresas ativas PRIMEIRO (Garante que a tela nunca fique vazia)
      const { data: listaEmpresas, error: erroEmpresas } = await supabase
        .from("enterprise")
        .select("*")
        .eq("active", true);

      if (erroEmpresas || !listaEmpresas) {
        console.error("Erro ao buscar empresas:", erroEmpresas);
        return;
      }

      // 2. Tentar buscar o ID do período atual
      const { data: periodoData } = await supabase
        .from("period")
        .select("id")
        .eq("month", periodo.mes)
        .eq("year", periodo.ano)
        .single();

      let auditoriasDaTela = [];

      // 3. O período existe? Se sim, busca as tarefas preenchidas. Se não, segue com a lista vazia.
      if (periodoData) {
        setPeriodoId(periodoData.id);

        const { data: auditorias, error: erroAuditorias } = await supabase
          .from("audit")
          .select(
            `
            *,
            activity_type ( name, subtype ),
            user ( login )
          `,
          )
          .eq("id_period", periodoData.id);

        if (!erroAuditorias && auditorias) {
          auditoriasDaTela = auditorias;
        }
      } else {
        // Mês novo! Não tem ID no banco ainda.
        setPeriodoId(null);
      }

      // 4. O Tradutor: Junta as empresas com as auditorias (que podem estar vazias)
      const empresasFormatadas = listaEmpresas.map((emp) => {
        const tarefasDessaEmpresa = {};

        const auditoriasDaEmpresa = auditoriasDaTela.filter(
          (a) => a.id_enterprise === emp.id,
        );

        auditoriasDaEmpresa.forEach((aud) => {
          if (aud.activity_type) {
            const chave = `${aud.activity_type.name}-${aud.activity_type.subtype}`;
            tarefasDessaEmpresa[chave] = {
              status: aud.status,
              user: aud.user?.login || "Sistema",
              data: new Date(aud.date).toLocaleDateString("pt-BR"),
            };
          }
        });

        return {
          ...emp,
          nome: emp.name,
          pasta: emp.directory,
          tarefas: tarefasDessaEmpresa,
        };
      });

      // 5. Exibe as empresas na tela!
      setEmpresas(empresasFormatadas);
    };

    // --- NOVO: LIGANDO O RADINHO REALTIME ---

    // Cria um canal para escutar a tabela audit
    const inscricaoRealtime = supabase
      .channel("escutar-auditorias")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "audit" },
        (payload) => {
          console.log("📡 Mudança detectada ao vivo!", payload);
          // Alguém mexeu no banco! Atualizamos a tela silenciosamente
          carregarDadosDoBanco();
        },
      )
      .subscribe();

    // Quando o usuário sair da tela ou mudar de mês, desligamos o radinho para não travar a memória
    return () => {
      supabase.removeChannel(inscricaoRealtime);
    };
  }, [periodo.mes, periodo.ano]);

  // --- LÓGICA DE NEGÓCIO ---
  const mudarPeriodo = (novoAno, novoMes) => {
    // Apenas atualizamos o estado do período.
    setPeriodo({ ano: novoAno, mes: novoMes });

    // Não precisamos fazer mais nada!
    // Ao mudar esse estado, o useEffect que criamos na Etapa 3
    // vai perceber a mudança e disparar a busca no Supabase automaticamente.
  };

  const atualizarTarefa = async (empresaId, cat, sub, status) => {
    // 1. Atualiza a tela IMEDIATAMENTE (Visual instantâneo para o usuário)
    const dataLog = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const chave = `${cat}-${sub}`;

    setEmpresas((prev) =>
      prev.map((e) =>
        e.id === empresaId
          ? {
              ...e,
              tarefas: {
                ...e.tarefas,
                [chave]: { status, user: usuarioLogado, data: dataLog },
              },
            }
          : e,
      ),
    );

    // --- DAQUI PARA BAIXO É A CONVERSA COM O SUPABASE ---

    // 2. Precisamos achar o ID numérico da tarefa clicada
    const { data: tarefa } = await supabase
      .from("activity_type")
      .select("id")
      .eq("name", cat)
      .eq("subtype", sub)
      .single();

    if (!tarefa) {
      console.error("Tarefa não encontrada no banco!");
      return;
    }

    // 3. Precisamos do ID numérico do usuário (o seu estado logado tem apenas o nome em texto)
    const { data: userDb } = await supabase
      .from("user")
      .select("id")
      .eq("login", usuarioLogado)
      .single();

    if (!userDb) {
      console.error("Usuário não encontrado no banco!");
      return;
    }

    // 4. Lidar com o Período: Se o mês for novo, cria ele no banco na hora!
    let currentPeriodId = periodoId;
    if (!currentPeriodId) {
      const { data: newPeriod, error: errPeriodo } = await supabase
        .from("period")
        .insert({ month: periodo.mes, year: periodo.ano })
        .select("id")
        .single();

      if (!errPeriodo && newPeriod) {
        currentPeriodId = newPeriod.id;
        setPeriodoId(newPeriod.id); // Atualiza o estado global para os próximos cliques
      } else {
        console.error("Erro ao criar o mês no banco:", errPeriodo);
        return;
      }
    }

    // 5. Finalmente, salva a marcação na tabela Audit (O Upsert atualiza se já existir)
    const { error: errAudit } = await supabase.from("audit").upsert(
      {
        id_enterprise: empresaId,
        id_activity_type: tarefa.id,
        id_period: currentPeriodId,
        id_user: userDb.id,
        status: status,
        date: new Date().toISOString().split("T")[0], // Salva a data no padrão de banco de dados
      },
      { onConflict: "id_period, id_enterprise, id_activity_type" },
    );

    if (errAudit) {
      console.error("Erro ao salvar a auditoria:", errAudit);
    }
  };

  const atualizarLinha = async (empresaId, status) => {
    const dataLog = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Atualiza a tela primeiro para dar a sensação de sistema rápido (UX)
    setEmpresas((prev) =>
      prev.map((e) => {
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
      }),
    );

    // --- DAQUI PARA BAIXO É A CONVERSA COM O BANCO EM MASSA ---

    // 2. Busca o ID numérico do usuário
    const { data: userDb } = await supabase
      .from("user")
      .select("id")
      .eq("login", usuarioLogado)
      .single();

    if (!userDb) {
      console.error("Usuário não encontrado!");
      return;
    }

    // 3. Garante que o mês existe no banco (igual fizemos na outra função)
    let currentPeriodId = periodoId;
    if (!currentPeriodId) {
      const { data: newPeriod } = await supabase
        .from("period")
        .insert({ month: periodo.mes, year: periodo.ano })
        .select("id")
        .single();

      if (newPeriod) {
        currentPeriodId = newPeriod.id;
        setPeriodoId(newPeriod.id);
      } else return;
    }

    // 4. Puxa TODOS os IDs das atividades do banco de uma vez só
    const { data: atividades } = await supabase
      .from("activity_type")
      .select("id");

    if (!atividades || atividades.length === 0) return;

    // 5. O "Empacotador": Cria um array com todas as tarefas prontas para salvar
    const pacoteDeTarefas = atividades.map((ativ) => ({
      id_enterprise: empresaId,
      id_activity_type: ativ.id,
      id_period: currentPeriodId,
      id_user: userDb.id,
      status: status, // Aqui vai o "OK" ou "NAO" que você clicou
      date: new Date().toISOString().split("T")[0],
    }));

    // 6. Envia a caixa toda de uma vez para o Supabase!
    const { error } = await supabase.from("audit").upsert(pacoteDeTarefas, {
      onConflict: "id_period, id_enterprise, id_activity_type",
    });

    if (error) {
      console.error("Erro ao preencher a linha em massa:", error);
    }
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
          Exibindo check-in referente a:{" "}
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
