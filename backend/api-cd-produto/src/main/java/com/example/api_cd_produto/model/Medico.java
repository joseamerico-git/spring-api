package com.example.api_cd_produto.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "medicos")
@Data
public class Medico {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false)
	private String celular;

	@Column(name = "numero_crm", nullable = false, unique = true)
	private String numeroCrm;

	@Enumerated(EnumType.STRING)
	private EspecealidadeMedico especealidade;

	public EspecealidadeMedico getEspecealidade() {
		return especealidade;
	}

	public void setEspecealidade(EspecealidadeMedico especealidade) {
		this.especealidade = especealidade;
	}

	// @Lob // Define como Large Object para suportar arquivos de imagem
	// @Column(columnDefinition = "TEXT") // Armazena a foto como String Base64
	// private String fotoBase64;
	// Dentro da classe Medico
	private String foto; // Armazenará o caminho relativo: "/uploads/imagens/arquivo.jpg"

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

	public String getCelular() {
		return celular;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public String getNumeroCrm() {
		return numeroCrm;
	}

	public void setNumeroCrm(String numeroCrm) {
		this.numeroCrm = numeroCrm;
	}

	public String getFoto() {
		return foto;
	}

	public void setFoto(String foto) {
		this.foto = foto;
	}

}
