package com.example.api_cd_produto.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.api_cd_produto.model.StatusConsulta;

import lombok.Data;

@Data
public class ConsultaDTO {
	private Long medicoId;
	private String nomePaciente;

	public Long getMedicoId() {
		return medicoId;
	}

	public void setMedicoId(Long medicoId) {
		this.medicoId = medicoId;
	}

	public String getNomePaciente() {
		return nomePaciente;
	}

	public void setNomePaciente(String nomePaciente) {
		this.nomePaciente = nomePaciente;
	}

	public LocalDate getData() {
		return data;
	}

	public void setData(LocalDate data) {
		this.data = data;
	}

	public LocalTime getHora() {
		return hora;
	}

	public void setHora(LocalTime hora) {
		this.hora = hora;
	}

	private LocalDate data;
	private LocalTime hora;

	private StatusConsulta status;

	public StatusConsulta getStatus() {
		return status;
	}

	public void setStatus(StatusConsulta status) {
		this.status = status;
	}

}
