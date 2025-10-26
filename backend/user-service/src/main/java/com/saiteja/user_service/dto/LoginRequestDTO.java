package com.saiteja.user_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User creation request payload")
public class LoginRequestDTO {
	@Email(message = "Email should be valid")
	@NotBlank(message = "Email is required")
	@Schema(description = "User's email address", example = "soumya@example.com")
	private String email;
	
	@NotBlank(message = "Password is required")
	@Schema(description = "User's password", example = "securePassword123")
    private String password;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}
}
