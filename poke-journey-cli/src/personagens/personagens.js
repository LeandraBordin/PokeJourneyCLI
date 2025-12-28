import readlineSync from 'readline-sync';

function escolherRegiao() {
  const regioes = [
    'Kanto',
    'Johto',
    'Hoenn',
    'Sinnoh',
    'Unova',
    'Kalos',
    'Alola',
    'Galar',
    'Paldea',
  ];
  let op = 0;
  while (op < 1 || op > regioes.length) {
    op = readlineSync.questionInt(
      `Escolha sua região:\n` +
        regioes.map((regiao, i) => `  ${i + 1} - ${regiao}`).join('\n') +
        '\n'
    );
    if (op < 1 || op > regioes.length) {
      console.log('Escolha uma região válida!\n');
    }
  }
  return regioes[op - 1];
}
function escolherGenero() {
  const generos = ['Feminino', 'Masculino'];
  let op = 0;
  while (op < 1 || op > generos.length) {
    op = readlineSync.questionInt(`Escolha o gênero:
    1 - Feminino
    2 - Masculino
  `);
    if (op < 1 || op > generos.length) {
      console.log('Opção inválida! Tente novamente.\n');
    }
  }
  return generos[op - 1];
}
export function criarPersonagem() {
  const nome = readlineSync.question('Digite o nome do seu Personagem:');
  const regiao = escolherRegiao();
  const genero = escolherGenero();
  const personagem = {
    nome: nome,
    regiao: regiao,
    genero: genero,
    equipe: [],
    pokedex: [],
    pc: [],
    insignias: [],
    mochila: [],
    dinheiro: 3000,
    localizacao: '',
  };
  return personagem;
}
