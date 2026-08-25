package com.example.api_cd_produto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api_cd_produto.model.Medico;
import com.example.api_cd_produto.repository.MedicoRepository;

@RestController
@RequestMapping("/medicos")
@CrossOrigin(origins = "http://127.0.0.1:5500", maxAge = 3600)
public class MedicoController {

	@Autowired
	private MedicoRepository medicoRepository;

	// POST: Criar médico
	@PostMapping
	public ResponseEntity<Medico> cadastrarMedico(@RequestBody Medico medico) {
		Medico novoMedico = medicoRepository.save(medico);
		return new ResponseEntity<>(novoMedico, HttpStatus.CREATED);
	}

	// GET: Listar todos os médicos
	@GetMapping
	public ResponseEntity<List<Medico>> listarTodos() {
		List<Medico> medicos = medicoRepository.findAll();
		return ResponseEntity.ok(medicos);
	}

	// GET: Buscar médico por ID
	@GetMapping("/{id}")
	public ResponseEntity<Medico> buscarPorId(@PathVariable Long id) {
		return medicoRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}
}
