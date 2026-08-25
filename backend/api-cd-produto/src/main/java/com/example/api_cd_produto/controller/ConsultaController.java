package com.example.api_cd_produto.controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api_cd_produto.dto.ConsultaDTO;
import com.example.api_cd_produto.model.Consulta;
import com.example.api_cd_produto.model.Medico;
import com.example.api_cd_produto.repository.ConsultaRepository;
import com.example.api_cd_produto.repository.MedicoRepository;

@RestController
@RequestMapping("/agendamentos") // Alinhado com a sua estrutura de rotas sem o prefixo /api
@CrossOrigin(origins = "*") // Permite que o seu HTML faça requisições AJAX
public class ConsultaController {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    // POST: Criar um agendamento
    @PostMapping
    public ResponseEntity<?> agendarConsulta(@RequestBody ConsultaDTO dto) {
        
        // 1. Verifica se o médico selecionado no HTML existe no banco de dados
        Medico medico = medicoRepository.findById(dto.getMedicoId()).orElse(null);
        
        if (medico == null) {
            // Retorna erro amigável que será capturado pelo "errorData.message" do JavaScript
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Médico selecionado não foi encontrado no sistema."));
        }

        // 2. Transfere os dados recebidos no DTO para a entidade JPA
        Consulta novaConsulta = new Consulta();
        novaConsulta.setMedico(medico);
        novaConsulta.setNomePaciente(dto.getNomePaciente());
        novaConsulta.setData(dto.getData());
        novaConsulta.setHora(dto.getHora());

        // 3. Salva a nova consulta no banco de dados
        Consulta consultaSalva = consultaRepository.save(novaConsulta);
        return new ResponseEntity<>(consultaSalva, HttpStatus.CREATED);
    }

    // GET: Listar todos os agendamentos realizados
    @GetMapping
    public ResponseEntity<List<Consulta>> listarTodos() {
        List<Consulta> consultas = consultaRepository.findAll();
        return ResponseEntity.ok(consultas);
    }
}
