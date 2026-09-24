package com.example.api_cd_produto.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api_cd_produto.dto.LancamentoInputDTO;
import com.example.api_cd_produto.model.LancamentoCaixa;
import com.example.api_cd_produto.repository.LancamentoCaixaRepository;

@RestController
@RequestMapping("/api/lancamentos") // Define a rota base da API
@CrossOrigin(origins = "http://127.0.0.1:5500", maxAge = 3600)
public class LancamentoCaixaController {

    private final LancamentoCaixaRepository repository;

    // Injeção de dependência via construtor (Boa prática recomendada pelo Spring)
    public LancamentoCaixaController(LancamentoCaixaRepository repository) {
        this.repository = repository;
    }

    // 1. ROTA GET: Retorna a lista de todos os lançamentos
    @GetMapping
    public ResponseEntity<List<LancamentoCaixa>> listarTodos() {
        List<LancamentoCaixa> lancamentos = repository.findAll();
        return ResponseEntity.ok(lancamentos);
    }

    // 2. ROTA POST: Cria um novo lançamento de caixa
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody LancamentoInputDTO dto) {
        try {
            // Instancia o modelo usando o construtor que possui a nossa regra de validação
            LancamentoCaixa novoLancamento = new LancamentoCaixa(
                dto.descricao(),
                dto.valor(),
                dto.tipo()
            );

            LancamentoCaixa salvo = repository.save(novoLancamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
            
        } catch (IllegalArgumentException e) {
            // Captura o erro caso o valor seja menor ou igual a zero e retorna Bad Request (400)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
