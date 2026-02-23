import * as constants from '../constants/constants.js';
export class UIService {
  static exibirMenuPrincipal(personagem) {
    console.log(`
  ╔════════════════════════════════════╗
  ║            MENU PRINCIPAL          ║
  ╠════════════════════════════════════╣
  ║ Personagem atual: ${personagem.nome.padEnd(16)} ║
  ║ Região: ${personagem.regiao.padEnd(20)}       ║
  ╠════════════════════════════════════╣
  ║  [1] Jogar                         ║
  ║  [2] Criar personagem              ║
  ║  [3] Trocar personagem             ║
  ║  [4] Excluir personagem            ║
  ║  [0] Sair                          ║
  ╚════════════════════════════════════╝
    `);
  }

  static exibirMenuJogo(personagem) {
    console.log(`
  ╔════════════════════════════════════╗
  ║            MENU PRINCIPAL          ║
  ╠════════════════════════════════════╣
  ║ Personagem atual: ${personagem.nome.padEnd(16)} ║
  ║ Região: ${personagem.regiao.padEnd(20)}       ║
  ╠════════════════════════════════════╣
  ║  [1] Explorar                      ║
  ║  [2] Pokedex                       ║
  ║  [3] Pokemon                       ║
  ║  [4] Mochila                       ║
  ║  [0] Sair                          ║
  ╚════════════════════════════════════╝
    `);
  }
  static exibirMenuCidade(personagem) {
    console.log(`
  ╔════════════════════════════════════╗
  ║            MENU PRINCIPAL          ║
  ╠════════════════════════════════════╣
  ║ Personagem atual: ${personagem.nome.padEnd(16)} ║
  ║ Região: ${personagem.regiao.padEnd(20)}       ║
  ╠════════════════════════════════════╣
  ║  [1] Centro Pokemon                ║
  ║  [2] Mercado Pokemon               ║
  ║  [0] Sair                          ║
  ╚════════════════════════════════════╝
    `);
  }
  static exibirMenuCentroPokemon(personagem) {
    console.log(`
  ╔════════════════════════════════════╗
  ║            MENU PRINCIPAL          ║
  ╠════════════════════════════════════╣
  ║ Personagem atual: ${personagem.nome.padEnd(16)} ║
  ║ Região: ${personagem.regiao.padEnd(20)}       ║
  ╠════════════════════════════════════╣
  ║  [1] Curar Pokemons                ║
  ║  [2] Ver PC                        ║
  ║  [0] Sair                          ║
  ╚════════════════════════════════════╝
    `);
  }

  static exibirMenuBatalha() {
    console.log('\n┌───────────────┬───────────────┐');
    console.log('│               │               │');
    console.log('│ 1 - ATACAR    │ 2 - POKÉMON   │');
    console.log('│               │               │');
    console.log('├───────────────┼───────────────┤');
    console.log('│               │               │');
    console.log('│ 3 - MOCHILA   │ 4 - FUGIR     │');
    console.log('│               │               │');
    console.log('└───────────────┴───────────────┘');
  }

  static exibirMenuAtaques(pokemon) {
    const moves = pokemon.moves;
    const formatCell = (text = '') =>
      text.padEnd(constants.CONFIG_UI.COLUNA_LARGURA, ' ');

    console.log('\n┌───────────────────────────────────────────┐');
    console.log('│                   ATAQUES                 │');
    console.log('├─────────────────────┬─────────────────────┤');

    for (let i = 0; i < 4; i += 2) {
      const esquerda = moves[i];
      const direita = moves[i + 1];

      console.log(
        `│ ${formatCell(esquerda ? `[${i + 1}] ${esquerda.nome}` : '')}` +
          `│ ${formatCell(direita ? `[${i + 2}] ${direita.nome}` : '')}│`,
      );

      console.log(
        `│ ${formatCell(esquerda ? `  PODER ${esquerda.poder ?? 0}` : '')}` +
          `│ ${formatCell(direita ? `  PODER ${direita.poder ?? 0}` : '')}│`,
      );

      console.log(
        `│ ${formatCell(
          esquerda ? `  PP ${esquerda.pp}/${esquerda.ppMax}` : '',
        )}` +
          `│ ${formatCell(
            direita ? `  PP ${direita.pp}/${direita.ppMax}` : '',
          )}│`,
      );

      if (i < 2) {
        console.log('├─────────────────────┼─────────────────────┤');
      }
    }

    console.log('└─────────────────────┴─────────────────────┘');
  }

  static exibirVidaPokemon(pokemon, titulo = 'POKEMON') {
    const porcentagem = pokemon.hpAtual / pokemon.hpMax;
    const preenchido = Math.round(
      constants.CONFIG_UI.BARRA_HP_LARGURA * porcentagem,
    );
    const vazio = constants.CONFIG_UI.BARRA_HP_LARGURA - preenchido;

    const barra = '█'.repeat(preenchido) + '░'.repeat(vazio);

    console.log('┌─────────────────────────────┐');
    console.log(`│ ${titulo.padEnd(27)} │`);
    console.log(
      `│ ${pokemon.nome.toUpperCase().padEnd(15)} Lv ${
        pokemon.level ?? 1
      }`.padEnd(30) + '│',
    );
    console.log(
      `│ HP ${barra} ${pokemon.hpAtual}/${pokemon.hpMax}`.padEnd(30) + '│',
    );
    console.log('└─────────────────────────────┘');
  }

  static exibirStarters(starters) {
    starters.forEach((starter, index) => {
      console.log(
        `[${index + 1}] Nome: ${starter.nome} | Tipo: ${starter.tipos.join(
          '/',
        )}`,
      );
    });
  }

  static exibirDestinos(destinos) {
    console.log('\nPara onde deseja ir?\n');
    destinos.forEach((destino, index) => {
      console.log(`[${index + 1}] ${destino.name}`);
    });
  }

  static exibirUsoMovimento(nomePokemon, nomeMovimento) {
    console.log(`
┌─────────────────────────────┐
│ ${nomePokemon.toUpperCase().padEnd(27)} │
│ usou ${nomeMovimento.toUpperCase().padEnd(22)} │
└─────────────────────────────┘
    `);
  }

  static async animarCarregamento(texto, ciclos = 3) {
    return new Promise((resolve) => {
      const frames = ['.', '..', '...'];
      let frameAtual = 0;
      let cicloAtual = 0;

      process.stdout.write(texto);

      const interval = setInterval(() => {
        process.stdout.cursorTo(texto.length);
        process.stdout.clearLine(1);
        process.stdout.write(frames[frameAtual]);

        frameAtual++;
        if (frameAtual === frames.length) {
          frameAtual = 0;
          cicloAtual++;
        }

        if (cicloAtual === ciclos) {
          clearInterval(interval);
          process.stdout.write('\n');
          resolve();
        }
      }, 300);
    });
  }
}
