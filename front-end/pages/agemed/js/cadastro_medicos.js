const API_URL = 'http://localhost:8080/medicos';

const form = document.getElementById('medicoForm');
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
const selectEspecialidade = document.getElementById('especialidade');

let imagemBlob = null;
let streamCamera = null;
let nomeArquivoOriginal = "foto_medico.png";

// 1. Buscar Especialidades do Backend ao carregar a página
async function carregarEspecialidades() {
    try {
        const response = await fetch(`${API_URL}/especialidades`); // Ajuste a URL do endpoint de enums se necessário
        if (response.ok) {
            const especialidades = await response.json();
            especialidades.forEach(esp => {
                const option = document.createElement('option');
                option.value = esp; // Assume que o enum vem como String do Java (ex: "CARDIOLOGIA")
                option.textContent = esp.charAt(0) + esp.slice(1).toLowerCase(); // Formata para exibir (ex: "Cardiologia")
                selectEspecialidade.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
    }
}
carregarEspecialidades();

// 2. Máscara básica para o celular: (11) 99999-9999
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

// 3. Alternar para modo Arquivo/Upload
btnModoUpload.addEventListener('click', () => {
    fecharCamera();
    btnModoUpload.classList.add('btn-active');
    btnModoCamera.classList.remove('btn-active');
    containerUpload.style.display = 'block';
    containerCamera.style.display = 'none';
});

// 4. Alternar para modo Câmera/Webcam
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

// 5. Processar arquivo selecionado por Upload
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

// 6. Capturar foto da Webcam
btnCapturar.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Transforma o frame do canvas em um arquivo BLOB
    canvas.toBlob((blob) => {
        imagemBlob = blob;
        nomeArquivoOriginal = "webcam_capture.png";

        // Exibe no preview
        const url = URL.createObjectURL(blob);
        imgPreview.src = url;
        imgPreview.style.display = 'block';
    }, 'image/png');
});
// 7. Enviar o formulário para o Backend (Multipart/Form-Data)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!imagemBlob) {
        alert('Por favor, selecione ou tire uma foto do médico.');
        return;
    }

    // 1. Cria o objeto com os dados textuais do médico
    const dadosMedico = {
        nome: document.getElementById('nome').value,
        numeroCrm: document.getElementById('crm').value, // <-- Mudou aqui de 'crm' para 'numeroCrm'
        celular: inputCelular.value.replace(/\D/g, ''),
        especialidade: selectEspecialidade.value
    };
    const formData = new FormData();

    // 2. Transforma o objeto em um Blob JSON e atribui à chave 'medico'
    formData.append(
        'medico',
        new Blob([JSON.stringify(dadosMedico)], { type: 'application/json' })
    );

    // 3. Anexa a foto (certifique-se de que o backend espera o nome 'foto' ou 'file')
    formData.append('foto', imagemBlob, nomeArquivoOriginal);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData // O navegador gerencia os limites do multipart automaticamente
        });

        if (response.ok) {
            alert('Médico cadastrado com sucesso!');
            form.reset();
            imgPreview.style.display = 'none';
            imagemBlob = null;
            fecharCamera();
        } else {
            const erroTxt = await response.text();
            alert('Erro ao cadastrar médico: ' + erroTxt);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});