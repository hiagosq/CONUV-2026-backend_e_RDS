const API_URL = "http://localhost:8080/salgados";

const form = document.getElementById("formSalgado");
const inputId = document.getElementById("salgadoId");
const inputNome = document.getElementById("nome");
const inputCategoria = document.getElementById("categoria");
const inputCusto = document.getElementById("custoUnitario");
const inputPreco = document.getElementById("precoVenda");
const inputEstoque = document.getElementById("quantidadeEstoque");
const resumoMargem = document.getElementById("resumoMargem");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnCancelar = document.getElementById("btnCancelar");
const filtroBusca = document.getElementById("filtroBusca");
const corpoTabela = document.getElementById("corpoTabelaSalgados");
const feedback = document.getElementById("mensagemFeedback");

let salgadosCache = [];

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function mostrarFeedback(texto, tipo = "sucesso") {
  feedback.textContent = texto;
  feedback.className = `feedback feedback--${tipo}`;
}

function limparFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
}

function atualizarResumoMargem() {
  const custo = Number.parseFloat(inputCusto.value) || 0;
  const venda = Number.parseFloat(inputPreco.value) || 0;
  const lucro = venda - custo;
  const percentual = venda > 0 ? (lucro / venda) * 100 : 0;

  resumoMargem.innerHTML = `Lucro unitário estimado: <strong>${formatarMoeda(lucro)}</strong> (${percentual.toFixed(1)}%)`;
}

function limparFormulario() {
  form.reset();
  inputId.value = "";
  tituloFormulario.textContent = "Novo Salgado";
  atualizarResumoMargem();
}

function renderizarTabela(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    corpoTabela.innerHTML = `<tr><td colspan="6" class="tabela-vazia">Nenhum salgado encontrado.</td></tr>`;
    return;
  }

  corpoTabela.innerHTML = lista
    .map(
      (item) => `
      <tr>
        <td><strong>${item.nome ?? ""}</strong></td>
        <td>${item.categoria ?? "-"}</td>
        <td>${formatarMoeda(item.custoUnitario)}</td>
        <td>${formatarMoeda(item.precoVenda)}</td>
        <td>${item.quantidadeEstoque ?? 0} un.</td>
        <td>
          <button type="button" class="btn btn--acao" onclick="prepararEdicao(${item.id})">Editar</button>
          <button type="button" class="btn btn--acao btn--perigo" onclick="excluirSalgado(${item.id})">Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function carregarSalgados() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }
    salgadosCache = await resposta.json();
    aplicarFiltro();
  } catch (erro) {
    corpoTabela.innerHTML = `<tr><td colspan="6" class="tabela-vazia">Não foi possível carregar os salgados.</td></tr>`;
    mostrarFeedback(`Falha ao buscar dados em ${API_URL}: ${erro.message}`, "erro");
  }
}

function aplicarFiltro() {
  const termo = filtroBusca.value.trim().toLowerCase();
  if (!termo) {
    renderizarTabela(salgadosCache);
    return;
  }

  const filtrados = salgadosCache.filter(
    (s) =>
      String(s.nome || "").toLowerCase().includes(termo) ||
      String(s.categoria || "").toLowerCase().includes(termo)
  );
  renderizarTabela(filtrados);
}

window.prepararEdicao = function (id) {
  const salgado = salgadosCache.find((item) => item.id === id);
  if (!salgado) return;

  inputId.value = salgado.id;
  inputNome.value = salgado.nome ?? "";
  inputCategoria.value = salgado.categoria ?? "";
  inputCusto.value = salgado.custoUnitario ?? 0;
  inputPreco.value = salgado.precoVenda ?? 0;
  inputEstoque.value = salgado.quantidadeEstoque ?? 0;
  tituloFormulario.textContent = `Editando #${salgado.id}`;
  atualizarResumoMargem();
  limparFeedback();
  inputNome.focus();
};

window.excluirSalgado = async function (id) {
  if (!confirm("Deseja realmente excluir este salgado?")) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }
    mostrarFeedback("Salgado removido com sucesso.");
    await carregarSalgados();
  } catch (erro) {
    mostrarFeedback(`Erro ao excluir salgado: ${erro.message}`, "erro");
  }
};

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limparFeedback();

  const custoUnitario = Number.parseFloat(inputCusto.value);
  const precoVenda = Number.parseFloat(inputPreco.value);
  const quantidadeEstoque = Number.parseInt(inputEstoque.value, 10);

  if (
    Number.isNaN(custoUnitario) ||
    Number.isNaN(precoVenda) ||
    Number.isNaN(quantidadeEstoque)
  ) {
    mostrarFeedback("Preencha custo, preço de venda e estoque com números válidos.", "erro");
    return;
  }

  const payload = {
    nome: inputNome.value.trim(),
    categoria: inputCategoria.value,
    custoUnitario,
    precoVenda,
    quantidadeEstoque,
  };

  const id = inputId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  try {
    const resposta = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    mostrarFeedback(id ? "Salgado atualizado com sucesso." : "Salgado cadastrado com sucesso.");
    limparFormulario();
    await carregarSalgados();
  } catch (erro) {
    mostrarFeedback(`Erro ao salvar salgado: ${erro.message}`, "erro");
  }
});

btnCancelar.addEventListener("click", () => {
  limparFormulario();
  limparFeedback();
});

inputCusto.addEventListener("input", atualizarResumoMargem);
inputPreco.addEventListener("input", atualizarResumoMargem);
filtroBusca.addEventListener("input", aplicarFiltro);

carregarSalgados();