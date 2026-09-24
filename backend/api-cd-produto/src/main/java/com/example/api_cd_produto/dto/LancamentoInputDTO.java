package com.example.api_cd_produto.dto;

import java.math.BigDecimal;

import com.example.api_cd_produto.model.TipoLancamento;

public record LancamentoInputDTO(
    String descricao,
    BigDecimal valor,
    TipoLancamento tipo
) {}