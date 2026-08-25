package com.example.api_cd_produto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api_cd_produto.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

	// Filtra por preço exato
	List<Produto> findByPreco(Double preco);

	// Filtra produtos com preço menor ou igual ao valor informado (Preço Máximo)
	List<Produto> findByPrecoLessThanEqual(Double preco);

	// Busca produtos que contêm a string informada no nome
	// @Query("SELECT DISTINCT p FROM Produto p LEFT JOIN FETCH p.imagensUrls WHERE
	// p.nome LIKE %:nome%")
	// List<Produto> buscarPorNome(@Param("nome") String nome);
	List<Produto> findDistinctByNomeContainingIgnoreCase(String nome);
}
