package com.example.api_cd_produto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api_cd_produto.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    // Filtra por preço exato
    List<Produto> findByPreco(Double preco);

    // Filtra produtos com preço menor ou igual ao valor informado (Preço Máximo)
    List<Produto> findByPrecoLessThanEqual(Double preco);
    // Busca produtos que contêm a string informada no nome
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
