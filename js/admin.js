// js/admin.js
// Contém toda a lógica específica da página admin.html

let modalQuartoBootstrap;

/**
 * Calcula e exibe as estatísticas (cards) no topo da página.
 */
function atualizarStats() {
    const totalQuartos = bancoDeDadosQuartos.length;
    const disponiveis = bancoDeDadosQuartos.filter(q => q.disponivel).length;
    const ocupados = totalQuartos - disponiveis;

    $('#stat-total-quartos').text(totalQuartos);
    $('#stat-disponiveis').text(disponiveis);
    $('#stat-ocupados').text(ocupados);
}

/**
 * Renderiza a tabela de quartos principal.
 */
function renderizarTabela() {
    const tabelaQuartos = $('#tabela-admin-quartos');
    tabelaQuartos.empty(); 

    // Ordena os quartos pelo ID (número do quarto)
    bancoDeDadosQuartos.sort((a, b) => a.id - b.id);

    bancoDeDadosQuartos.forEach(quarto => {
        const precoFormatado = quarto.precoPorNoite.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        const statusBadge = quarto.disponivel 
            ? '<span class="badge bg-success">Disponível</span>' 
            : '<span class="badge bg-danger">Indisponível</span>';

        const linhaQuarto = `
            <tr data-id="${quarto.id}">
                <td>${quarto.id}</td>
                <td>${quarto.nome}</td>
                <td>${quarto.tipoCama}</td>
                <td>${quarto.capacidade} pessoas</td>
                <td>${precoFormatado}</td>
                <td>${statusBadge}</td>
                <td class="text-center">
                    <button class="btn btn-primary btn-sm btn-alterar" data-id="${quarto.id}" title="Alterar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${quarto.id}" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tabelaQuartos.append(linhaQuarto);
    });

    // ATUALIZA OS CARDS DE STATS SEMPRE QUE A TABELA MUDAR
    atualizarStats();
}

/**
 * Verifica se um ID (número do quarto) já existe.
 */
function idJaExiste(idNovo, idAntigo = null) {
    const idNovoNum = parseInt(idNovo);
    return bancoDeDadosQuartos.some(quarto => {
        if (idAntigo && quarto.id === parseInt(idAntigo)) {
            return false;
        }
        return quarto.id === idNovoNum;
    });
}

// ======================================================
// CÓDIGO A SER EXECUTADO QUANDO A PÁGINA CARREGA
// ======================================================
$(document).ready(function() {
    
    // 1. CARREGA OS DADOS DO LOCALSTORAGE
    carregarDados();

    modalQuartoBootstrap = new bootstrap.Modal('#modalQuarto');

    // 2. Renderiza a tabela e os stats pela primeira vez
    renderizarTabela(); // Esta função agora também chama atualizarStats()

    // 3. Ação: ADICIONAR (Prepara o Modal)
    $('#btnAdicionarQuarto').on('click', function() {
        $('#modalQuartoLabel').text('Adicionar Novo Quarto');
        $('#formQuarto').trigger('reset');
        $('#formQuartoIdAntigo').val(''); 
        $('#formQuartoId').prop('readonly', false); 
        $('#formQuartoId').removeClass('is-invalid'); 
        $('#formQuartoDisponivel').prop('checked', true);
    });

    // 4. Ação: ALTERAR (Prepara o Modal)
    $('#tabela-admin-quartos').on('click', '.btn-alterar', function() {
        const quartoId = $(this).data('id');
        const quarto = bancoDeDadosQuartos.find(q => q.id == quartoId);
        
        if (quarto) {
            $('#modalQuartoLabel').text('Alterar Quarto');
            $('#formQuartoIdAntigo').val(quarto.id); 
            $('#formQuartoId').val(quarto.id); 
            $('#formQuartoId').removeClass('is-invalid'); 

            $('#formQuartoNome').val(quarto.nome);
            $('#formQuartoCamas').val(quarto.tipoCama);
            $('#formQuartoCapacidade').val(quarto.capacidade);
            $('#formQuartoPreco').val(quarto.precoPorNoite);
            $('#formQuartoImagem').val(quarto.imagem);
            $('#formQuartoDisponivel').prop('checked', quarto.disponivel);
            
            modalQuartoBootstrap.show();
        }
    });

    // 5. Ação: SALVAR (Dentro do Modal)
    $('#btnSalvarQuarto').on('click', function() {
        const idAntigo = $('#formQuartoIdAntigo').val();
        const idNovo = $('#formQuartoId').val();
        
        if (!idNovo) {
            alert('O Número do Quarto (ID) é obrigatório.');
            return;
        }

        if (idJaExiste(idNovo, idAntigo)) {
            $('#formQuartoId').addClass('is-invalid');
            return; 
        }
        
        $('#formQuartoId').removeClass('is-invalid');

        const dadosQuarto = {
            id: parseInt(idNovo), 
            nome: $('#formQuartoNome').val(),
            tipoCama: $('#formQuartoCamas').val(),
            capacidade: parseInt($('#formQuartoCapacidade').val()),
            precoPorNoite: parseFloat($('#formQuartoPreco').val()),
            imagem: $('#formQuartoImagem').val(),
            disponivel: $('#formQuartoDisponivel').is(':checked')
        };

        if (idAntigo) {
            // MODO DE EDIÇÃO
            const index = bancoDeDadosQuartos.findIndex(q => q.id == idAntigo);
            if (index !== -1) {
                bancoDeDadosQuartos[index] = dadosQuarto; 
            }
        } else {
            // MODO DE ADIÇÃO
            bancoDeDadosQuartos.push(dadosQuarto);
        }

        salvarDados(); // Salva no localStorage
        modalQuartoBootstrap.hide();
        renderizarTabela(); // Recarrega a tabela e os stats
    });

    // 6. Ação: EXCLUIR
    $('#tabela-admin-quartos').on('click', '.btn-excluir', function() {
        const quartoId = $(this).data('id');
        
        if (confirm('Tem certeza que deseja excluir o quarto nº ' + quartoId + '?')) {
            const index = bancoDeDadosQuartos.findIndex(q => q.id == quartoId);
            if (index !== -1) {
                bancoDeDadosQuartos.splice(index, 1);
                
                salvarDados(); // Salva no localStorage
                renderizarTabela(); // Recarrega a tabela e os stats
            }
        }
    });

});