const cepForm = document.getElementById("cepForm");
const cepInput = document.getElementById("cep");
const buscarBtn = document.getElementById("buscarBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");

const logradouro = document.getElementById("logradouro");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const ddd = document.getElementById("ddd");

cepInput.addEventListener("input", () => {
  let value = cepInput.value.replace(/\D/g, "");

  if (value.length > 5) {
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  }

  cepInput.value = value;
});

cepForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cep = cepInput.value.replace(/\D/g, "");

  limparResultado();

  if (!validarCep(cep)) {
    mostrarMensagem("Digite um CEP válido com 8 números.", "error");
    return;
  }

  try {
    buscarBtn.disabled = true;
    buscarBtn.textContent = "Buscando...";
    mostrarMensagem("Buscando endereço...", "loading");

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      mostrarMensagem("CEP não encontrado. Verifique e tente novamente.", "error");
      return;
    }

    mostrarResultado(data);
    mostrarMensagem("Endereço encontrado com sucesso!", "success");

  } catch (error) {
    mostrarMensagem("Erro ao buscar o CEP. Tente novamente mais tarde.", "error");
  } finally {
    buscarBtn.disabled = false;
    buscarBtn.textContent = "Buscar endereço";
  }
});

function validarCep(cep) {
  return cep.length === 8;
}

function mostrarMensagem(texto, tipo) {
  message.textContent = texto;
  message.className = tipo;
}

function mostrarResultado(data) {
  logradouro.textContent = data.logradouro || "Não informado";
  bairro.textContent = data.bairro || "Não informado";
  cidade.textContent = data.localidade || "Não informado";
  estado.textContent = data.uf || "Não informado";
  ddd.textContent = data.ddd || "Não informado";

  result.classList.add("active");
}

function limparResultado() {
  logradouro.textContent = "-";
  bairro.textContent = "-";
  cidade.textContent = "-";
  estado.textContent = "-";
  ddd.textContent = "-";

  result.classList.remove("active");
  message.textContent = "";
  message.className = "";
}