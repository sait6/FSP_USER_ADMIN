package com.saiteja.product_service.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saiteja.product_service.entity.Product;
import com.saiteja.product_service.repository.ProductRepository;

@Service
public class ProductService {
	private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product saveProduct(Product product) {
    	String customId = generateProductId();

        product.setId(customId);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    @Transactional
    public Product decrementStock(String id, int qty) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        if (product.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock for product ID: " + id);
        }

        product.setQuantity(product.getQuantity() - qty);
        return productRepository.save(product);
    }
    
    private String generateProductId() {
        // Example: USR20251012-001
        String prefix = "PT";
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%03d", new Random().nextInt(1000)); // 000–999
        return prefix + datePart + "-" + randomPart;
    }
    
    public Product updateProductQuantity(String id, int quantity) {
    	Product p = productRepository.findById(id).orElseThrow(()-> new RuntimeException("Product not found with ID:"+ id));
    	
    	int updatedQuantity = p.getQuantity() + quantity;
    	p.setQuantity(updatedQuantity);
    	return productRepository.save(p);
    }
}
