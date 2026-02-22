import fs from 'fs';
import readlineSync, { question, questionInt } from 'readline-sync';
const caminho = 'personagens/personagens.json';
import * as constants from '../constants/constants.js';
export function carregarPersonagens() {
  const dados = fs.readFileSync(caminho, 'utf8');

  try {
    return JSON.parse(dados);
  } catch (e) {
    return [];
  }
}
export function salvarPersonagem(personagem) {
  let lista = [];
  if (fs.existsSync(caminho)) {
    const dados = fs.readFileSync(caminho, 'utf8');
    try {
      lista = JSON.parse(dados);
    } catch {
      lista = [];
    }
  }

  if (!personagem.id) {
    const novoId =
      lista.length === 0 ? 1 : Math.max(...lista.map((p) => p.id)) + 1;

    personagem.id = novoId;
  }
  const index = lista.findIndex((p) => p.id === personagem.id);

  if (index !== -1) {
    lista[index] = personagem;
  } else {
    if (lista.length >= constants.MAX_PERSONAGENS) {
      console.log(
        `\nLimite máximo de ${constants.MAX_PERSONAGENS} personagens atingido!\n`,
      );
      return null;
    }

    lista.push(personagem);
    console.log('\nNovo personagem criado!\n');
  }
  fs.writeFileSync(caminho, JSON.stringify(lista, null, 2), 'utf8');
  return personagem;
}

export function trocarPersonagem() {
  const caminho = 'personagens/personagens.json';
  const dados = fs.readFileSync(caminho, 'utf8');
  const personagens = JSON.parse(dados);
  if (personagens.length !== 1) {
    personagens.forEach((personagem, i) => {
      console.log(`[${i + 1}] ${personagem.nome} - ${personagem.regiao}`);
    });
    let op = readlineSync.questionInt('Selecione o personagem desejado:');
    const [personagemAtual] = personagens.splice(op - 1, 1);
    personagens.unshift(personagemAtual);

    fs.writeFileSync(caminho, JSON.stringify(personagens, null, 2), 'utf8');

    console.log(`Personagem ${personagemAtual.nome} selecionado com sucesso!`);

    return personagemAtual;
  } else {
    console.log(`Não existem personagens a serem trocados...`);
    return null;
  }
}
export function excluirPersonagem() {
  const caminho = 'personagens/personagens.json';
  const dados = fs.readFileSync(caminho, 'utf8');
  const personagens = JSON.parse(dados);
  if (personagens.length <= 1) {
    return 'Não existem personagens a serem excluidos';
  }
  personagens.forEach((personagem, i) =>
    console.log(`[${i + 1}] ${personagem.nome} - ${personagem.regiao}`),
  );
  let op = questionInt('Qual personagem deseja excluir?');
  const selecionado = personagens[op - 1];
  if (!selecionado) {
    return 'Opção Inválida';
  }
  let usuariosFiltrados = personagens.filter(
    (users) => users.id !== selecionado.id,
  );
  try {
    fs.writeFileSync(
      caminho,
      JSON.stringify(usuariosFiltrados, null, 2),
      'utf-8',
    );
    return `Usuário ${selecionado.nome} excluido com sucesso!`;
  } catch (error) {
    return `Não foi possível excluir o usuário ${selecionado.nome}, tente novamente`;
  }
}
