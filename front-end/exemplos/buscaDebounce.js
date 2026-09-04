 // Variável que vai controlar o tempo de espera (Debounce)
    let timeoutBusca;

    // Esta função monitora a digitação
    document.getElementById('campoBusca').addEventListener('input', function() {
        // Limpa o temporizador anterior se o usuário continuar digitando rápido
        clearTimeout(timeoutBusca);

        // Define um atraso de 300ms antes de disparar a busca na API
        timeoutBusca = setTimeout(() => {
            realizarBusca();
        }, 300); 
    });

    async function realizarBusca() {
        const termo = document.getElementById('campoBusca').value.trim();
        const tabelaBody = document.getElementById('tabelaResultados');
        const mensagem = document.getElementById('mensagem');
        
        // Se o usuário apagar tudo, limpa a tabela e interrompe a busca
        if (termo === '') {
            tabelaBody.innerHTML = '';
            mensagem.innerText = 'Digite algo para iniciar a busca.';
            return;
        }

        try {
            // Faz a requisição HTTP GET para a API do Spring Boot
            const url = `http://localhost:8080/produtos/buscar?nome=${encodeURIComponent(termo)}`;
            const resposta = await fetch(url);
            
            if (!resposta.ok) {
                throw new Error('Erro ao conectar com a API');
            }

            const produtos = await resposta.json();

            // Limpa os resultados anteriores antes de renderizar os novos
            tabelaBody.innerHTML = '';

            // Verifica se retornou algum produto
            if (produtos.length === 0) {
                mensagem.innerText = 'Nenhum produto encontrado.';
                return;
            }

            // Oculta a mensagem se houver resultados
            mensagem.innerText = '';

            // Preenche a tabela dinamicamente
            produtos.forEach(produto => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                `;
                tabelaBody.appendChild(linha);
            });

        } catch (erro) {
            tabelaBody.innerHTML = '';
            mensagem.innerText = 'Erro ao buscar dados: ' + erro.message;
        }
    }