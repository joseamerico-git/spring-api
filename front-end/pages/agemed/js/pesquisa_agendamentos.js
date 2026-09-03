   const API_URL = "http://localhost:8080/agendamentos";
        let todasAsConsultas = [];
        let idConsultaEmEdicao = null;

        async function carregarConsultas() {
            const corpoTabela = document.getElementById('tabelaConsultasCorpo');
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error();
                todasAsConsultas = await response.json();
                renderizarTabela(todasAsConsultas);
            } catch (error) {
                corpoTabela.innerHTML = `<tr><td colspan="7" class="no-data" style="color: var(--error-color);"> Não foi possível carregar as consultas. Certifique-se de que o backend está rodando. </td></tr>`;
            }
        }

        document.getElementById('inputBusca').addEventListener('input', (e) => {
            const termo = normalizarTexto(e.target.value);
            const filtradas = todasAsConsultas.filter(consulta => {
                const paciente = normalizarTexto(consulta.nomePaciente || '');
                const medico = normalizarTexto(consulta.medico ? consulta.medico.nome : '');
                return paciente.includes(termo) || medico.includes(termo);
            });
            renderizarTabela(filtradas);
        });

        function normalizarTexto(texto) {
            return texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        function renderizarTabela(lista) {
            const corpoTabela = document.getElementById('tabelaConsultasCorpo');
            corpoTabela.innerHTML = '';

            if (lista.length === 0) {
                corpoTabela.innerHTML = '<tr><td colspan="7" class="no-data">Nenhum agendamento encontrado.</td></tr>';
                return;
            }

            lista.forEach(consulta => {
                const tr = document.createElement('tr');

                const dataFormatada = consulta.data ? consulta.data.split('-').reverse().join('/') : '--';
                const nomeMedico = consulta.medico ? consulta.medico.nome : 'Não informado';
                const especialidade = consulta.medico ? (consulta.medico.especialidade || 'Geral') : '--';
                const hora = consulta.hora || '--';
                const status = consulta.status ? consulta.status.toLowerCase() : 'agendado';

                let classeBadge = 'badge-agendado';
                if (status === 'realizado') classeBadge = 'badge-realizado';
                if (status === 'cancelado') classeBadge = 'badge-cancelado';

                // CORREÇÃO: Recuperadas as colunas <td> da tabela que tinham sumido
                tr.innerHTML = `
                    <td><strong>${consulta.nomePaciente || "Não informado"}</strong></td>
                    <td>Dr(a). ${nomeMedico}</td>
                    <td>${especialidade}</td>
                    <td>${dataFormatada}</td>
                    <td>${hora}</td>
                    <td><span class="badge ${classeBadge}">${status}</span></td>
                    <td class="text-center">
                        <button type="button" onclick="abrirModal(${consulta.id})" class="btn-edit">✏️ Editar</button>
                    </td>
                `;

                corpoTabela.appendChild(tr);
            });
        }

        function abrirModal(id) {
            const consulta = todasAsConsultas.find(c => c.id === id);
            if (!consulta) return;

            idConsultaEmEdicao = id;

            const nomeMedico = consulta.medico ? consulta.medico.nome : '';
            const especialidade = consulta.medico ? (consulta.medico.especialidade || 'Geral') : 'Geral';
            const statusAtual = consulta.status ? consulta.status.toLowerCase() : 'agendado';

            const modalBody = document.getElementById('modalBody');

            // CORREÇÃO: Recuperada toda a estrutura de inputs/labels do formulário que foi apagada
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="editPaciente">Paciente:</label>
                    <input type="text" id="editPaciente" value="${consulta.nomePaciente || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editMedico">Médico:</label>
                    <input type="select" id="editMedico" value="${nomeMedico}" required>
                </div>
                <div class="form-group">
                    <label for="editEspecialidade">Especialidade:</label>
                    <input type="text" id="editEspecialidade" value="${especialidade}">
                </div>
                <div class="form-group">
                    <label for="editData">Data:</label>
                    <input type="date" id="editData" value="${consulta.data || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editHorario">Horário:</label>
                    <input type="time" id="editHorario" value="${consulta.hora || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editStatus">Status:</label>
                    <select id="editStatus">
                        <option value="agendado" ${statusAtual === 'agendado' ? 'selected' : ''}>Agendado</option>
                        <option value="realizado" ${statusAtual === 'realizado' ? 'selected' : ''}>Realizado</option>
                        <option value="cancelado" ${statusAtual === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            `;

            document.getElementById('modalConsulta').classList.add('active');
        }

        async function salvarAlteracoes(event) {
            event.preventDefault();
            if (!idConsultaEmEdicao) return;

            // Busca os dados da consulta original para pegar o id do médico caso não tenha mudado
            const consultaOriginal = todasAsConsultas.find(c => c.id === idConsultaEmEdicao);

            // ATENÇÃO: Verifique se sua API recebe o ID do médico pelo DTO. 
            // Se o seu HTML não tiver um select de médicos com IDs reais, usamos o id do médico que já estava gravado.
            const medicoId = consultaOriginal && consultaOriginal.medico ? consultaOriginal.medico.id : null;

            const dadosAtualizados = {
                nomePaciente: document.getElementById('editPaciente').value,
                medicoId: medicoId, // Envia o ID numérico que o seu dto.getMedicoId() espera
                data: document.getElementById('editData').value,
                hora: document.getElementById('editHorario').value,
                status: document.getElementById('editStatus').value.toUpperCase() // Combina com o Enum StatusConsulta
            };

            try {
                const response = await fetch(`${API_URL}/${idConsultaEmEdicao}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosAtualizados)
                });

                // Captura mensagens de erro personalizadas vindas do seu Map.of("message", ...) do Spring Boot
                if (!response.ok) {
                    const erroData = await response.json();
                    throw new Error(erroData.message || 'Erro ao salvar as mudanças no servidor.');
                }

                alert('Agendamento alterado com sucesso!');
                fecharModal();
                carregarConsultas(); // Recarrega a tabela em tempo real
            } catch (error) {
                alert('Erro ao salvar alterações: ' + error.message);
            }
        }


        function fecharModal() {
            document.getElementById('modalConsulta').classList.remove('active');
            idConsultaEmEdicao = null;
        }

        window.onclick = function (event) {
            const modal = document.getElementById('modalConsulta');
            if (event.target === modal) {
                fecharModal();
            }
        }

        async function filtrarConsultas() {
            const inicio = document.getElementById('dataInicio').value;
            const fim = document.getElementById('dataFim').value;

            if (!inicio || !fim) {
                alert("Por favor, preencha ambas as datas para filtrar.");
                return;
            }

            const tbody = document.getElementById('tabelaConsultas');
            tbody.innerHTML = '<tr><td colspan="4" style="padding: 12px; text-align: center;">Buscando...</td></tr>';

            try {
                // Envia as datas como Query Params para o endpoint criado no Spring
                const response = await fetch(`http://localhost:8080/agendamentos/filtro-data?inicio=${inicio}&fim=${fim}`);

                if (!response.ok) throw new Error("Erro ao buscar dados.");

                const consultas = await response.json();
                tbody.innerHTML = ""; // Limpa a mensagem de carregamento

                if (consultas.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="padding: 12px; text-align: center; color: var(--text-muted);">Nenhuma consulta encontrada neste período.</td></tr>';
                    return;
                }

                // Preenche as linhas da tabela com o retorno da API
                consultas.forEach(consulta => {
                    // Formata a data de AAAA-MM-DD para o formato brasileiro DD/MM/AAAA
                    const dataFormatada = consulta.data.split('-').reverse().join('/');

                    const linha = `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${consulta.nomePaciente}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${consulta.medico ? consulta.medico.nome : 'Não informado'}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${dataFormatada}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${consulta.hora}</td>
                </tr>
            `;
                    tbody.innerHTML += linha;
                });

            } catch (error) {
                console.error("Erro no filtro:", error);
                tbody.innerHTML = '<tr><td colspan="4" style="padding: 12px; text-align: center; color: red;">Não foi possível carregar as consultas.</td></tr>';
            }
        }
        async function filtrarConsultas() {
            const inicio = document.getElementById('dataInicio').value;
            const fim = document.getElementById('dataFim').value;

            if (!inicio || !fim) {
                alert("Por favor, preencha ambas as datas para filtrar.");
                return;
            }

            const tbody = document.getElementById('tabelaConsultas');
            tbody.innerHTML = '<tr><td colspan="4" style="padding: 12px; text-align: center;">Buscando...</td></tr>';

            try {
                // Envia as datas como Query Params para o endpoint criado no Spring
                const response = await fetch(`http://localhost:8080/agendamentos/filtro-data?inicio=${inicio}&fim=${fim}`);

                if (!response.ok) throw new Error("Erro ao buscar dados.");

                const consultas = await response.json();
                tbody.innerHTML = ""; // Limpa a mensagem de carregamento

                if (consultas.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="padding: 12px; text-align: center; color: var(--text-muted);">Nenhuma consulta encontrada neste período.</td></tr>';
                    return;
                }

                // Preenche as linhas da tabela com o retorno da API
                consultas.forEach(consulta => {
                    // Formata a data de AAAA-MM-DD para o formato brasileiro DD/MM/AAAA
                    const dataFormatada = consulta.data.split('-').reverse().join('/');

                    const linha = `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${consulta.nomePaciente}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${consulta.medico ? consulta.medico.nome : 'Não informado'}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${dataFormatada}</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${consulta.hora}</td>
                </tr>
            `;
                    tbody.innerHTML += linha;
                });

            } catch (error) {
                console.error("Erro no filtro:", error);
                tbody.innerHTML = '<tr><td colspan="4" style="padding: 12px; text-align: center; color: red;">Não foi possível carregar as consultas.</td></tr>';
            }
        }


        window.addEventListener('DOMContentLoaded', carregarConsultas);

