import * as personagemStorage from '../storage/personagens.storage.js';
import * as personagensService from '../personagens/personagens.js';
export class GerenciadorPersonagens {
  constructor() {
    this.personagens = personagemStorage.carregarPersonagens();
    this.personagemAtual = null;
  }

  obterOuCriarPersonagem() {
    if (this.personagens.length === 0) {
      console.log('Nenhum personagem encontrado. Crie um para começar!');
      this.criarNovoPersonagem();
    }

    this.personagemAtual = this.personagemAtual || this.personagens[0];
    return this.personagemAtual;
  }

  criarNovoPersonagem() {
    console.log('\n✨ Criando novo personagem...\n');
    const novoPersonagem = personagensService.criarPersonagem(this.personagens);
    personagemStorage.salvarPersonagem(novoPersonagem);
    this.personagens = personagemStorage.carregarPersonagens();
    return novoPersonagem;
  }

  trocarPersonagem() {
    console.log('\n🔄 Trocando personagem...\n');
    const personagemEscolhido = personagemStorage.trocarPersonagem();

    if (personagemEscolhido) {
      this.personagemAtual = personagemEscolhido;
    }

    return this.personagemAtual;
  }

  salvarPersonagem(personagem) {
    personagemStorage.salvarPersonagem(personagem);
  }
  excluirPersonagem() {
    const mensagem = personagemStorage.excluirPersonagem();
    console.log(mensagem);
    this.personagens = personagemStorage.carregarPersonagens();

    const personagemExiste = this.personagens.find(
      (p) => p.id === this.personagemAtual?.id,
    );
    if (!personagemExiste) {
      this.personagemAtual = this.personagens[0] || null;
    }
  }
}
