const API_URL = 'http://localhost:8080/agendamentos';
const API_MEDICOS_URL = 'http://localhost:8080/medicos';

// Referências dos elementos do HTML
const tabelaCorpo = document.getElementById('tabelaConsultasCorpo');
const inputBusca = document.getElementById('inputBusca');
const modal = document.getElementById('modalConsulta');
const modalBody = document.getElementById('modalBody');

let listaConsultasCompleta = []; // Guarda todas as consultas trazidas do banco
let listaMedicosCompleta = [];    // Guarda a lista de médicos para preencher o select do modal
let consultaSelecionadaId = null;

// 1. Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    await carregarMedicos(); // Carrega os médicos em segundo plano para uso no modal
    await buscarTodasConsultas();

    // Configura o filtro de digitação em tempo real (Paciente ou Médico)
    inputBusca.addEventListener('input', filtrarPorTexto);
});

// 2. Buscar todas as consultas do Backend
async function buscarTodasConsultas() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            listaConsultasCompleta = await response.json();
            renderizarTabela(listaConsultasCompleta);
        } else {
            tabelaCorpo.innerHTML = `<tr><td colspan="7" class="no-data">Erro ao carregar agendamentos.</td></tr>`;
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        tabelaCorpo.innerHTML = `<tr><td colspan="7" class="no-data">Não foi possível conectar ao servidor.</td></tr>`;
    }
}

// 3. Buscar médicos (para alimentar o Select do modal)
async function carregarMedicos() {
    try {
        const response = await fetch(API_MEDICOS_URL);
        if (response.ok) {
            listaMedicosCompleta = await response.json();
        }
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
    }
}

// 4. Filtrar Consultas por Período de Datas (Vinculado ao botão do HTML)
async function filtrarConsultas() {
    const inicio = document.getElementById('dataInicio').value;
    const fim = document.getElementById('dataFim').value;

    if (!inicio || !fim) {
        alert('Por favor, selecione as datas Inicial e Final para filtrar.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/filtro-data?inicio=${inicio}&fim=${fim}`);
        if (response.ok) {
            listaConsultasCompleta = await response.json();
            renderizarTabela(listaConsultasCompleta);
        } else {
            alert('Erro ao filtrar consultas por período.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// 5. Filtrar na barra de busca por digitação (Paciente ou Médico)
function filtrarPorTexto() {
    const termo = inputBusca.value.toLowerCase().trim();

    const filtradas = listaConsultasCompleta.filter(consulta => {
        const nomePaciente = consulta.nomePaciente ? consulta.nomePaciente.toLowerCase() : '';
        const nomeMedico = consulta.medico && consulta.medico.nome ? consulta.medico.nome.toLowerCase() : '';

        return nomePaciente.includes(termo) || nomeMedico.includes(termo);
    });

    renderizarTabela(filtradas);
}

// 6. Renderizar as linhas na Tabela Dinamicamente
function renderizarTabela(consultas) {
    if (consultas.length === 0) {
        tabelaCorpo.innerHTML = `<tr><td colspan="7" class="no-data">Nenhum agendamento encontrado.</td></tr>`;
        return;
    }

    tabelaCorpo.innerHTML = ''; // Limpa a tabela

    consultas.forEach(consulta => {
        const tr = document.createElement('tr');

        // Formatação de data padrão Brasil (dd/mm/aaaa)
        const dataFormatada = consulta.data ? consulta.data.split('-').reverse().join('/') : '-';
        // Corta os segundos do LocalTime se necessário (ex: 14:30:00 -> 14:30)
        const horaFormatada = consulta.hora ? consulta.hora.substring(0, 5) : '-';

        tr.innerHTML = `
            <td><strong>${consulta.nomePaciente}</strong></td>
            <td>Dr(a). ${consulta.medico ? consulta.medico.nome : 'Não informado'}</td>
            <td><span class="badge-especialidade">${consulta.medico ? consulta.medico.especialidade : '-'}</span></td>
            <td>${dataFormatada}</td>
            <td>${horaFormatada}</td>
            <td><span class="status-badge status-${consulta.status.toLowerCase()}">${consulta.status}</span></td>
            <td class="text-center">
                <button class="btn-editar" onclick="abrirModal(${consulta.id})">⚙️ Gerenciar</button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

// 7. Abrir o Modal populando os dados da consulta correspondente
function abrirModal(id) {
    const consulta = listaConsultasCompleta.find(c => c.id === id);
    if (!consulta) return;

    consultaSelecionadaId = id;

    // Cria as opções dinâmicas para o select de médicos
    let opcoesMedicos = '';
    listaMedicosCompleta.forEach(med => {
        const selecionado = consulta.medico && consulta.medico.id === med.id ? 'selected' : '';
        opcoesMedicos += `<option value="${med.id}" ${selecionado}>${med.nome} (${med.especialidade})</option>`;
    });

    // Injeta os inputs e a caixa de seleção de Status direto no corpo do modal
    modalBody.innerHTML = `
        <div class="form-group" style="margin-bottom: 12px;">
            <label style="display:block; font-weight:600; margin-bottom:4px;">Nome do Paciente:</label>
            <input type="text" id="modalPaciente" value="${consulta.nomePaciente}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;">
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
            <label style="display:block; font-weight:600; margin-bottom:4px;">Médico Responsável:</label>
            <select id="modalMedico" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;">
                ${opcoesMedicos}
            </select>
        </div>
        <div class="form-group" style="margin-bottom: 12px; display: flex; gap: 12px;">
            <div style="flex: 1;">
                <label style="display:block; font-weight:600; margin-bottom:4px;">Data:</label>
                <input type="date" id="modalData" value="${consulta.data}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;">
            </div>
            <div style="flex: 1;">
                <label style="display:block; font-weight:600; margin-bottom:4px;">Horário:</label>
                <input type="time" id="modalHora" value="${consulta.hora.substring(0, 5)}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;">
            </div>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
            <label style="display:block; font-weight:600; margin-bottom:4px; color: var(--primary-color);">Status da Consulta:</label>
            <select id="modalStatus" style="width:100%; padding:8px; border-radius:4px; border:2px solid var(--primary-color); font-weight:bold;">
                <option value="AGENDADO" ${consulta.status === 'AGENDADO' ? 'selected' : ''}>AGENDADO</option>
                <option value="REALIZADO" ${consulta.status === 'REALIZADO' ? 'selected' : ''}>REALIZADO</option>
                <option value="CANCELADO" ${consulta.status === 'CANCELADO' ? 'selected' : ''}>CANCELADO</option>
            </select>
        </div>
    `;

    modal.style.display = 'flex';
}

// 8. Fechar o Modal
function fecharModal() {
    modal.style.display = 'none';
    consultaSelecionadaId = null;
}

// 9. Salvar alterações enviando o método PUT para o Back-end
async function salvarAlteracoes(event) {
    event.preventDefault(); // Impede o recarregamento padrão da página

    // Monta o payload exatamente na estrutura do ConsultaDTO esperado pelo Spring
    const dto = {
        medicoId: parseInt(document.getElementById('modalMedico').value),
        nomePaciente: document.getElementById('modalPaciente').value,
        data: document.getElementById('modalData').value,
        hora: document.getElementById('modalHora').value,
        status: document.getElementById('modalStatus').value
    };

    try {
        const response = await fetch(`${API_URL}/${consultaSelecionadaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });

        if (response.ok) {
            alert('Consulta atualizada com sucesso!');
            fecharModal();
            buscarTodasConsultas(); // Recarrega a tabela com as alterações e status novos
        } else {
            const errorData = await response.json();
            // Exibe as mensagens amigáveis das validações retroativas do seu Controller Java
            alert('Erro ao atualizar: ' + (errorData.message || 'Erro desconhecido.'));
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Não foi possível se comunicar com o servidor.');
    }
}
