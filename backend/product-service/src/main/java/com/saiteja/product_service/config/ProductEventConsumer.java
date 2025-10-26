package com.saiteja.product_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.saiteja.common.dto.OrderCreatedEvent;
import com.saiteja.product_service.service.ProductService;

@Service
public class ProductEventConsumer {
	private final ProductService productService;
	
	@Autowired
    public ProductEventConsumer(ProductService productService) {
        this.productService = productService;
    }

    @KafkaListener(topics = "order-events", groupId = "product-service-group")
    public void consume(OrderCreatedEvent event) {
        // Only decrement stock if order is pending/confirmed
        if (event.getStatus() != null && event.getStatus().name().equals("PENDING")) {
            productService.decrementStock(String.valueOf(event.getProductId()), event.getQuantity());
        }
    }
}
