package com.example.api_cd_produto.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadImagemService {

	// Define a pasta onde as imagens serão salvas
	private final String diretorioImagens = "uploads/imagens/";

	public String salvarImagem(MultipartFile arquivo) throws IOException {
		// Cria a pasta caso ela não exista
		Path pathDiretorio = Paths.get(diretorioImagens);
		if (!Files.exists(pathDiretorio)) {
			Files.createDirectories(pathDiretorio);
		}

		// Gera um nome único para o arquivo não sobrescrever outros
		String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
		Path caminhoCompleto = pathDiretorio.resolve(nomeArquivo);

		// Copia o arquivo para o destino
		Files.copy(arquivo.getInputStream(), caminhoCompleto, StandardCopyOption.REPLACE_EXISTING);

		// Retorna o nome ou caminho para salvar no banco
		return nomeArquivo;
	}
}
