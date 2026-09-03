package com.example.api_cd_produto.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api_cd_produto.model.Consulta;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
	  // Spring Data gera automaticamente a query SQL baseada no nome do método
    List<Consulta> findByDataBetween(LocalDate dataInicio, LocalDate dataFim);
}

