  const API_URL = "http://localhost:8080";

        // Elementos do Cadastro de Médico e Webcam
        const formMedico = document.getElementById('medicoForm');
        const btnModoUpload = document.getElementById('btnModoUpload');
        const btnModoCamera = document.getElementById('btnModoCamera');
        const containerUpload = document.getElementById('containerUpload');
        const containerCamera = document.getElementById('containerCamera');
        const inputArquivo = document.getElementById('inputArquivo');
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const btnCapturar = document.getElementById('btnCapturar');
        const imgPreview = document.getElementById('preview');
        const inputCelular = document.getElementById('celular');

        let imagemBase64 = null;
        let streamCamera = null;

        // Máscara dinâmica para o celular (Completa e Corrigida)
        inputCelular.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, "");
            if (valor.length > 11) valor = valor.slice(0, 11);

            if (valor.length > 10) {
                e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
            } else if (valor.length > 6) {
                e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
            } else if (valor.length > 2) {
                e.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
            } else if (valor.length > 0) {
                e.target.value = `(${valor.slice(0, 2)}`;
            }
        });

        // Alternância de modos (Upload / Câmera)
        btnModoUpload.addEventListener('click', () => {
            fecharCamera();
            btnModoUpload.classList.add('btn-active');
            btnModoCamera.classList.remove('btn-active');
            containerUpload.style.display = 'block';
            containerCamera.style.display = 'none';
        });

        btnModoCamera.addEventListener('click', async () => {
            btnModoCamera.classList.add('btn-active');
            btnModoUpload.classList.remove('btn-active');
            containerUpload.style.display = 'none';
            containerCamera.style.display = 'flex';

            try {
                streamCamera = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                video.srcObject = streamCamera;
            } catch (err) {
                alert("Não foi possível acessar a sua webcam.");
            }
        });

        function fecharCamera() {
            if (streamCamera) {
                streamCamera.getTracks().forEach(track => track.stop());
                streamCamera = null;
            }
            video.srcObject = null;
        }

        // Ler arquivo local e gerar String Base64
        inputArquivo.addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            if (arquivo) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagemBase64 = event.target.result;
                    imgPreview.src = imagemBase64;
                    imgPreview.style.display = 'block';
                };
                reader.readAsDataURL(arquivo);
            }
        });

        // Capturar foto da Webcam
        btnCapturar.addEventListener('click', () => {
            if (video.srcObject) {
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                imagemBase64 = canvas.toDataURL('image/jpeg');
                imgPreview.src = imagemBase64;
                imgPreview.style.display = 'block';
            }
        });

        // Sistema de navegação unificado por blocos IDs
        function navegar(tela) {
            fecharCamera(); // Garante o desligamento da webcam por privacidade e performance

            const telas = ['viewHome', 'viewCadastro', 'viewCorpo', 'viewAgenda'];
            const menus = ['menuHome', 'menuCadastro', 'menuCorpo', 'menuAgenda'];

            telas.forEach(t => document.getElementById(t).style.display = 'none');
            menus.forEach(m => document.getElementById(m).classList.remove('active'));

            if (tela === 'home') {
                document.getElementById('viewHome').style.display = 'block';
                document.getElementById('menuHome').classList.add('active');
                carregarDadosDashboard();
            } else if (tela === 'cadastro') {
                document.getElementById('viewCadastro').style.display = 'block';
                document.getElementById('menuCadastro').classList.add('active');
            } else if (tela === 'corpo') {
                document.getElementById('viewCorpo').style.display = 'block';
                document.getElementById('menuCorpo').classList.add('active');
                carregarMedicosNaTabela();
            } else if (tela === 'agenda') {
                document.getElementById('viewAgenda').style.display = 'block';
                document.getElementById('menuAgenda').classList.add('active');
                carregarMedicosNoSelect();
                carregarAgendamentosNaTabela();
            }
        }

        // POST: Cadastrar Médico no Backend
        formMedico.addEventListener('submit', async (e) => {
            e.preventDefault();
            const success = document.getElementById('alertMedicoSuccess');
            const error = document.getElementById('alertMedicoError');
            success.style.display = 'none'; error.style.display = 'none';

            const payload = {
                nome: document.getElementById('nome').value,
                crm: document.getElementById('crm').value,
                celular: document.getElementById('celular').value,
                foto: imagemBase64 // Envia a string Base64 da imagem
            };

            try {
                const res = await fetch(`${API_URL}/medicos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    success.style.display = 'block';
                    formMedico.reset();
                    imgPreview.style.display = 'none';
                    imagemBase64 = null;
                    btnModoUpload.classList.remove('btn-active');
                    btnModoCamera.classList.remove('btn-active');
                    containerUpload.style.display = 'none';
                    containerCamera.style.display = 'none';
                } else { throw new Error(); }
            } catch (e) {
                error.style.display = 'block';
            }
        });

        // GET: Carregar lista completa de médicos na tabela do Corpo Clínico
        async function carregarMedicosNaTabela() {
            const tabela = document.getElementById('tabelaMedicosCorpo');
            try {
                const res = await fetch(`${API_URL}/medicos`);
                if (!res.ok) throw new Error();
                const medicos = await res.json();
                tabela.innerHTML = '';

                if (medicos.length === 0) {
                    tabela.innerHTML = '<tr><td colspan="4" class="no-data">Nenhum médico registrado.</td></tr>';
                    return;
                }
                medicos.forEach(m => {
                    const row = document.createElement('tr');
                    // Exibe avatar padrão caso o médico não possua foto em base64 salva
                    const avatarSrc = m.foto ? m.foto : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2364748b"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/></svg>';

                    row.innerHTML = `
                        <td><img src="${avatarSrc}" class="table-avatar" alt="Foto"></td>
                        <td><strong>Dr(a). ${m.nome}</strong></td>
                        <td>${m.crm || '--'}</td>
                        <td>${m.celular || '--'}</td>
                    `;
                    tabela.appendChild(row);
                });
            } catch (err) {
                tabela.innerHTML = '<tr><td colspan="4" class="no-data" style="color: var(--error-color);">Erro ao conectar com o banco de dados.</td></tr>';
            }
        }

        // GET: Popular o <select> de médicos na tela de consultas
        async function carregarMedicosNoSelect() {
            const select = document.getElementById('selectMedico');
            select.innerHTML = '<option value="">Carregando...</option>';
            try {
                const response = await fetch(`${API_URL}/medicos`);
                const medicos = await response.json();
                select.innerHTML = '<option value="">Selecione um médico...</option>';
                medicos.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m.id;
                    option.textContent = `${m.nome} (${m.crm || 'Sem CRM'})`;
                    select.appendChild(option);
                });
            } catch (e) { select.innerHTML = '<option value="">Erro ao carregar médicos</option>'; }
        }

        // GET: Carregar lista de agendamentos realizados
        async function carregarAgendamentosNaTabela() {
            const corpoTabela = document.getElementById('tabelaAgendamentosCorpo');
            try {
                const response = await fetch(`${API_URL}/agendamentos`);
                const consultas = await response.json();
                corpoTabela.innerHTML = '';

                if (consultas.length === 0) {
                    corpoTabela.innerHTML = '<tr><td colspan="5" class="no-data">Nenhuma consulta agendada.</td></tr>';
                    return;
                }
                consultas.forEach(c => {
                    const tr = document.createElement('tr');
                    const dataFormatada = c.data ? c.data.split('-').reverse().join('/') : '--';
                    const nomeMedico = c.medico ? c.medico.nome : 'Não informado';
                    const crmMedico = c.medico ? (c.medico.crm || '--') : '--';

                    tr.innerHTML = `<td><strong>${c.nomePaciente}</strong></td><td>Dr(a). ${nomeMedico}</td><td>${crmMedico}</td><td>${dataFormatada}</td><td>${c.hora || '--'}</td>`;
                    corpoTabela.appendChild(tr);
                });
            } catch (error) { corpoTabela.innerHTML = '<tr><td colspan="5" class="no-data">Erro ao carregar agendamentos.</td></tr>'; }
        }

        // POST: Salvar Agendamento
        document.getElementById('formAgendamento').addEventListener('submit', async (e) => {
            e.preventDefault();
            const success = document.getElementById('alertSuccess');
            const error = document.getElementById('alertError');
            success.style.display = 'none'; error.style.display = 'none';

            const dados = {
                nomePaciente: document.getElementById('nomePaciente').value,
                medicoId: parseInt(document.getElementById('selectMedico').value),
                data: document.getElementById('dataConsulta').value,
                hora: document.getElementById('horaConsulta').value
            };

            try {
                const response = await fetch(`${API_URL}/agendamentos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
                if (response.status === 201 || response.ok) {
                    success.style.display = 'block';
                    document.getElementById('formAgendamento').reset();
                    carregarAgendamentosNaTabela();
                } else {
                    const err = await response.json();
                    error.textContent = err.message || "Erro no agendamento.";
                    error.style.display = 'block';
                }
            } catch (err) { error.textContent = "Erro de conexão com o servidor."; error.style.display = 'block'; }
        });

        // GET: Atualizar Indicadores do Painel Inicial (Dashboard)
        async function carregarDadosDashboard() {
            try {
                const resConsultas = await fetch(`${API_URL}/agendamentos`);
                if (resConsultas.ok) {
                    const consultas = await resConsultas.json();
                    document.getElementById('totalAgendamentos').textContent = consultas.length;

                    // Compara as strings de data no formato yyyy-MM-dd
                    const hojeStr = new Date().toISOString().split('T')[0];
                    const hojeCount = consultas.filter(c => c.data === hojeStr).length;
                    document.getElementById('qtdConsultasHoje').textContent = hojeCount;
                }
                const resMedicos = await fetch(`${API_URL}/medicos`);
                if (resMedicos.ok) {
                    const medicos = await resMedicos.json();
                    document.getElementById('qtdMedicos').textContent = medicos.length;
                }
            } catch (e) { console.error("Erro ao atualizar o painel principal."); }
        }

        // Inicializa o Dashboard no carregamento inicial da página
        window.onload = carregarDadosDashboard;