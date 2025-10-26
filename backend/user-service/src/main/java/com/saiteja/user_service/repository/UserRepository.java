package com.saiteja.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saiteja.user_service.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByEmail(String email);
	
	boolean existsByEmail(String email);
}
