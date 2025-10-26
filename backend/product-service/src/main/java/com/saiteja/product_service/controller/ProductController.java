package com.saiteja.product_service.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.saiteja.product_service.dto.ProductRequestDTO;
import com.saiteja.product_service.dto.ProductResponseDTO;
import com.saiteja.product_service.entity.Product;
import com.saiteja.product_service.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Controller", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(summary = "Add a new product", description = "Adds a new product with provided details")
    @ApiResponse(responseCode = "200", description = "Product added successfully")
    @PostMapping
    public ResponseEntity<ProductResponseDTO> addProduct(@Valid @RequestBody ProductRequestDTO request) {
        logger.info("Adding product → name: {}, description: {}, price: {}, quantity: {}",
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getQuantity());

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());

        Product saved = productService.saveProduct(product);

        ProductResponseDTO response = new ProductResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getPrice(),
                saved.getQuantity()
        );

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all products", description = "Retrieves a list of all products")
    @ApiResponse(responseCode = "200", description = "List of products retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts()
                .stream()
                .map(p -> new ProductResponseDTO(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getQuantity()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }

    @Operation(summary = "Get product by ID", description = "Fetches a product by its unique ID")
    @ApiResponse(responseCode = "200", description = "Product found")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        ProductResponseDTO response = new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity()
        );

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete product by ID", description = "Deletes a product by its unique ID")
    @ApiResponse(responseCode = "204", description = "Product deleted successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Decrement product stock", description = "Decrements stock quantity for a product")
    @ApiResponse(responseCode = "200", description = "Product stock updated successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @PostMapping("/{id}/decrement")
    public ResponseEntity<ProductResponseDTO> decrementStock(@PathVariable String id,
                                                             @RequestParam int qty) {
        Product product = productService.decrementStock(id, qty);

        ProductResponseDTO response = new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity()
        );

        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Update product quantity", description = "Updates the stock quantity for a product")
    @ApiResponse(responseCode = "200", description = "Product quantity updated successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @PutMapping("/{id}/quantity")
    public ResponseEntity<ProductResponseDTO> updateProductQuantity(
            @PathVariable String id,
            @RequestParam int quantity) {

        logger.info("Updating product quantity → id: {}, new quantity: {}", id, quantity);

        Product updatedProduct = productService.updateProductQuantity(id, quantity);

        ProductResponseDTO response = new ProductResponseDTO(
                updatedProduct.getId(),
                updatedProduct.getName(),
                updatedProduct.getDescription(),
                updatedProduct.getPrice(),
                updatedProduct.getQuantity()
        );

        return ResponseEntity.ok(response);
    }
}
