import readlineSync from 'readline-sync';
import * as constants from '../constants/constants.js';
export class ValidacaoService {
  static validarOpcaoMenu(opcao, minimo = 0, maximo = 5) {
    return opcao >= minimo && opcao <= maximo;
  }

  static solicitarOpcaoValida(mensagem, minimo, maximo) {
    let opcao;
    do {
      opcao = readlineSync.questionInt(mensagem);
      if (!this.validarOpcaoMenu(opcao, minimo, maximo)) {
        console.log(constants.MENSAGENS.OPCAO_INVALIDA);
      }
    } while (!this.validarOpcaoMenu(opcao, minimo, maximo));
    return opcao;
  }
}
