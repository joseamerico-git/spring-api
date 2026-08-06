package com.example.api_cd_produto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.api_cd_produto.model.Produto;
import com.example.api_cd_produto.repository.ProdutoRepository;

@RestController
@RequestMapping("/produtos")

@CrossOrigin(origins = "http://127.0.0.1:5500", maxAge = 3600)
public class ProdutoController {
	
	@Autowired
	private ProdutoRepository produtoRepository;

	// READ: Listar todos os produtos
	
	 // Rota: GET /produtos/buscar?nome=camisa
    @GetMapping("/buscar")
    public List<Produto> listarPorNome(@RequestParam String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }

	// READ: Buscar produto por ID
	@GetMapping("/{id}")
	public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
		return produtoRepository.findById(id).map(produto -> ResponseEntity.ok().body(produto))
				.orElse(ResponseEntity.notFound().build());
	}
	
	/*
	@GetMapping
    public List<Produto> listarTodosPreco(@RequestParam(required = false) Double preco) {
        if (preco != null) {
            return produtoRepository.findByPrecoLessThanEqual(preco);
        }
        return produtoRepository.findAll();
    }
    
    */

	// CREATE: Criar um novo produto
	@PostMapping
	public Produto criar(@RequestBody Produto produto) {
		return produtoRepository.save(produto);
	}

	// UPDATE: Atualizar um produto existente
	@PutMapping("/{id}")
	public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
		return produtoRepository.findById(id).map(produto -> {
			produto.setNome(produtoAtualizado.getNome());
			produto.setPreco(produtoAtualizado.getPreco());
			Produto salvo = produtoRepository.save(produto);
			return ResponseEntity.ok().body(salvo);
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
