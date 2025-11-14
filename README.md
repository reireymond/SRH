# Sistema de Gerenciamento e Reserva de Hotel

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellowgreen)
![Linguagem](https://img.shields.io/badge/WEB-HTML%20CSS%20JS-blue.svg)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

> Projeto acadêmico da disciplina de Desenvolvimento WEB do IFMG - Campus Formiga. Um trabalho FrontEnd para ver, apreçar e reservar quartos em Hoteis e Pousadas, desenvolvido em HTML, CSS e JavaScript.

---

## 📖 Sobre o Projeto

O **SRH** é um sistema de front-end para o **Hotel Fênix**. O projeto foi dividido em duas partes principais:

1.  **Área do Cliente:** Onde os usuários podem navegar pelo site, ver informações, quartos, fazer simulação de reservas e login.
2.  **Área Administrativa:** Um painel para o gerente do hotel adicionar, editar, remover os quartos disponíveis e gerenciar mensagens/reservas.

Todo o projeto foi construído usando **HTML, CSS e JavaScript**, com **Bootstrap** como framework principal. Os dados são salvos no navegador usando **localStorage** e **sessionStorage**.

## 🚀 Funcionalidades Implementadas

* **Tema Unificado:** Todo o site (`main.html`, `admin.html`) segue a paleta de cores (vermelho escuro e bege) da tela de login.
* **Sistema de Login:** A página `index.html` verifica os usuários:
    * Redireciona para `admin.html` se o login for `admin`/`fenix`.
    * Redireciona para `main.html` se o login for `kaua`/`123` ou `camily`/`123`.
    * Mostra uma mensagem de erro estilizada se o login falhar.
* **Controle de Sessão:** A `main.html` detecta se o usuário está logado (via `sessionStorage`) e troca o botão "Login" por "Sair".
* **Páginas de Simulação:** Telas de "Criar Conta" e "Esqueci a Senha" conceituais.
* **Menu de Navegação do Cliente (Melhoria):** A barra lateral (Offcanvas), presente nas páginas do cliente, agora fecha de forma consistente e suave ao navegar para outras seções (`main.html`) ou páginas (`quartos.html`, `minhasReservas.html`), garantindo usabilidade aprimorada.
* **Dashboard do Admin:**
    * Layout profissional com barra lateral fixa.
    * Cards de estatísticas (Total, Disponíveis, Ocupados) que se atualizam sozinhos.
    * Gerenciamento de quartos (CRUD) que abre um pop-up (Modal) para Adicionar, Alterar e Excluir quartos.
* **Persistência de Dados:** Os quartos, reservas e mensagens de contato são salvos no `localStorage` do navegador, então as mudanças feitas pelo admin são permanentes (no navegador).
* **Homepage do Cliente:** Exibe os 3 quartos disponíveis mais recentes carregados do "banco de dados".

## 💻 Como Executar

1.  Clone este repositório:
    ```
    git clone https://github.com/reireymond/SRH.git
    ```
2.  Abra o arquivo `index.html` no seu navegador.
3.  Use um dos logins abaixo para testar:
    * **Admin:** `usuario: admin` / `senha: fenix`
    * **Cliente:** `usuario: kaua` / `senha: 123`

## 📂 Estrutura de Arquivos

* `index.html`: (Tela de Login)
* `main.html`: (Home do Cliente)
* `admin.html`: (Dashboard Admin)
* `criarConta.html`: (Simulação)
* `esqueciSenha.html`: (Simulação)
* `css/`
    * `login.css`: (Estilo do Login)
    * `global.css`: (Tema principal do Bootstrap)
    * `main.css`: (Estilos da home)
    * `admin.css`: (Estilos do dashboard)
* `js/`
    * `login.js`: (Lógica de autenticação)
    * `bancoDeDados.js`: (Funções `salvarDados`, `carregarDados` e dados iniciais)
    * `admin.js`: (Lógica do dashboard, CRUD, modais)
    * `main.js`: (Lógica da home, exibe quartos, botão Sair, Controle do Offcanvas)
    * `quartos.js`: (Lógica de listagem de quartos e reservas)
* `img/`: (Imagens dos quartos e banner)
* `images/`: (Imagens do login e logo)

---

## 👤 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/reireymond">
        <img src="https://github.com/reireymond.png?size=100" width="100px;" alt="Foto de Kaua Teixeira Nascimento no GitHub"/>
        <br />
        <sub>
          <b>Kaua Teixeira N.</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/CamilyLeal">
        <img src="https://github.com/CamilyLeal.png?size=100" width="100px;" alt="Foto de Camily Leal Silva no GitHub"/>
        <br />
        <sub>
          <b>Camily Leal S.</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

> Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
