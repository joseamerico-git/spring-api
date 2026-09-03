package com.example.api_cd_produto.controller;


import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.api_cd_produto.dto.ConsultaDTO;
import com.example.api_cd_produto.model.Consulta;
import com.example.api_cd_produto.model.Medico;
import com.example.api_cd_produto.model.StatusConsulta;
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
        novaConsulta.setStatus(StatusConsulta.AGENDADO); // <- Linha adicionada
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
    
 // GET: Buscar consultas em um intervalo de datas
    @GetMapping("/filtro-data")
    public ResponseEntity<List<Consulta>> listarPorPeriodo(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
            
        List<Consulta> consultasFiltradas = consultaRepository.findByDataBetween(inicio, fim);
        return ResponseEntity.ok(consultasFiltradas);
    }
    
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarConsulta(@PathVariable Long id, @RequestBody ConsultaDTO dto) {
        
        // 1. Verifica se a consulta existe no banco de dados
        Consulta consultaExistente = consultaRepository.findById(id).orElse(null);
        if (consultaExistente == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Consulta não encontrada no sistema."));
        }

        // 2. Verifica se o médico foi alterado e se ele existe
        Medico medico = medicoRepository.findById(dto.getMedicoId()).orElse(null);
        if (medico == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Médico selecionado não foi encontrado."));
        }

        // 3. Atualiza os dados da consulta existente
        consultaExistente.setMedico(medico);
        consultaExistente.setNomePaciente(dto.getNomePaciente());
        consultaExistente.setData(dto.getData());
        consultaExistente.setHora(dto.getHora());
        
        
        // 4. Atualiza o status (Certifique-se de que o seu ConsultaDTO possui o atributo status)
        if (dto.getStatus() != null) {
            consultaExistente.setStatus(dto.getStatus());
        }

        // 5. Salva as alterações
        Consulta consultaAtualizada = consultaRepository.save(consultaExistente);
        return ResponseEntity.ok(consultaAtualizada);
    }
}
