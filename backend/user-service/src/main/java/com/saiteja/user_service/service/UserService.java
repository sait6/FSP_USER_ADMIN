package com.saiteja.user_service.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saiteja.user_service.dto.RoleDTO;
import com.saiteja.user_service.dto.UserRequestDTO;
import com.saiteja.user_service.dto.UserResponseDTO;
import com.saiteja.user_service.entity.User;
import com.saiteja.user_service.entity.UserRole;
import com.saiteja.user_service.repository.RoleRepository;
import com.saiteja.user_service.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final RoleRepository roleRepository;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.roleRepository = roleRepository;
	}

	public UserResponseDTO saveUser(UserRequestDTO requestDto) {
		if (requestDto.getPassword() == null || requestDto.getPassword().isBlank()) {
			throw new IllegalArgumentException("Password must not be null or blank");
		}

		if (userRepository.existsByEmail(requestDto.getEmail())) {
			throw new IllegalStateException("A user is already registered with the email: " + requestDto.getEmail());
		}

		if (requestDto.getRole() == null || requestDto.getRole().getName() == null) {
			throw new IllegalArgumentException("Role must not be null");
		}

		UserRole assignedRole = roleRepository.findByName(requestDto.getRole().getName())
				.orElseGet(() -> roleRepository.save(new UserRole(null, requestDto.getRole().getName())));

		User user = new User();
		user.setId(generateUserId());
		user.setFirstname(requestDto.getFirstname());
		user.setLastname(requestDto.getLastname());
		user.setEmail(requestDto.getEmail());
		user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
		user.setCountry(requestDto.getCountry());
		user.setCity(requestDto.getCity());
		user.setBalance(requestDto.getBalance());
		user.setRole(assignedRole);

		User savedUser = userRepository.save(user);
		return toResponseDTO(savedUser);
	}

	public UserResponseDTO login(String email, String rawPassword) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
			throw new RuntimeException("Invalid password for email: " + email);
		}

		return toResponseDTO(user);
	}

	public List<UserResponseDTO> getAllUsers() {
		return userRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
	}

	public UserResponseDTO getUserById(String id) {
		return userRepository.findById(id).map(this::toResponseDTO)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
	}

	public UserResponseDTO findByEmail(String email) {
		return userRepository.findByEmail(email).map(this::toResponseDTO)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
	}

	public void deleteUser(String id) {
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("User not found with id: " + id);
		}
		userRepository.deleteById(id);
	}

	@Transactional
	public void deductBalance(String userId, double amount) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		if (user.getBalance() < amount) {
			throw new RuntimeException("Insufficient balance for user ID: " + userId);
		}

		user.setBalance(user.getBalance() - amount);
		userRepository.save(user);
	}

	private UserResponseDTO toResponseDTO(User user) {
		UserResponseDTO dto = new UserResponseDTO();
		dto.setId(user.getId());
		dto.setFirstname(user.getFirstname());
		dto.setLastname(user.getLastname());
		dto.setEmail(user.getEmail());
		dto.setBalance(user.getBalance());
		dto.setCity(user.getCity());
		dto.setCountry(user.getCountry());
		dto.setRole(user.getRole());

		return dto;
	}

	private String generateUserId() {
		String prefix = "USR";
		String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		String randomPart = String.format("%03d", new Random().nextInt(1000)); // 000–999
		return prefix + datePart + "-" + randomPart;
	}

	public List<RoleDTO> getAllRoles() {
		return roleRepository.findAll().stream().map(r -> new RoleDTO(r.getId(), r.getName()))
				.collect(Collectors.toList());
	}
}
