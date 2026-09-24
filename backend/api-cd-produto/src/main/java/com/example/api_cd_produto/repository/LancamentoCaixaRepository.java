package com.example.api_cd_produto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api_cd_produto.model.LancamentoCaixa;

@Repository
public interface LancamentoCaixaRepository extends JpaRepository<LancamentoCaixa, Long> {
	// Aqui você já ganha métodos como save(), findAll(), findById(), deleteById()
}
