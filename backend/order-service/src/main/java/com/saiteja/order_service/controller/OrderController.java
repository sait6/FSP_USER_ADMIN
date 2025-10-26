package com.saiteja.order_service.controller;

import java.util.List;
import com.saiteja.common.dto.OrderStatus;
import com.saiteja.order_service.dto.OrderRequest;
import com.saiteja.order_service.entity.Order;
import com.saiteja.order_service.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Controller", description = "Manages order placement and tracking")
public class OrderController {
	private final OrderService orderService;
	
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @Operation(summary = "Place a new order", description = "Creates a new order and saves it to the database")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order placed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid order request", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
    	Order order = orderService.placeOrder(request);
        return ResponseEntity.ok(order);
    }

    @Operation(summary = "Fetch all orders", description = "Returns a list of all existing orders")
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @Operation(summary = "Get order by ID", description = "Fetches an order using its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order found"),
        @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable String id) {
    	Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @Operation(summary = "Update order status", description = "Updates the status of an existing order")
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestParam OrderStatus status) {
    	Order order = orderService.updateStatus(id, status);
        return ResponseEntity.ok(order);
    }
}
