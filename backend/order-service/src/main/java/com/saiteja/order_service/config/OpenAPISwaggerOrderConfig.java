package com.saiteja.order_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPISwaggerOrderConfig {
    @Bean
    public OpenAPI orderServiceOpenAPI() {
    	return new OpenAPI()
                .info(new Info()
                    .title("Order Service API")
                    .version("1.0")
                    .description("API documentation for managing users in the microservice architecture")
                    .contact(new Contact()
                        .name("Soumya")
                        .email("soumyadev@example.com")
                        .url("https://github.com/soumya-dev"))
                    .license(new License()
                        .name("Apache 2.0")
                        .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
