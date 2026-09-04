package com.example.api_cd_produto.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.api_cd_produto.model.EspecealidadeMedico;
import com.example.api_cd_produto.model.Medico;
import com.example.api_cd_produto.repository.MedicoRepository;

@RestController
@RequestMapping("/medicos")
@CrossOrigin(origins = "http://127.0.0.1:5500", maxAge = 3600)
public class MedicoController {

	private final MedicoRepository medicoRepository;

	// Caminho da pasta definido na sua WebConfig
	private static final String DIRETORIO_UPLOADS = "uploads/imagens/";

	public MedicoController(MedicoRepository medicoRepository) {
		this.medicoRepository = medicoRepository;
	}

	// POST: Criar médico salvando a foto fora do banco
	@PostMapping(consumes = { "multipart/form-data" })
	public ResponseEntity<?> cadastrarMedico(@RequestPart("medico") Medico medico,

			@RequestPart("foto") MultipartFile arquivo) {

		if (arquivo.isEmpty()) {
			return ResponseEntity.badRequest().body("A foto do médico é obrigatória.");
		}

		try {
			// 1. Cria o diretório físico se ele não existir
			Path pastaDefinida = Paths.get(DIRETORIO_UPLOADS);
			if (!Files.exists(pastaDefinida)) {
				Files.createDirectories(pastaDefinida);
			}

			// 2. Gera um nome único para o arquivo para evitar duplicações
			String extensao = arquivo.getOriginalFilename().substring(arquivo.getOriginalFilename().lastIndexOf("."));
			String nomeArquivoUnico = UUID.randomUUID().toString() + extensao;

			// 3. Salva o arquivo fisicamente na pasta do servidor
			Path caminhoCompleto = pastaDefinida.resolve(nomeArquivoUnico);
			Files.copy(arquivo.getInputStream(), caminhoCompleto);

			// 4. Salva a URL/Caminho público no atributo do médico
			// Exemplo de retorno: "/uploads/imagens/nome-do-arquivo.jpg"
			String urlPublicaFoto = "/uploads/imagens/" + nomeArquivoUnico;
			medico.setFoto(urlPublicaFoto); // Certifique-se de ter o atributo String foto na sua classe Medico

			// 5. Salva os dados no banco
			Medico novoMedico = medicoRepository.save(medico);
			return new ResponseEntity<>(novoMedico, HttpStatus.CREATED);

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Erro ao salvar o arquivo de imagem: " + e.getMessage());
		}
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

	@GetMapping("/especialidades")
	public ResponseEntity<EspecealidadeMedico[]> listarEspecialidades() {
		return ResponseEntity.ok(EspecealidadeMedico.values());
	}

	// GET: Buscar médicos filtrando pela especialidade
	@GetMapping("/filtrar")
	public ResponseEntity<List<Medico>> filtrarPorEspecialidade(@RequestParam EspecealidadeMedico especialidade) {
		// Nota: Certifique-se de criar o método 'findByEspecealidade' no seu
		// MedicoRepository
		List<Medico> medicos = medicoRepository.findByEspecealidade(especialidade);
		return ResponseEntity.ok(medicos);
	}

}
