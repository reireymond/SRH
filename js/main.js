let sidebarInfoInstance = null;

function verificarLogin() {
  const usuario = sessionStorage.getItem("usuarioLogado");
  const btnLoginLogout = $("#btn-login-logout");

  if (usuario) {
    btnLoginLogout.html('<i class="bi bi-box-arrow-right"></i> Sair');
    btnLoginLogout.attr("href", "#");
    btnLoginLogout.on("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("usuarioLogado");
      window.location.href = "../index.html";
    });
  } else {
    btnLoginLogout.html('<i class="bi bi-person-circle"></i> Login');
    btnLoginLogout.attr("href", "../index.html");
  }
}

function validacaoFormularioContato() {
  const forms = document.querySelectorAll("#form-contato.needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();

          const nome = $("#contato-nome").val();
          const email = $("#contato-email").val();
          const msg = $("#contato-msg").val();
          const novaMensagem = {
            nome: nome,
            email: email,
            mensagem: msg,
            data: new Date().toLocaleString("pt-BR"),
          };

          const mensagens =
            JSON.parse(localStorage.getItem("hotelFenixMensagens")) || [];
          mensagens.push(novaMensagem);
          localStorage.setItem(
            "hotelFenixMensagens",
            JSON.stringify(mensagens)
          );

          alert("Mensagem enviada com sucesso! (Simulação)");
          form.classList.remove("was-validated");
          form.reset();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
}

$(document).ready(function () {
  verificarLogin();

  if ($("#form-contato").length > 0) {
    validacaoFormularioContato();
  }

  const container = $("#featured-rooms-container");
  if (container.length > 0) {
    const quartosDestaque = bancoDeDadosQuartos
      .filter((q) => q.disponivel)
      .slice(0, 3);

    if (quartosDestaque.length === 0) {
      container.html(
        '<p class="text-center col-12">Nenhum quarto disponível no momento.</p>'
      );
    } else {
      quartosDestaque.forEach((quarto) => {
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
                <span class="fs-5 fw-bold text-primary">${precoFormatado}</span>
                <a href="quartos.html" class="btn btn-primary">Reservar</a>
              </div>
            </div>
          </div>
        `;
        container.append(cardHtml);
      });
    }
  }

  const sidebarElement = document.getElementById('sidebarInfo');
  if (sidebarElement) {
    sidebarInfoInstance = new bootstrap.Offcanvas(sidebarElement);
  }

  $('#sidebarInfo .nav-link[href^="#"]').on('click', function(e) {
    const targetId = $(this).attr('href');
    const targetElement = $(targetId);
    
    if (targetElement.length) { 
      e.preventDefault(); 
      
      $('html, body').animate({
        scrollTop: targetElement.offset().top - 56 
      }, 500);
      
      if (sidebarInfoInstance) {
        sidebarInfoInstance.hide();
      }
    }
  });
});

function initMap() {
  if ($("#mapa").length > 0) {
    const localizacaoHotel = { lat: -20.4663, lng: -45.4287 };

    const mapa = new google.maps.Map(document.getElementById("mapa"), {
      zoom: 15,
      center: localizacaoHotel,
    });

    const marker = new google.maps.Marker({
      position: localizacaoHotel,
      map: mapa,
      title: "Hotel Fênix",
    });
  }
}