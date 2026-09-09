const API_URL = 'http://localhost:8080/medicos';

// Referência ao formulário e ao campo oculto de ID do HTML de edição
const form = document.getElementById('editarMedicoForm'); 
const inputMedicoId = document.getElementById('medicoId'); 

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
const selectEspecialidade = document.getElementById('especealidade');

let imagemBlob = null;
let streamCamera = null;
let nomeArquivoOriginal = "foto_medico.png";

// Obtém o ID do médico a partir da URL (ex: editar_medico.html?id=12)
function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 1. Buscar Especialidades do Backend
async function carregarEspecialidades() {
    try {
        const response = await fetch(`${API_URL}/especialidades`);
        if (response.ok) {
            const especialidades = await response.json();
            selectEspecialidade.innerHTML = '<option value="">Selecione uma especialidade...</option>';
            
            especialidades.forEach(esp => {
                const option = document.createElement('option');
                option.value = esp;
                option.textContent = esp.charAt(0) + esp.slice(1).toLowerCase();
                selectEspecialidade.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
    }
}

// 2. Buscar dados do médico e preencher o formulário automaticamente
async function carregarDadosMedico() {
    const id = obterIdDaUrl();
    if (!id) {
        alert('ID do médico não foi encontrado na URL.');
        return;
    }

    // Carrega a lista de especialidades antes para conseguir selecionar a correta abaixo
    await carregarEspecialidades();

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const medico = await response.json();
            
            // Preenche os inputs com as informações do banco de dados
            inputMedicoId.value = medico.id;
            document.getElementById('nome').value = medico.nome;
            document.getElementById('crm').value = medico.numeroCrm;
            
            // Preenche o celular e força a execução da máscara de formatação
            inputCelular.value = medico.celular;
            inputCelular.dispatchEvent(new Event('input')); 

            selectEspecialidade.value = medico.especialidade;

            // Mostra a foto atual do médico no preview (se ela existir)
            if (medico.urlFoto) {
                imgPreview.src = medico.urlFoto;
                imgPreview.style.display = 'block';
            }
        } else {
            alert('Não foi possível carregar os dados deste médico.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do médico:', error);
    }
}

// Inicializa a tela buscando os dados do médico correspondente
carregarDadosMedico();

// 3. Máscara para o celular: (11) 99999-9999
inputCelular.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    e.target.value = value;
});

// 4. Alternar para modo Arquivo/Upload
btnModoUpload.addEventListener('click', () => {
    fecharCamera();
    btnModoUpload.classList.add('btn-active');
    btnModoCamera.classList.remove('btn-active');
    containerUpload.style.display = 'block';
    containerCamera.style.display = 'none';
});

// 5. Alternar para modo Câmera/Webcam
btnModoCamera.addEventListener('click', async () => {
    btnModoCamera.classList.add('btn-active');
    btnModoUpload.classList.remove('btn-active');
    containerUpload.style.display = 'none';
    containerCamera.style.display = 'flex';

    try {
        streamCamera = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = streamCamera;
    } catch (err) {
        alert('Não foi possível acessar a webcam. Verifique as permissões.');
        console.error(err);
    }
});

function fecharCamera() {
    if (streamCamera) {
        streamCamera.getTracks().forEach(track => track.stop());
        streamCamera = null;
    }
}

// 6. Processar arquivo selecionado por Upload (Corrigido para .files[0])
inputArquivo.addEventListener('change', (e) => {
    const arquivo = e.target.files[0]; 
    if (arquivo) {
        nomeArquivoOriginal = arquivo.name;
        imagemBlob = arquivo;

        const reader = new FileReader();
        reader.onload = (event) => {
            imgPreview.src = event.target.result;
            imgPreview.style.display = 'block';
        };
        reader.readAsDataURL(arquivo);
    }
});

// 7. Capturar foto da Webcam
btnCapturar.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        imagemBlob = blob;
        nomeArquivoOriginal = "webcam_capture.png";

        const url = URL.createObjectURL(blob);
        imgPreview.src = url;
        imgPreview.style.display = 'block';
    }, 'image/png');
});

// 8. Enviar o formulário de atualização (Método PUT)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idMedico = inputMedicoId.value;

    const dadosMedico = {
        id: idMedico, 
        nome: document.getElementById('nome').value,
        numeroCrm: document.getElementById('crm').value, 
        celular: inputCelular.value.replace(/\D/g, ''),
        especialidade: selectEspecialidade.value
    };
    
    const formData = new FormData();

    formData.append(
        'medico',
        new Blob([JSON.stringify(dadosMedico)], { type: 'application/json' })
    );

    // Envia a foto apenas se o usuário tiver alterado ela (via upload ou webcam)
    if (imagemBlob) {
        formData.append('foto', imagemBlob, nomeArquivoOriginal);
    }

    try {
        // Envia uma requisição PUT para http://localhost:8080/medicos/{id}
        const response = await fetch(`${API_URL}/${idMedico}`, {
            method: 'PUT',
            body: formData 
        });

        if (response.ok) {
            alert('Médico atualizado com sucesso!');
            fecharCamera();
        } else {
            const erroTxt = await response.text();
            alert('Erro ao atualizar médico: ' + erroTxt);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});
