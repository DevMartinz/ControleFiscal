// src/data/constants.js

export const usuariosPermitidos = [
  { login: "Bruno", senha: "123", nome: "Bruno (T.I)" },
  { login: "Pedro", senha: "123", nome: "Pedro (T.I)" },
  { login: "George", senha: "123", nome: "George (Fiscal)" },
];

export const categorias = [
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

export const totalTarefasRequeridas = categorias.reduce(
  (acc, cat) => acc + cat.filhas.length,
  0,
);

export const dadosIniciais = [
  { id: 1, nome: "AFD", pasta: "E:/Arquivos/Sabino CGE", tarefas: {} },
  { id: 2, nome: "AJC", pasta: "C:/Fiscal/0002-Goianinha", tarefas: {} },
  { id: 3, nome: "ANH", pasta: "C:/Fiscal/0003-NovaCruz", tarefas: {} },
  { id: 4, nome: "APM", pasta: "C:/Fiscal/0004-SPP", tarefas: {} },
  { id: 5, nome: "ARL", pasta: "C:/Fiscal/0005-PassaFica", tarefas: {} },
  { id: 6, nome: "ASL", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
  { id: 7, nome: "AVM", pasta: "C:/Fiscal/0007-Touros", tarefas: {} },
  { id: 8, nome: "BHG", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
  { id: 9, nome: "BRP", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
  { id: 10, nome: "CMA", pasta: "C:/Fiscal/0006-Brejinho", tarefas: {} },
];

export const anosDisponiveis = ["2025", "2026", "2027"];
export const mesesDisponiveis = [
  { val: "01", nome: "Janeiro" },
  { val: "02", nome: "Fevereiro" },
  { val: "03", nome: "Março" },
  { val: "04", nome: "Abril" },
  { val: "05", nome: "Maio" },
  { val: "06", nome: "Junho" },
  { val: "07", nome: "Julho" },
  { val: "08", nome: "Agosto" },
  { val: "09", nome: "Setembro" },
  { val: "10", nome: "Outubro" },
  { val: "11", nome: "Novembro" },
  { val: "12", nome: "Dezembro" },
];
