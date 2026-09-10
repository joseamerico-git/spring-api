package com.example.api_cd_produto.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
	private EspecialidadeMedico especialidade;

	private String foto; // Armazenará o caminho relativo: "/uploads/imagens/arquivo.jpg"

	/**
	 * Retorna a URL completa da foto para que o JavaScript consiga renderizar o
	 * preview. O `@Transient` garante que o Hibernate não tentará criar uma coluna
	 * 'url_foto' no banco de dados.
	 */
	@Transient
	public String getUrlFoto() {
		if (this.foto == null) {
			return null;
		}
		return "http://localhost:8080" + this.foto;
	}

	// =========================================================================
	// GETTERS E SETTERS MANUAIS
	// =========================================================================

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

	public EspecialidadeMedico getEspecialidade() {
		return especialidade;
	}

	public void setEspecialidade(EspecialidadeMedico especialidade) {
		this.especialidade = especialidade;
	}

	public String getFoto() {
		return foto;
	}

	public void setFoto(String foto) {
		this.foto = foto;
	}
}
