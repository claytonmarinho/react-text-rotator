# Spec de Design: Redesign Major (v2.0.0) — react-text-rotator

**Data**: 2026-08-31  
**Autor**: Clayton Marinho & Antigravity  
**Repositório**: `claytonmarinho/react-text-rotator`  
**Status**: Aprovado  

---

## 1. Visão Geral & Objetivos

O `react-text-rotator` é uma biblioteca React popular para rotacionar textos com animações CSS. O objetivo desta versão major (v2.0.0) é modernizar a infraestrutura, expandir os recursos de renderização para atender aos forks e issues da comunidade, corrigir bugs críticos de gerenciamento de timers/memory leaks e unificar a documentação de instruções para agentes de IA.

### Objetivos Principais:
1. **Modernização do Stack**: Migrar para **TypeScript**, **tsup** (compilação rápida ESM/CJS/types) e garantir suporte total ao **React 18 e React 19**.
2. **Atualização de Dependências**: Atualizar devDependencies e resolver/fechar os PRs abertos pelo Dependabot (#43 ao #57).
3. **Conteúdo Rico & Custom Render**: Permitir renderização de nó React (`ReactNode`), HTML/JSX customizado, links avançados e custom render functions (incorporando soluções dos forks `MTyson`, `daynedaniell`, `aidanwhiteley` e Issue #25).
4. **Correção de Bugs Críticos**: Corrigir o vício de curto-circuito no cleanup do `useRotator` que causava vazamento de memória (Issue #58) e desincronização de timers (Issue #50).
5. **Integração com `react-doctor`**: Adicionar `npx react-doctor` no script do projeto (`npm run doctor`) e instruir agentes a utilizá-lo para auditoria contínua de performance e padrões React 19.
6. **Fonte Única de Instruções para IAs (`AGENTS.md`)**: Criar `AGENTS.md` como arquivo canônico de instruções para agentes (Claude, Antigravity, OpenCode, Copilot, etc.), mantendo ponteiros leves (`CLAUDE.md`, `OPENCODE.md`, `COPILOT.md`, `AGY.md`) e atualizando o PR #59.

---

## 2. Arquitetura & Infraestrutura de Build

### 2.1 Tooling & Pacotes
* **Build System**: Substituir Webpack 5 / Babel por `tsup` na raiz da biblioteca.
* **Formatos de Compilação (`dist/`)**:
  * `dist/index.js` (CommonJS)
  * `dist/index.mjs` (ES Modules)
  * `dist/index.d.ts` (Declaração de Tipos TypeScript)
* **`peerDependencies`**:
  ```json
  {
    "peerDependencies": {
      "react": "^18.0.0 || ^19.0.0",
      "react-dom": "^18.0.0 || ^19.0.0",
      "react-transition-group": "^4.4.0"
    }
  }
  ```
* **Limpeza de Dependências Obsoletas**: Remoção de `prop-types` e `defaultProps` em favor de default params nativos do TypeScript e interfaces tipadas.

### 2.2 Scripts do `package.json`
```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "doctor": "npx react-doctor@latest",
    "lint": "eslint src tests",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 3. API do Componente & Interfaces TypeScript

### 3.1 Definição das Interfaces (`src/types.ts`)

```typescript
import React from 'react';

export interface RotatorItem {
  /** Texto simples a ser exibido */
  text?: string;
  /** Conteúdo React genérico (JSX, elementos complexos, ícones) */
  children?: React.ReactNode;
  /** URL para transformar o item em link */
  link?: string;
  /** Target do link (ex: '_blank', '_self') */
  target?: string;
  /** Classe CSS específica para o item */
  className?: string;
  /** Estilos inline específicos para o item */
  style?: React.CSSProperties;
  /** Nome da animação (ex: 'fade', 'zoom', 'squeeze') */
  animation?: 'fade' | 'zoom' | 'squeeze' | string;
  /** Função de renderização customizada recebendo o item e índice */
  render?: (item: RotatorItem, index: number) => React.ReactNode;
}

export interface TextRotatorProps {
  /** Array de strings simples ou objetos RotatorItem */
  content: Array<string | RotatorItem>;
  /** Tempo de exibição de cada item em milissegundos (padrão: 2500ms) */
  time?: number;
  /** Atraso inicial antes da primeira rotação em milissegundos (padrão: 250ms) */
  startDelay?: number;
  /** Duração da transição CSS em milissegundos (padrão: 500ms) */
  transitionTime?: number;
  /** Classe CSS do container div */
  className?: string;
  /** Estilo inline do container div */
  style?: React.CSSProperties;
  /** Se a rotação automática deve ser iniciada (padrão: true) */
  autoPlay?: boolean;
  /** Callback disparado quando o item exibido muda */
  onItemChange?: (item: RotatorItem | string, index: number) => void;
}

export interface UseRotatorOptions {
  content: Array<string | RotatorItem>;
  time?: number;
  startDelay?: number;
  transitionTime?: number;
  autoPlay?: boolean;
  onItemChange?: (item: RotatorItem | string, index: number) => void;
}

export interface UseRotatorReturn {
  isEntered: boolean;
  currentIndex: number;
  currentItem: RotatorItem | string | undefined;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}
```

### 3.2 Componente `TextRotator` (`src/index.tsx`)
* Recebe `content` e normaliza itens (transformando strings em `RotatorItem`).
* Renderiza com `<Transition>` do `react-transition-group`.
* Suporta renderização condicional: se o item possui `render`, executa a função; se possui `children`, exibe `children`; se possui `link`, envolve em `<a>`; caso contrário renderiza `text`.

---

## 4. Correção de Bugs & Gerenciamento Seguro de Timers

### 4.1 Resolução do Vazamento de Memória (`useRotator.ts`)
Substituição da sintaxe com curto-circuito por uma rotina de limpeza explícita baseada em `useRef`:

```typescript
const itemTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const itemIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const displayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const clearAllTimers = () => {
  if (itemTimeoutRef.current) {
    clearTimeout(itemTimeoutRef.current);
    itemTimeoutRef.current = null;
  }
  if (itemIntervalRef.current) {
    clearInterval(itemIntervalRef.current);
    itemIntervalRef.current = null;
  }
  if (displayTimeoutRef.current) {
    clearTimeout(displayTimeoutRef.current);
    displayTimeoutRef.current = null;
  }
};
```

### 4.2 Pausa por Visibilidade (`visibilitychange`)
Adicionado listener no `document` para pausar a rotação quando a página/aba for ocultada (`document.hidden`), evitando estouro de timers e acúmulo de renderizações no React.

---

## 5. Auditoria de Qualidade com `react-doctor`

* Adicionado o pacote/script `npx react-doctor@latest` no repositório (`npm run doctor`).
* O `react-doctor` será executado após qualquer alteração no código do componente/hook para detectar:
  * Anti-padrões de renderização do React 19
  * Uso incorreto ou ausência de dependências em `useEffect`
  * Vazamentos de escopo de estado
  * Desempenho e alocação desnecessária de objetos em render

---

## 6. Fonte Única de Instruções para Agentes de IA (`AGENTS.md`)

### 6.1 Estrutura do `AGENTS.md`
O arquivo `AGENTS.md` na raiz do projeto conterá:
1. **Visão Geral da Biblioteca**: Finalidade do pacote, exportações, modos de build (`tsup`).
2. **Comandos de Desenvolvedor**: `npm run build`, `npm test`, `npm run doctor`, `npm run lint`, `npm run typecheck`.
3. **Instruções Obrigatórias para Agentes**:
   * Sempre rodar `npm run doctor` e `npm test` antes de considerar uma tarefa concluída.
   * Respeitar os tipos TypeScript sem uso de `any`.
   * Manter compatibilidade com React 18 e React 19.
4. **Ponteiros de Arquivo**:
   * `CLAUDE.md` -> Aponta para `AGENTS.md`
   * `OPENCODE.md` -> Aponta para `AGENTS.md`
   * `COPILOT.md` -> Aponta para `AGENTS.md`
   * `AGY.md` -> Aponta para `AGENTS.md`

### 6.2 Resolução do PR #59
O PR #59 (`docs/claude-md`) será atualizado com a adição do `AGENTS.md` como arquivo canônico e os arquivos ponteiros apontando para ele.

---

## 7. Plano de Verificação & Testes

1. **Testes Unitários (Jest)**:
   * Testes para rotação de texto simples.
   * Testes para `RotatorItem` com `children`, `link`, `render` function e estilos customizados.
   * Testes de unmount verificando a limpeza total de timers sem warnings.
2. **Auditoria `react-doctor`**:
   * Executar `npm run doctor` e garantir 0 erros e 0 alertas críticos.
3. **Build & Demostração**:
   * Executar `npm run build` e validar arquivos emitidos em `dist/`.
   * Executar a aplicação em `demo/` atualizada para React 19 e testar visualmente no navegador.
