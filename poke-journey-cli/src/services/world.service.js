import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function carregarMundo(regiao) {
  const regiaoInicial = regiao.toLowerCase();

  const caminho = path.join(
    __dirname,
    '../data/worlds',
    `${regiaoInicial}.world.json`
  );

  if (!fs.existsSync(caminho)) {
    throw new Error(`Região não encontrada: ${regiaoInicial}`);
  }

  const data = fs.readFileSync(caminho, 'utf-8');
  return JSON.parse(data);
}
