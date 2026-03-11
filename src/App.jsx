import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(() => localStorage.getItem('usuarioLogado') || null);
  const [filtro, setFiltro] = useState('');
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [inputLogin, setInputLogin] = useState('');
  const [inputSenha, setInputSenha] = useState('');
  const [erro, setErro] = useState('');

  const usuariosPermitidos = [
    { login: "Bruno", senha: "123", nome: "Bruno (T.I)" },
    { login: "Pedro", senha: "123", nome: "Pedro (T.I)" },
    { login: "George", senha: "123", nome: "George (Fiscal)" }
  ];

  const categorias = [
    { nome: "BAIXAR XML DE SAÍDA", filhas: ["NFE", "NFCE"] },
    { nome: "IMPORTAR XML DE SAÍDA", filhas: ["NFE", "NFCE"] },
    { nome: "QUEBRAS DE SEQUÊNCIA", filhas: ["NFE", "NFCE"] },
    { nome: "VERIFICAR CANCELADAS", filhas: ["NFE", "NFCE"] },
    { nome: "VERIFICAR QUANTIDADE", filhas: ["NFE", "NFCE"] },
    { nome: "XML DAS NFE DE ENTRADA", filhas: ["Baixar", "Importar"] },
    { nome: "FUNRURAL", filhas: ["Check"] },
    { nome: "ENTRADA/SAÍDA", filhas: ["Check"] },
    { nome: "MALHA", filhas: ["Check"] },
  ];

  // Dados mestres com as pastas corrigidas
  const dadosIniciais = [
    { id: 1, nome: "0001 Sitio Matriz", pasta: "C:/Fiscal/0001-Matriz", tarefas: {} },
    { id: 2, nome: "0002 Goianinha", pasta: "C:/Fiscal/0002-Goianinha", tarefas: {} },
    { id: 3, nome: "0003 Nova Cruz", pasta: "C:/Fiscal/0003-NovaCruz", tarefas: {} },
    { id: 4, nome: "0004 São Paulo Potengi", pasta: "C:/Fiscal/0004-SPP", tarefas: {} },
    { id: 5, nome: "0005 Passa e Fica", pasta: "C:/Fiscal/0005-PassaFica", tarefas: {} },
    { id: 6, nome: "0006 Brejinho", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
    { id: 7, nome: "0007 Touros", pasta: "C:/Fiscal/0007-Touros", tarefas: {} }
  ];

  const [empresas, setEmpresas] = useState(() => {
    const salvos = localStorage.getItem('planilhaFiscalDados');
    if (!salvos) return dadosIniciais;
    
    // Lógica para injetar as pastas caso o localStorage esteja desatualizado
    const empresasSalvas = JSON.parse(salvos);
    return empresasSalvas.map(emp => {
      const infoMestra = dadosIniciais.find(d => d.id === emp.id);
      return { ...emp, pasta: infoMestra ? infoMestra.pasta : emp.pasta };
    });
  });

  const [historico, setHistorico] = useState(() => JSON.parse(localStorage.getItem('planilhaFiscalHistorico')) || []);

  useEffect(() => {
    localStorage.setItem('planilhaFiscalDados', JSON.stringify(empresas));
    localStorage.setItem('planilhaFiscalHistorico', JSON.stringify(historico));
  }, [empresas, historico]);

  const atualizarTarefa = (empresaId, cat, sub, status) => {
    const dataLog = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const empNome = empresas.find(e => e.id === empresaId)?.nome;
    const chave = `${cat}-${sub}`;

    setHistorico(prev => [{
      id: Date.now(), usuario: usuarioLogado, acao: status, detalhe: `${sub} - ${empNome}`, data: dataLog,
      cor: status === 'OK' ? 'text-green-600' : status === 'NAO' ? 'text-red-600' : status === 'Verificar' ? 'text-amber-600' : status === 'Andamento' ? 'text-blue-600' : 'text-slate-500'
    }, ...prev].slice(0, 50));

    setEmpresas(prev => prev.map(e => e.id === empresaId ? { ...e, tarefas: { ...e.tarefas, [chave]: { status, user: usuarioLogado, data: dataLog } } } : e));
  };

  const getCorStatus = (status) => {
    if (status === 'OK') return 'bg-green-100 border-green-500 text-green-700';
    if (status === 'NAO') return 'bg-red-100 border-red-500 text-red-700';
    if (status === 'Verificar') return 'bg-amber-100 border-amber-500 text-amber-700';
    if (status === 'Andamento') return 'bg-sky-100 border-sky-500 text-sky-700';
    return 'bg-white border-slate-200 text-slate-400';
  };

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-blue-900 p-6 text-center">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Sistema <span className="text-blue-300">Fiscal</span></h1>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const u = usuariosPermitidos.find(u => u.login === inputLogin && u.senha === inputSenha);
            if (u) { setUsuarioLogado(u.nome); localStorage.setItem('usuarioLogado', u.nome); } else setErro('Incorreto!');
          }} className="p-6 flex flex-col gap-4">
            {erro && <div className="text-red-600 text-center font-bold text-sm bg-red-50 p-2 border border-red-200 rounded">{erro}</div>}
            <input type="text" placeholder="Usuário" value={inputLogin} onChange={e => setInputLogin(e.target.value)} className="p-3 border rounded outline-none focus:ring-1 focus:ring-blue-800" />
            <input type="password" placeholder="Senha" value={inputSenha} onChange={e => setInputSenha(e.target.value)} className="p-3 border rounded outline-none focus:ring-1 focus:ring-blue-800" />
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded shadow-md transition-colors uppercase">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 relative font-sans">
      {mostrarHistorico && <div className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity" onClick={() => setMostrarHistorico(false)} />}
      
      {/* Sidebar Histórico */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${mostrarHistorico ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-4 bg-blue-900 text-white flex justify-between items-center">
          <h2 className="font-bold uppercase text-xs tracking-widest">Histórico Recente</h2>
          <button onClick={() => setMostrarHistorico(false)} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {historico.map(h => (
            <div key={h.id} className="p-3 bg-white border border-slate-200 rounded text-sm shadow-sm hover:border-blue-100">
              <div className="flex justify-between font-bold text-[10px]"><span>{h.usuario}</span><span className="text-slate-400">{h.data}</span></div>
              <p className={`font-bold uppercase text-[11px] mt-1 ${h.cor}`}>{h.acao}</p>
              <p className="text-xs text-slate-500">{h.detalhe}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setHistorico([])} className="p-4 text-xs font-bold text-slate-400 hover:text-red-500 uppercase border-t border-slate-100 transition-colors">Limpar Histórico</button>
      </div>

      <header className="max-w-[1800px] mx-auto mb-6 flex flex-col md:flex-row gap-4 justify-between md:items-center border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-lg uppercase">{usuarioLogado.charAt(0)}</div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Monitor Fiscal <span className="text-blue-800">v1.4</span></h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">CheckList Auditoria XML RN</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="🔍 Buscar empresa..." 
            className="w-full md:w-64 p-2 text-sm border rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-800 shadow-sm transition-all"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
          <div className="flex gap-4 items-center">
            <span className="text-[10px] text-slate-500 bg-white px-2 py-1 border rounded-full">Usuário: <b className="text-blue-900">{usuarioLogado}</b></span>
            <button onClick={() => setMostrarHistorico(true)} className="text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline uppercase">Histórico</button>
            <button onClick={() => { setUsuarioLogado(null); localStorage.removeItem('usuarioLogado'); }} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline uppercase">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white text-[10px] uppercase tracking-wider">
                <th rowSpan="2" className="p-3 text-left font-bold border-r border-b border-blue-700/50 bg-blue-900 text-white sticky left-0 z-30 w-[170px]">EMPRESAS</th>
                {categorias.map(cat => <th key={cat.nome} colSpan={cat.filhas.length} className="p-1 text-center border-r border-b border-blue-700/50">{cat.nome}</th>)}
              </tr>
              <tr className="bg-gray-100 text-slate-600 text-[9px] uppercase font-bold border-b border-slate-200">
                {categorias.map(cat => cat.filhas.map(f => <th key={`${cat.nome}-${f}`} className="p-1.5 border-r border-slate-200">{f}</th>))}
              </tr>
            </thead>
            <tbody>
              {empresas.filter(e => e.nome.toLowerCase().includes(filtro.toLowerCase())).map((emp) => (
                <tr key={emp.id} className="border-b border-slate-100 hover:bg-blue-50 transition-colors group">
                  <td className="p-2 font-bold text-slate-700 border-r border-slate-200 bg-white sticky left-0 z-20 text-[10px] shadow-sm">
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="truncate flex-1 uppercase" title={emp.nome}>{emp.nome}</span>
                      
                      {/* ÍCONE DE INFORMAÇÃO CORRIGIDO */}
                      <div 
                        title={`PASTA: ${emp.pasta || 'Não configurada'}`}
                        className="flex-shrink-0 w-3.5 h-3.5 border border-blue-200 text-blue-500 rounded-full flex items-center justify-center text-[9px] font-serif italic bg-blue-50 cursor-help hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        i
                      </div>
                    </div>
                  </td>
                  {categorias.map(cat => cat.filhas.map(sub => {
                    const info = emp.tarefas[`${cat.nome}-${sub}`] || { status: 'Pendente' };
                    return (
                      <td key={`${cat.nome}-${sub}`} className="p-2 border-r border-slate-100 text-center min-w-[70px]">
                        <select 
                          value={info.status} 
                          onChange={(e) => atualizarTarefa(emp.id, cat.nome, sub, e.target.value)}
                          className={`w-full p-1 rounded text-[9px] font-bold border transition-all cursor-pointer outline-none focus:ring-1 focus:ring-blue-800 ${getCorStatus(info.status)}`}
                        >
                          <option value="Pendente">---</option>
                          <option value="OK">OK</option>
                          <option value="NAO">NÃO</option>
                          <option value="Verificar">VERIF</option>
                          <option value="Andamento">ANDAM.</option>
                        </select>
                        {info.user && info.status !== 'Pendente' && (
                          <div className="mt-1 text-[7px] text-slate-400 leading-none font-bold uppercase">
                            <span className="text-blue-900/60">{info.user.split(' ')[0]}</span>
                            <br/>
                            {info.data}
                          </div>
                        )}
                      </td>
                    );
                  }))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;