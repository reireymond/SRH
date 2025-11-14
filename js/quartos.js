let modalReservaBootstrap = null;

function renderizarListaQuartos() {
  const container = $("#lista-quartos-container");
  container.empty();

  if (bancoDeDadosQuartos.length === 0) {
    container.html(
      '<p class="text-center col-12">Nenhum quarto encontrado.</p>'
    );
    return;
  }

  bancoDeDadosQuartos.forEach((quarto) => {
    const precoFormatado = quarto.precoPorNoite.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    const cardHtml = `
      <div class="col">
        <div class="card h-100">
          <img src="${quarto.imagem}" class="card-img-top" alt="${quarto.nome}">
          <div class="card-body">
            <h5 class="card-title">${quarto.nome}</h5>
            <p class="card-text mb-2">
              <i class="bi bi-people"></i> ${quarto.capacidade} Pessoas
            </p>
            <p class="card-text">
              <i class="bi bi-bed"></i> ${quarto.tipoCama}
            </p>
          </div>
          <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
            <div>
              <span class="fs-5 fw-bold text-primary">${precoFormatado}</span>
            </div>
            
            <button 
               class="btn btn-primary btn-reservar"
               data-id="${quarto.id}"
               data-bs-toggle="modal"
               data-bs-target="#modalReserva">
              Reservar
            </button>

          </div>
        </div>
      </div>
    `;

    container.append(cardHtml);
  });
}


function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}

function calcularTotalReserva() {
  const checkinStr = $("#checkin-date").val();
  const checkoutStr = $("#checkout-date").val();
  const precoPorNoite = $("#modalReserva").data("preco-noite");
  const containerCalculo = $("#calculo-reserva");

  if (!checkinStr || !checkoutStr || !precoPorNoite) {
    containerCalculo.addClass("d-none");
    return { diarias: 0, total: 0, valido: false };
  }

  const checkin = new Date(checkinStr + "T00:00:00");
  const checkout = new Date(checkoutStr + "T00:00:00");

  if (checkout <= checkin) {
    containerCalculo.addClass("d-none");
    return { diarias: 0, total: 0, valido: false };
  }

  const diffTime = Math.abs(checkout - checkin);
  const diarias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const total = diarias * precoPorNoite;

  $("#total-diarias").text(diarias);
  $("#valor-total").text(formatarMoeda(total));
  containerCalculo.removeClass("d-none");

  return { diarias: diarias, total: total, valido: true };
}

$(document).ready(function () {
  
  const containerListaQuartos = $("#lista-quartos-container");
  const modalReservaElement = document.getElementById("modalReserva");

  if (containerListaQuartos.length > 0) {
    renderizarListaQuartos();
  }

  if (modalReservaElement) {
    
    modalReservaBootstrap = new bootstrap.Modal("#modalReserva");

    modalReservaElement.addEventListener("show.bs.modal", function (event) {
      const button = $(event.relatedTarget);
      const quartoId = button.data("id");
      const quarto = bancoDeDadosQuartos.find((q) => q.id == quartoId);

      $("#modalReservaLabel").text(`Reservar: ${quarto.nome}`);
      $("#btn-confirmar-reserva").data("id", quartoId);
      $("#modalReserva").data("preco-noite", quarto.precoPorNoite);

      const today = getTodayString();
      $("#checkin-date").val(today).attr("min", today);
      $("#checkout-date").val("").attr("min", today);
      $("#calculo-reserva").addClass("d-none");
    });

    $("#checkin-date, #checkout-date").on("change", function () {
      if ($("#checkin-date").val()) {
        $("#checkout-date").attr("min", $("#checkin-date").val());
      }
      calcularTotalReserva();
    });

    $("#btn-confirmar-reserva").on("click", function () {
      const quartoId = $(this).data("id");
      const quarto = bancoDeDadosQuartos.find((q) => q.id == quartoId);
      const calculo = calcularTotalReserva();

      if (!calculo.valido) {
        alert(
          "Datas inválidas. A data de Check-out deve ser posterior ao Check-in."
        );
        return;
      }

      const checkinNovo = new Date($("#checkin-date").val() + "T00:00:00");
      const checkoutNovo = new Date($("#checkout-date").val() + "T00:00:00");

      const reservas = carregarReservas();
      const reservasDoQuarto = reservas.filter((r) => r.id == quartoId);

      const temConflito = reservasDoQuarto.some((reserva) => {
        const checkinReserva = new Date(reserva.checkin + "T00:00:00");
        const checkoutReserva = new Date(reserva.checkout + "T00:00:00");

        return checkinNovo < checkoutReserva && checkoutNovo > checkinReserva;
      });

      if (temConflito) {
        alert(
          "Erro: O quarto já está reservado para este período. Por favor, escolha outras datas."
        );
        return;
      }

      if (quarto) {
        quarto.checkin = $("#checkin-date").val();
        quarto.checkout = $("#checkout-date").val();
        quarto.numDiarias = calculo.diarias;
        quarto.totalPagar = calculo.total;
        quarto.usuario = sessionStorage.getItem("usuarioLogado");
        reservas.push(quarto);
        salvarReservas(reservas);

        modalReservaBootstrap.hide();
        alert(
          `Reserva confirmada! Total de ${calculo.diarias} diárias: ${formatarMoeda(
            calculo.total
          )}`
        );
      }
    });
  } 
});