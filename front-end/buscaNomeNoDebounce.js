
        async function realizarBusca() {
            const termo = document.getElementById('campoBusca').value;
            const tabelaBody = document.getElementById('tabelaResultados');
            const mensagem = document.getElementById('mensagem');
            
            // Limpa os resultados anteriores
            tabelaBody.innerHTML = '';
            mensagem.innerText = '';

            try {
                // Faz a requisição HTTP GET para a API do Spring Boot
                const url = `http://localhost:8080/produtos/buscar?nome=${encodeURIComponent(termo)}`;
                const resposta = await fetch(url);
                
                if (!resposta.ok) {
                    throw new Error('Erro ao conectar com a API');
                }

                const produtos = await resposta.json();

                // Verifica se retornou algum produto
                if (produtos.length === 0) {
                    mensagem.innerText = 'Nenhum produto encontrado.';
                    return;
                }

                // Preenche a tabela com os dados retornados da API
                produtos.forEach(produto => {
                    const linha = document.createElement('tr');
                    linha.innerHTML = `
                        <td>${produto.id}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.preco.toFixed(2)}</td>
                    `;
                    tabelaBody.appendChild(linha);
                });

            } catch (erro) {
                mensagem.innerText = 'Erro ao buscar dados: ' + erro.message;
            }
        }

        // Bônus: Permite buscar ao apertar "Enter" no teclado
        document.getElementById('campoBusca').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                realizarBusca();
            }
        });
 