const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    setupFormSubmit();
});

// Carrega a lista de médicos da API Spring Boot
async function loadDoctors() {
    const doctorSelect = document.getElementById('doctor');
    try {
        const response = await fetch(`${API_BASE_URL}/medicos`);
        if (!response.ok) throw new Error('Erro ao buscar médicos');

        const doctors = await response.json();

        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            // CORRIGIDO: Alterado doctor.especialidade para doctor.numeroCrm
            option.textContent = `${doctor.nome} (${doctor.numeroCrm})`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        showMessage('Não foi possível carregar a lista de médicos.', 'error');
        console.error(error);
    }
}

// Envia o agendamento para a API Spring Boot
function setupFormSubmit() {
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const appointmentData = {
            medicoId: document.getElementById('doctor').value,
            nomePaciente: document.getElementById('patientName').value,
            data: document.getElementById('date').value,
            hora: document.getElementById('time').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                showMessage('Consulta agendada com sucesso!', 'success');
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao agendar consulta');
            }
        } catch (error) {
            showMessage(`Erro: ${error.message}`, 'error');
            console.error(error);
        }
    });
}

function showMessage(text, type) {
    const msgBox = document.getElementById('messageBox');
    msgBox.textContent = text;
    msgBox.className = `message ${type}`;
    msgBox.style.display = 'block';
}