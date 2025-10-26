package com.saiteja.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenAPISwaggerUserConfig {
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
				.info(new Info().title("User Service API").version("1.0")
						.description("API documentation for managing users in the microservice architecture")
						.contact(new Contact().name("Soumya").email("soumyadev@example.com")
								.url("https://github.com/soumya-dev"))
						.license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0")))
				.addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
				.components(new io.swagger.v3.oas.models.Components().addSecuritySchemes("bearerAuth",
						new SecurityScheme().name("bearerAuth").type(SecurityScheme.Type.HTTP).scheme("bearer")
								.bearerFormat("JWT")));
	}

}