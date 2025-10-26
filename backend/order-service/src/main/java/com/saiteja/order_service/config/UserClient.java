package com.saiteja.order_service.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.saiteja.order_service.dto.UserDTO;

@FeignClient(name = "user-service", path = "/api/users")
public interface UserClient {

    // Call internal endpoint that bypasses JWT auth for internal communication
    @GetMapping("/internal/{id}")
    UserDTO getUserById(@PathVariable("id") String id);
}
