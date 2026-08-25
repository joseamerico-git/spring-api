package com.example.api_cd_produto.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.api_cd_produto.model.Produto;
import com.example.api_cd_produto.repository.ProdutoRepository;
import com.example.api_cd_produto.service.UploadImagemService;

@RestController
@RequestMapping("/produtos")

@CrossOrigin(origins = "http://127.0.0.1:5500", maxAge = 3600)
public class ProdutoController {

	private final ProdutoRepository produtoRepository;

	private final UploadImagemService uploadImagemService;

	ProdutoController(ProdutoRepository produtoRepository, UploadImagemService uploadImagemService) {
		this.produtoRepository = produtoRepository;
		this.uploadImagemService = uploadImagemService;
	}

	@PutMapping("/{id}")
	public ResponseEntity<Object> atualizarProduto(@PathVariable(value = "id") Long id,
			@RequestBody Produto produtoDadosNovos) {

		Optional<Produto> produtoOpcional = produtoRepository.findById(id);

		if (produtoOpcional.isEmpty()) {
			return ResponseEntity.status(404).body("Produto não encontrado.");
		}

		Produto produtoExistente = produtoOpcional.get();

		// Atualiza os dados básicos do produto
		produtoExistente.setNome(produtoDadosNovos.getNome());
		produtoExistente.setPreco(produtoDadosNovos.getPreco());

		// Atualiza a lista de imagens diretamente da entidade recebida
		produtoExistente.getImagensUrls().clear();
		if (produtoDadosNovos.getImagensUrls() != null) {
			produtoExistente.getImagensUrls().addAll(produtoDadosNovos.getImagensUrls());
		}

		// Salva as alterações no banco de dados
		Produto produtoAtualizado = produtoRepository.save(produtoExistente);

		return ResponseEntity.ok(produtoAtualizado);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Produto> criarProduto(@RequestParam("nome") String nome, @RequestParam("preco") Double preco,
			@RequestParam("imagens") List<MultipartFile> imagens) { // Recebe uma lista de imagens

		try {
			Produto produto = new Produto();
			produto.setNome(nome);
			produto.setPreco(preco);

			// Percorre a lista de imagens enviadas
			if (imagens != null && !imagens.isEmpty()) {
				for (MultipartFile arquivo : imagens) {
					if (!arquivo.isEmpty()) {
						String nomeImagem = uploadImagemService.salvarImagem(arquivo);
						// Adiciona cada caminho na lista do produto
						produto.getImagensUrls().add("/uploads/imagens/" + nomeImagem);
					}
				}
			}

			Produto novoProduto = produtoRepository.save(produto);
			return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// READ: Listar todos os produtos

	// Rota: GET /produtos/buscar?nome=camisa
	@GetMapping("/buscar")
	public List<Produto> listarPorNome(@RequestParam String nome) {
		return produtoRepository.findDistinctByNomeContainingIgnoreCase(nome);
	}

	// READ: Buscar produto por ID
	@GetMapping("/{id}")
	public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
		return produtoRepository.findById(id).map(produto -> ResponseEntity.ok().body(produto))
				.orElse(ResponseEntity.notFound().build());
	}

	/*
	 * @GetMapping public List<Produto> listarTodosPreco(@RequestParam(required =
	 * false) Double preco) { if (preco != null) { return
	 * produtoRepository.findByPrecoLessThanEqual(preco); } return
	 * produtoRepository.findAll(); }
	 *
	 */

	// CREATE: Criar um novo produto
	@PostMapping
	public Produto criar(@RequestBody Produto produto) {
		return produtoRepository.save(produto);
	}

	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestParam("nome") String nome,
			@RequestParam("preco") Double preco,
			@RequestParam(value = "imagens", required = false) List<MultipartFile> imagens) {

		return produtoRepository.findById(id).map(produto -> {
			try {
				produto.setNome(nome);
				produto.setPreco(preco);

				// Se o usuário enviou novas imagens, substitui as antigas
				if (imagens != null && !imagens.isEmpty()) {
					produto.getImagensUrls().clear(); // Limpa histórico antigo se desejar substituir
					for (MultipartFile arquivo : imagens) {
						if (!arquivo.isEmpty()) {
							String nomeImagem = uploadImagemService.salvarImagem(arquivo);
							produto.getImagensUrls().add("/uploads/imagens/" + nomeImagem);
						}
					}
				}

				Produto produtoAtualizado = produtoRepository.save(produto);
				return ResponseEntity.ok(produtoAtualizado);

			} catch (IOException e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Produto>build();
			}
		}).orElse(ResponseEntity.notFound().build());
	}

	// DELETE: Excluir um produto por ID
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		return produtoRepository.findById(id).map(produto -> {
			produtoRepository.deleteById(id);
			return ResponseEntity.noContent().<Void>build();
		}).orElse(ResponseEntity.notFound().build());
	}
}
