  const backendUrl = 'http://localhost:8080';
        const imagensInput = document.getElementById('imagens');
        const previewContainer = document.getElementById('previewContainer');
        const listaPreviews = document.getElementById('listaPreviews');
        const resumoSecao = document.getElementById('resumoSecao');
        const containerResumo = document.getElementById('containerResumo');

        // Lógica para gerar múltiplos previews locais antes do envio
        imagensInput.addEventListener('change', function() {
            listaPreviews.innerHTML = ''; // Limpa os previews anteriores
            const arquivos = this.files;

            if (arquivos && arquivos.length > 0) {
                previewContainer.style.display = 'block';
                
                // Percorre todos os arquivos selecionados para criar as tags img
                Array.from(arquivos).forEach(arquivo => {
                    const leitor = new FileReader();
                    leitor.addEventListener('load', function() {
                        const img = document.createElement('img');
                        img.src = this.result;
                        listaPreviews.appendChild(img);
                    });
                    leitor.readAsDataURL(arquivo);
                });
            } else {
                previewContainer.style.display = 'none';
            }
        });

        // Envio do formulário com múltiplos arquivos
        document.getElementById('produtoForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const mensagemDiv = document.getElementById('mensagem');
            mensagemDiv.innerText = "Enviando...";
            mensagemDiv.style.color = "black";

            const formData = new FormData();
            formData.append('nome', document.getElementById('nome').value);
            formData.append('preco', document.getElementById('preco').value);
            
            // Adiciona todas as imagens selecionadas no mesmo campo 'imagens' do FormData
            const arquivos = imagensInput.files;
            for (let i = 0; i < arquivos.length; i++) {
                formData.append('imagens', arquivos[i]);
            }

            try {
                const response = await fetch(`${backendUrl}/produtos`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const produtoSalvo = await response.json();
                    mensagemDiv.innerText = "Cadastrado com sucesso!";
                    mensagemDiv.style.color = "green";

                    // Gera as tags HTML de imagem vindas do servidor do Spring
                    let imagensHtml = '';
                    produtoSalvo.imagensUrls.forEach(url => {
                        console.log(url)
                        imagensHtml += `<img src="${backendUrl}${url}" onerror="this.src='https://placehold.co'">`;
                       
                    });

                    // Renderiza o resumo compacto contendo a lista de fotos salvas
                    containerResumo.innerHTML = `
                        <div class="card-produto-mini">
                            <div class="produto-detalhes">
                                <span class="produto-info">#${produtoSalvo.id}</span>
                                <span class="produto-nome">${produtoSalvo.nome}</span>
                                <span class="produto-preco">R$ ${produtoSalvo.preco.toFixed(2)}</span>
                            </div>
                            <div class="grid-imagens">
                                ${imagensHtml}
                                
                            </div>
                        </div>
                    `;

                    resumoSecao.style.display = 'block';
                    document.getElementById('produtoForm').reset();
                    previewContainer.style.display = 'none';
                } else {
                    mensagemDiv.innerText = "Erro no servidor. Status: " + response.status;
                    mensagemDiv.style.color = "red";
                }
            } catch (error) {
                console.error(error);
                mensagemDiv.innerText = "Erro de conexão.";
                mensagemDiv.style.color = "red";
            }
        });