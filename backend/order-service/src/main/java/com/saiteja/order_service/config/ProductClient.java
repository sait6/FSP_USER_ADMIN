package com.saiteja.order_service.config;

import com.saiteja.order_service.dto.ProductDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "product-service", path = "/api/products")
public interface ProductClient {
	@GetMapping("/{id}")
    ProductDTO getProductById(@PathVariable("id") String id);

    // optional sync endpoint if you prefer order-service to directly reduce stock
    @PostMapping("/{id}/decrement")
    void decrementStock(@PathVariable("id") String id, @RequestParam int qty);
}
