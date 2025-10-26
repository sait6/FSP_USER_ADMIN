package com.saiteja.product_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.saiteja.product_service.entity.Product;

public interface ProductRepository extends JpaRepository<Product, String> {
}
