let modalReservaBootstrap = null;
let modalLoginRequiredBootstrap = null;

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
               data-id="${quarto.id}">
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
  $(document).on("input", "#reserva-cpf", function() {
        let value = $(this).val().replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 9) {
          value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
          value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
        } else if (value.length > 3) {
          value = value.replace(/^(\d{3})(\d{0,3}).*/, "$1.$2");
        }
        $(this).val(value);
    });

  const containerListaQuartos = $("#lista-quartos-container");
  const modalReservaElement = document.getElementById("modalReserva");
  const modalLoginRequiredElement = document.getElementById("modalLoginRequired");

  if (containerListaQuartos.length > 0) {
    renderizarListaQuartos();
  }

  if (modalReservaElement) {
    modalReservaBootstrap = new bootstrap.Modal(modalReservaElement);
  }
  
  if (modalLoginRequiredElement) {
    modalLoginRequiredBootstrap = new bootstrap.Modal(modalLoginRequiredElement);
    
    $("#btn-ir-login").on("click", function() {
        window.location.href = "login.html";
    });
  }

  $(document).on("click", ".btn-reservar", function() {
      const usuarioLogado = sessionStorage.getItem("usuarioLogado");

      if (!usuarioLogado) {
          modalLoginRequiredBootstrap.show();
      } else {
          const quartoId = $(this).data("id");
          const quarto = bancoDeDadosQuartos.find((q) => q.id == quartoId);

          if (quarto) {
              $("#modalReservaLabel").text(`Reservar: ${quarto.nome}`);
              $("#btn-confirmar-reserva").data("id", quartoId);
              $("#modalReserva").data("preco-noite", quarto.precoPorNoite);

              const today = getTodayString();
              $("#checkin-date").val(today).attr("min", today);
              $("#checkout-date").val("").attr("min", today);
              $("#calculo-reserva").addClass("d-none");
              $("#reserva-nome").val("");
              $("#reserva-cpf").val("");

              modalReservaBootstrap.show();
          }
      }
  });

  if (modalReservaElement) {
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
      
      const nomeHospede = $("#reserva-nome").val();
      const cpfHospede = $("#reserva-cpf").val();

      if (!nomeHospede || !cpfHospede) {
        alert("Por favor, preencha o Nome do Hóspede e o CPF.");
        return;
      }

      if (!calculo.valido) {
        alert("Datas inválidas. A data de Check-out deve ser posterior ao Check-in.");
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
        alert("Erro: O quarto já está reservado para este período.");
        return;
      }

      if (quarto) {
        const novaReserva = {
            ...quarto,
            checkin: $("#checkin-date").val(),
            checkout: $("#checkout-date").val(),
            numDiarias: calculo.diarias,
            totalPagar: calculo.total,
            usuario: sessionStorage.getItem("usuarioLogado"),
            
            nomeHospede: nomeHospede,
            cpfHospede: cpfHospede
        };
        
        reservas.push(novaReserva);
        salvarReservas(reservas);

        modalReservaBootstrap.hide();
        
        alert(`Reserva confirmada! Total: ${formatarMoeda(calculo.total)}`);

        const telefone = "5537999939309"; 
        
        const mensagemTexto = `Olá, eu fiz uma reserva e gostaria que comprovasse a reserva em nome de ${nomeHospede} com o cpf ${cpfHospede}, abaixo, siga o comprovante de pagamento da reserva:`;
        
        const textoEncoded = window.encodeURIComponent(mensagemTexto);
        window.open(`https://wa.me/${telefone}?text=${textoEncoded}`, "_blank");
      }
    });
  } 
});
