const dadosIniciaisQuartos = [
  {
    id: 101,
    nome: "Quarto Casal",
    tipoCama: "1 Cama de Casal",
    capacidade: 2,
    precoPorNoite: 250.0,
    imagem: "../img/QuartoCasal.jpg",
    disponivel: true,
  },
  {
    id: 102,
    nome: "Quarto Solteiro",
    tipoCama: "1 Cama de Solteiro",
    capacidade: 1,
    precoPorNoite: 120.0,
    imagem: "../img/QuartoSolteiro.jpg",
    disponivel: true,
  },
  {
    id: 201,
    nome: "Quarto Duplo",
    tipoCama: "2 Camas Solteiro",
    capacidade: 2,
    precoPorNoite: 220.0,
    imagem: "../img/Quarto2Solteiro.jpg",
    disponivel: false,
  },
  {
    id: 202,
    nome: "Quarto Familia",
    tipoCama: "1 Cama Casal, 2 Camas Solteiro",
    capacidade: 4,
    precoPorNoite: 450.0,
    imagem: "../img/QuartoFamilia.jpg",
    disponivel: true,
  },
  {
    id: 301,
    nome: "Quarto Luxo",
    tipoCama: "1 Cama King Size",
    capacidade: 2,
    precoPorNoite: 750.0,
    imagem: "../img/QuartoLuxoCasal.jpg",
    disponivel: true,
  },
];

let bancoDeDadosQuartos = [];

function salvarDados() {
  localStorage.setItem(
    "hotelFenixQuartos",
    JSON.stringify(bancoDeDadosQuartos)
  );
}

function carregarDados() {
  const dadosSalvos = localStorage.getItem("hotelFenixQuartos");

  if (dadosSalvos) {
    bancoDeDadosQuartos = JSON.parse(dadosSalvos);
  } else {
    bancoDeDadosQuartos = dadosIniciaisQuartos;
    salvarDados();
  }
}

function carregarReservas() {
  const dados = localStorage.getItem("hotelFenixReservas");
  return dados ? JSON.parse(dados) : [];
}

function salvarReservas(reservas) {
  localStorage.setItem("hotelFenixReservas", JSON.stringify(reservas));
}

carregarDados();