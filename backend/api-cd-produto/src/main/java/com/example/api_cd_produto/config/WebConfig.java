package com.example.api_cd_produto.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Mapeia as requisições web para a pasta física de upload
		registry.addResourceHandler("/uploads/imagens/**").addResourceLocations("file:uploads/imagens/");
	}
}
