package com.example.api_cd_produto.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Double getPreco() {
		return preco;
	}

	public void setPreco(Double preco) {
		this.preco = preco;
	}

	public Set<String> getImagensUrls() {
		return imagensUrls;
	}

	public void setImagensUrls(Set<String> imagensUrls) {
		this.imagensUrls = imagensUrls;
	}

	private String nome;
	private Double preco;
	@ElementCollection // Cria uma tabela separada (ex: produto_imagens_urls) para a lista

	private Set<String> imagensUrls = new HashSet<>();
}
