package com.example.api_cd_produto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api_cd_produto.model.EspecialidadeMedico;
import com.example.api_cd_produto.model.Medico;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
	List<Medico> findDistinctByNomeContainingIgnoreCase(String nome);

	// O Spring Data lê este nome e monta o SQL: SELECT * FROM medicos WHERE
	// especealidade = ?
	List<Medico> findByEspecialidade(EspecialidadeMedico especialidade);

}
