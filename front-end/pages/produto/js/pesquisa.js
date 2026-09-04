    let timeoutBusca = null;
        let imagensAtuais = [];
        let indiceAtual = 0;

        // 1. Lógica do Debounce (Espera o usuário parar de digitar por 1 segundo)
        function dispararBuscaComDelay() {
            clearTimeout(timeoutBusca);
            const termo = document.getElementById("inputBusca").value.trim();

            if (termo === "") {
                limparTabela();
                return;
            }

            // Aguarda 1000ms antes de executar a pesquisa
            timeoutBusca = setTimeout(() => {
                executarPesquisa(termo);
            }, 1000);
        }

        // 2. Executa a filtragem via Fetch HTTP GET para o back-end Spring Boot
        function executarPesquisa(termo) {
            fetch(`http://localhost:8080/produtos/buscar?nome=${encodeURIComponent(termo)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro na resposta do servidor");
                    }
                    return response.json();
                })
                .then(dados => {
                    renderizarTabela(dados);
                })
                .catch(err => {
                    console.error("Erro ao buscar dados do Spring Boot:", err);
                    const tbody = document.querySelector("#tabelaProdutos tbody");
                    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Erro ao conectar com o servidor.</td></tr>`;
                });
        }

        // 3. Renderiza as linhas na tabela dinamicamente sem acumular dados velhos
        function renderizarTabela(listaProdutos) {
            const tbody = document.querySelector("#tabelaProdutos tbody");
            tbody.innerHTML = ""; // Limpa a tabela antes de preencher

            if (listaProdutos.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Nenhum produto encontrado.</td></tr>`;
                return;
            }

            listaProdutos.forEach(produto => {
                const tr = document.createElement("tr");
                tr.onclick = () => abrirModal(produto);

                tr.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    
                `;
                tbody.appendChild(tr);
            });
        }

    /* <td style="text-align: center;">
                        <span class="icone-tabela">👁️</span>
                    </td>*/

        // 4. Reseta o estado inicial da tabela
        function limparTabela() {
            const tbody = document.querySelector("#tabelaProdutos tbody");
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #777;">Digite algo para iniciar a busca...</td></tr>`;
        }

        // 5. Controle de abertura e exibição do Modal
        // 5. Controle de abertura e preenchimento do Modal de Edição
        function abrirModal(produto) {
            // Preenche os inputs com os valores atuais do produto clicado
            document.getElementById("modalId").value = produto.id;
            document.getElementById("modalNome").value = produto.nome;
            document.getElementById("modalPreco").value = produto.preco;
            const URL_BACKEND = "http://localhost:8080";

            if (!produto.imagensUrls || produto.imagensUrls.length === 0) {
                imagensAtuais = ["https://picsum.photos"]; // Adicionado tamanho para o Picsum não quebrar
            } else {
                // 2. Mapeia a lista e adiciona o 'http://localhost:8080' se não for o Picsum
                imagensAtuais = produto.imagensUrls.map(url => {
                    if (url.startsWith("http")) {
                        return url; // Se já tiver HTTP (como o Picsum), mantém original
                    }
                    return `${URL_BACKEND}${url}`; // Se for do banco (/uploads/...), junta com o backend
                });
            }

            indiceAtual = 0;
            exibirImagem();
            document.getElementById("modalProduto").style.display = "block";
        }

        function fecharModal() {
            document.getElementById("modalProduto").style.display = "none";
        }

        function exibirImagem() {
            const imgElement = document.getElementById("previewImagem");
            const indicador = document.getElementById("indicadorImagem");

            imgElement.src = imagensAtuais[indiceAtual];
            indicador.innerText = `${indiceAtual + 1} / ${imagensAtuais.length}`;
        }

        function mudarImagem(direcao) {
            indiceAtual += direcao;

            if (indiceAtual >= imagensAtuais.length) {
                indiceAtual = 0;
            } else if (indiceAtual < 0) {
                indiceAtual = imagensAtuais.length - 1;
            }

            exibirImagem();
        }

        // Fecha o modal caso o usuário clique fora dele
        window.onclick = function (event) {
            const modal = document.getElementById("modalProduto");
            if (event.target === modal) {
                fecharModal();
            }
        }

        function salvarAlteracoes() {
            const id = document.getElementById("modalId").value;
            const nome = document.getElementById("modalNome").value.trim();
            const preco = parseFloat(document.getElementById("modalPreco").value);

            if (!nome || isNaN(preco)) {
                alert("Por favor, preencha todos os campos corretamente.");
                return;
            }

            // Monta o payload exatamente como seu back-end espera receber
            const produtoAtualizado = {
                id: parseInt(id),
                nome: nome,
                preco: preco,
                imagensUrls: imagensAtuais // Envia as mesmas mídias vinculadas
            };

            // Faz a requisição HTTP PUT para o seu endpoint de atualização
            fetch(`http://localhost:8080/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produtoAtualizado)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro ao atualizar o produto no servidor.");
                    }
                    return response.json();
                })
                .then(dados => {
                    alert("Produto atualizado com sucesso!");
                    fecharModal();

                    // Atualiza a tabela chamando a pesquisa novamente com o termo que já está no input
                    const termoAtual = document.getElementById("inputBusca").value.trim();
                    if (termoAtual !== "") {
                        executarPesquisa(termoAtual);
                    }
                })
                .catch(err => {
                    console.error("Erro na atualização:", err);
                    alert("Não foi possível atualizar os dados. Verifique a conexão com o back-end.");
                });
        }