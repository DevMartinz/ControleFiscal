import { useState, useEffect, useCallback } from "react";
import "./index.css";
import { supabase } from "./supabaseClient";

import { Login } from "./components/Login";
import { Header } from "./components/Header";
import { NotificacaoSped } from "./components/NotificacaoSped";
import { HistoricoSidebar } from "./components/HistoricoSidebar";
import { TabelaFiscal } from "./components/TabelaFiscal";
import { DashboardResumo } from "./components/DashboardResumo";

import { categorias, totalTarefasRequeridas } from "./data/constants";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(
    () => localStorage.getItem("usuarioLogado") || null,
  );

  const [filtroTela, setFiltroTela] = useState("");
  const [filtroValido, setFiltroValido] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltroValido(filtroTela);
    }, 300);
    return () => clearTimeout(timer);
  }, [filtroTela]);

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [notificacao, setNotificacao] = useState(null);

  const dataAtual = new Date();
  const [periodo, setPeriodo] = useState({
    ano: dataAtual.getFullYear().toString(),
    mes: String(dataAtual.getMonth() + 1).padStart(2, "0"),
  });

  const [empresas, setEmpresas] = useState([]);
  const [historico, setHistorico] = useState([]);

  // --- 🌙 NOVO MOTOR DE 3 TEMAS ---
  const [tema, setTema] = useState(
    () => localStorage.getItem("temaSistema") || "light",
  );

  useEffect(() => {
    const htmlTag = document.documentElement;
    // Remove classes antigas
    htmlTag.classList.remove("light", "dark", "black");
    // Adiciona o tema atual (útil para customizações CSS manuais)
    htmlTag.classList.add(tema);

    // Se for um dos modos escuros, avisa o tailwind nativo
    if (tema === "dark" || tema === "black") {
      htmlTag.classList.add("dark");
    }
    localStorage.setItem("temaSistema", tema);
  }, [tema]);

  const ciclarTema = () => {
    if (tema === "light") setTema("dark");
    else if (tema === "dark") setTema("black");
    else setTema("light");
  };

  const estilosFundoBase = {
    light: "bg-slate-50",
    dark: "bg-slate-900",
    black: "bg-black",
  };
  // --------------------------------

  useEffect(() => {
    const carregarDadosDoBanco = async () => {
      const { data: listaEmpresas, error: erroEmpresas } = await supabase
        .from("enterprise")
        .select("*")
        .eq("active", true)
        .order("grupo_ordem", { ascending: true })
        .order("sigla", { ascending: true });

      if (erroEmpresas || !listaEmpresas) return;

      const nomesDosMeses = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      const mesFormatado = nomesDosMeses[parseInt(periodo.mes, 10)];

      const { data: periodoData } = await supabase
        .from("period")
        .select("id")
        .eq("month", mesFormatado)
        .eq("year", periodo.ano)
        .single();

      let auditoriasDaTela = [];

      if (periodoData) {
        const { data: auditorias } = await supabase
          .from("audit")
          .select(`*, activity_type ( name, subtype ), user ( login )`)
          .eq("id_period", periodoData.id);

        if (auditorias) auditoriasDaTela = auditorias;
      }

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
              data: new Date(aud.created_at || aud.date).toLocaleDateString(
                "pt-BR",
              ),
            };
          }
        });

        return {
          ...emp,
          nome: emp.sigla || emp.name,
          grupoNome: emp.grupo_nome,
          pasta: emp.directory,
          tarefas: tarefasDessaEmpresa,
        };
      });

      setEmpresas(empresasFormatadas);

      const historicoGlobal = auditoriasDaTela.map((aud) => {
        const emp = listaEmpresas.find((e) => e.id === aud.id_enterprise);
        const cat = aud.activity_type?.name || "Desconhecido";
        const sub = aud.activity_type?.subtype || "Tarefa";
        const status = aud.status;

        let dataCriacao;
        try {
          const rawDate = aud.created_at || aud.date;
          dataCriacao = rawDate ? new Date(rawDate) : new Date();
          if (isNaN(dataCriacao.getTime())) throw new Error("Data Inválida");
        } catch (e) {
          dataCriacao = new Date();
        }

        let corFundo = "bg-slate-500";
        let corBadge = "bg-slate-50 text-slate-600";

        if (status === "OK") {
          corFundo = "bg-green-500";
          corBadge = "bg-green-100 text-green-700";
        } else if (status === "NAO") {
          corFundo = "bg-red-500";
          corBadge = "bg-red-100 text-red-700";
        } else if (status === "Andamento") {
          corFundo = "bg-sky-500";
          corBadge = "bg-sky-100 text-sky-700";
        } else if (status === "Verificar") {
          corFundo = "bg-amber-500";
          corBadge = "bg-amber-100 text-amber-700";
        }

        return {
          id: aud.id || crypto.randomUUID(),
          usuario: aud.user?.login || "Sistema",
          data: dataCriacao.toLocaleDateString("pt-BR"),
          hora:
            dataCriacao.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }) || "00:00",
          acao: status,
          detalhe: `${cat}: ${sub} ➔ ${emp?.nome || emp?.sigla || "Empresa"}`,
          corFundo,
          corBadge,
          timestamp: dataCriacao.getTime(),
        };
      });

      historicoGlobal.sort((a, b) => b.timestamp - a.timestamp);
      setHistorico(historicoGlobal);
    };

    carregarDadosDoBanco();

    const inscricaoRealtime = supabase
      .channel("escutar-auditorias")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "audit" },
        () => {
          carregarDadosDoBanco();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inscricaoRealtime);
    };
  }, [periodo.mes, periodo.ano]);

  const mudarPeriodo = (novoAno, novoMes) => {
    setPeriodo({ ano: novoAno, mes: novoMes });
  };

  const garantirPeriodoNoBanco = useCallback(async () => {
    const nomesDosMeses = [
      "",
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const mesFormatado = nomesDosMeses[parseInt(periodo.mes, 10)];

    const { data: periodoDb } = await supabase
      .from("period")
      .select("id")
      .eq("month", mesFormatado)
      .eq("year", periodo.ano)
      .single();

    if (periodoDb) return periodoDb.id;

    const { data: novoPeriodo, error } = await supabase
      .from("period")
      .insert({ month: mesFormatado, year: periodo.ano })
      .select("id")
      .single();

    if (novoPeriodo) {
      return novoPeriodo.id;
    }

    console.error("Erro ao criar/buscar o período:", error);
    return null;
  }, [periodo.ano, periodo.mes]);

  const atualizarTarefa = useCallback(
    async (empresaId, cat, sub, status) => {
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

      const { data: tarefa } = await supabase
        .from("activity_type")
        .select("id")
        .eq("name", cat)
        .eq("subtype", sub)
        .single();

      if (!tarefa) return;

      const { data: userDb } = await supabase
        .from("user")
        .select("id")
        .eq("login", usuarioLogado)
        .single();

      if (!userDb) return;

      const currentPeriodId = await garantirPeriodoNoBanco();
      if (!currentPeriodId) return;

      await supabase.from("audit").upsert(
        {
          id_enterprise: empresaId,
          id_activity_type: tarefa.id,
          id_period: currentPeriodId,
          id_user: userDb.id,
          status: status,
          date: new Date().toISOString().split("T")[0],
        },
        { onConflict: "id_period, id_enterprise, id_activity_type" },
      );
    },
    [usuarioLogado, garantirPeriodoNoBanco],
  );

  const atualizarLinha = useCallback(
    async (empresaId, status) => {
      const dataLog = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

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

      const { data: userDb } = await supabase
        .from("user")
        .select("id")
        .eq("login", usuarioLogado)
        .single();

      if (!userDb) return;

      const currentPeriodId = await garantirPeriodoNoBanco();
      if (!currentPeriodId) return;

      const { data: atividades } = await supabase
        .from("activity_type")
        .select("id");

      if (!atividades || atividades.length === 0) return;

      const pacoteDeTarefas = atividades.map((ativ) => ({
        id_enterprise: empresaId,
        id_activity_type: ativ.id,
        id_period: currentPeriodId,
        id_user: userDb.id,
        status: status,
        date: new Date().toISOString().split("T")[0],
      }));

      await supabase.from("audit").upsert(pacoteDeTarefas, {
        onConflict: "id_period, id_enterprise, id_activity_type",
      });
    },
    [usuarioLogado, garantirPeriodoNoBanco],
  );

  const processarNotificacao = (aceitou) => {
    if (aceitou && notificacao) {
      const dataLog = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setEmpresas((prev) => {
        return prev.map((e) =>
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

  if (!usuarioLogado) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    // Fundo global controlado pelo dicionário
    <div
      className={`min-h-screen ${estilosFundoBase[tema]} transition-colors duration-300 p-4 relative font-sans flex flex-col overflow-hidden`}
    >
      <NotificacaoSped
        dados={notificacao}
        onAceitar={() => processarNotificacao(true)}
        onRecusar={() => processarNotificacao(false)}
      />

      <HistoricoSidebar
        mostrar={mostrarHistorico}
        historico={historico}
        onFechar={() => setMostrarHistorico(false)}
      />

      {/* Header recebendo a mecânica de tema */}
      <Header
        usuarioLogado={usuarioLogado}
        periodo={periodo}
        mudarPeriodo={mudarPeriodo}
        filtro={filtroTela}
        setFiltro={setFiltroTela}
        onAbrirHistorico={() => setMostrarHistorico(true)}
        onLogout={handleLogout}
        tema={tema}
        onCiclarTema={ciclarTema}
      />

      <div className="max-w-[1920px] w-full mx-auto flex justify-center items-center mb-6 mt-4 px-4 sm:px-6">
        {/* Dashboard recebendo a cor do tema */}
        <DashboardResumo
          empresas={empresas}
          categorias={categorias}
          totalTarefasRequeridas={totalTarefasRequeridas}
          tema={tema}
        />
      </div>

      <TabelaFiscal
        empresas={empresas}
        filtro={filtroValido}
        categorias={categorias}
        totalTarefasRequeridas={totalTarefasRequeridas}
        onAtualizarTarefa={atualizarTarefa}
        onAtualizarLinha={atualizarLinha}
        tema={tema}
      />

      <footer className="py-2 mt-4 text-center text-[8px] text-slate-500 uppercase tracking-widest font-bold">
        SABINO CGE - @DevMartinz
      </footer>
    </div>
  );
}

export default App;
