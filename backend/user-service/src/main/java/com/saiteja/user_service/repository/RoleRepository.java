package com.saiteja.user_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saiteja.user_service.entity.UserRole;

public interface RoleRepository extends JpaRepository<UserRole, Long> {
	Optional<UserRole> findByName(String name);
}
