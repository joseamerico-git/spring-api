// Dados simulados
let agendamentos = [
    { id: 1, paciente: "Ana Silva", medico: "Dr. Carlos Eduardo", especialidade: "Cardiologia", data: "2026-09-05", horario: "09:00", status: "Confirmado" },
    { id: 2, paciente: "Bruno Costa", medico: "Dra. Juliana Mendes", especialidade: "Dermatologia", data: "2026-09-05", horario: "10:30", status: "Pendente" },
    { id: 3, paciente: "Carlos Souza", medico: "Dr. Carlos Eduardo", especialidade: "Cardiologia", data: "2026-09-06", horario: "14:00", status: "Cancelado" },
    { id: 4, paciente: "Daniela Lima", medico: "Dra. Mariana Rocha", especialidade: "Pediatria", data: "2026-09-10", horario: "11:15", status: "Confirmado" }
];

let consultaSelecionadaId = null;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    aplicarFiltros(); // Renderiza a tabela inicial
    
    // Vincula o filtro de texto para responder em tempo real ao digitar
    document.getElementById("inputBusca").addEventListener("input", aplicarFiltros);
});

// --- SISTEMA DE FILTRO UNIFICADO ---
function aplicarFiltros() {
    const termoBusca = document.getElementById("inputBusca").value.toLowerCase();
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    // Filtra a lista principal combinando todos os critérios ativos
    const dadosFiltrados = agendamentos.filter(item => {
        const correspondeNome = item.paciente.toLowerCase().includes(termoBusca) || 
                                item.medico.toLowerCase().includes(termoBusca);
        
        let correspondeData = true;
        if (dataInicio && dataFim) {
            correspondeData = item.data >= dataInicio && item.data <= dataFim;
        } else if (dataInicio || dataFim) {
            // Se preencheu apenas uma das datas, exige que ambas estejam preenchidas para ativar o filtro por período
            correspondeData = true; 
        }

        return correspondeNome && correspondeData;
    });

    renderizarTabela(dadosFiltrados);
}

function limparFiltros() {
    document.getElementById("inputBusca").value = "";
    document.getElementById("dataInicio").value = "";
    document.getElementById("dataFim").value = "";
    renderizarTabela(agendamentos);
}

// --- RENDERIZADOR DA TABELA ---
function renderizarTabela(lista) {
    const corpoTabela = document.getElementById("tabelaConsultasCorpo");
    corpoTabela.innerHTML = "";

    if (lista.length === 0) {
        corpoTabela.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#64748b;">Nenhum agendamento encontrado para os filtros aplicados.</td></tr>`;
        return;
    }

    lista.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.paciente}</strong></td>
            <td>${item.medico}</td>
            <td>${item.especialidade}</td>
            <td>${converterDataParaBR(item.data)}</td>
            <td>${item.horario}</td>
            <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
            <td class="text-center">
                <button onclick="abrirModal(${item.id})" class="btn-editar" style="padding: 6px 12px; cursor: pointer;">Editar</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

// --- CONTROLE DO MODAL ---
function abrirModal(id) {
    consultaSelecionadaId = id;
    const consulta = agendamentos.find(item => item.id === id);
    if (!consulta) return;

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
        <div style="margin-bottom: 12px;"><label style="display:block; margin-bottom:4px; font-weight:600;">Paciente:</label><input type="text" id="editPaciente" value="${consulta.paciente}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;"></div>
        <div style="margin-bottom: 12px;"><label style="display:block; margin-bottom:4px; font-weight:600;">Médico Responsável:</label><input type="text" id="editMedico" value="${consulta.medico}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;"></div>
        <div style="margin-bottom: 12px;"><label style="display:block; margin-bottom:4px; font-weight:600;">Data:</label><input type="date" id="editData" value="${consulta.data}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;"></div>
        <div style="margin-bottom: 12px;"><label style="display:block; margin-bottom:4px; font-weight:600;">Horário:</label><input type="time" id="editHorario" value="${consulta.horario}" required style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;"></div>
        <div style="margin-bottom: 12px;"><label style="display:block; margin-bottom:4px; font-weight:600;">Status:</label>
            <select id="editStatus" style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc;">
                <option value="Confirmado" ${consulta.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                <option value="Pendente" ${consulta.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                <option value="Cancelado" ${consulta.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
        </div>
    `;
    document.getElementById("modalConsulta").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalConsulta").style.display = "none";
    consultaSelecionadaId = null;
}

function salvarAlteracoes(event) {
    event.preventDefault();
    const index = agendamentos.findIndex(item => item.id === consultaSelecionadaId);
    if (index !== -1) {
        agendamentos[index].paciente = document.getElementById("editPaciente").value;
        agendamentos[index].medico = document.getElementById("editMedico").value;
        agendamentos[index].data = document.getElementById("editData").value;
        agendamentos[index].horario = document.getElementById("editHorario").value;
        agendamentos[index].status = document.getElementById("editStatus").value;

        aplicarFiltros(); // Atualiza a tabela respeitando os filtros que já estavam na tela
        fecharModal();
    }
}

// --- AUXILIARES ---
function converterDataParaBR(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}
