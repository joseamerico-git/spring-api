package com.example.api_cd_produto.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_lancamento_caixa") // Define o nome da tabela no banco de dados
public class LancamentoCaixa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Criação de ID autoincremento pelo banco
    private Long id;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false, length = 150) // Define limite de caracteres no banco
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2) // Garante a precisão decimal financeira (ex: 99999999.99)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING) // Salva o texto do Enum ("ENTRADA" ou "SAIDA") em vez do índice numérico
    @Column(nullable = false)
    private TipoLancamento tipo;

    // O JPA exige um construtor padrão (vazio) protegido ou público
    protected LancamentoCaixa() {
    }

    // Construtor principal para uso na sua regra de negócio
    public LancamentoCaixa(String descricao, BigDecimal valor, TipoLancamento tipo) {
        this.dataHora = LocalDateTime.now(); // Define o momento exato da criação
        this.descricao = descricao;
        this.valor = validarValor(valor);
        this.tipo = tipo;
    }

    private BigDecimal validarValor(BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do lançamento deve ser maior que zero.");
        }
        return valor;
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public String getDescricao() {
        return descricao;
    }

    // Setters caso você precise que o Spring preencha os dados ao receber um JSON (API REST)
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = validarValor(valor);
    }

    public TipoLancamento getTipo() {
        return tipo;
    }

    public void setTipo(TipoLancamento tipo) {
        this.tipo = tipo;
    }
}