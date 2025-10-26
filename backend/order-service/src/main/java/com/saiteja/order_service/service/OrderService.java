package com.saiteja.order_service.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saiteja.common.dto.OrderStatus;
import com.saiteja.order_service.config.ProductClient;
import com.saiteja.order_service.config.UserClient;
import com.saiteja.common.dto.OrderCreatedEvent;
import com.saiteja.order_service.dto.OrderRequest;
import com.saiteja.order_service.dto.ProductDTO;
import com.saiteja.order_service.dto.UserDTO;
import com.saiteja.order_service.entity.Order;
import com.saiteja.order_service.repository.OrderRepository;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final ProductClient productClient;
	private final UserClient userClient;
	private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

	private static final String TOPIC = "order-events";

	public OrderService(OrderRepository orderRepository, ProductClient productClient, UserClient userClient,
			KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate) {
		this.orderRepository = orderRepository;
		this.productClient = productClient;
		this.userClient = userClient;
		this.kafkaTemplate = kafkaTemplate;
	}

	@Transactional
	public Order placeOrder(OrderRequest request) {

		// 1️⃣ Validate user
		UserDTO user = userClient.getUserById(request.getUserId());
		if (user == null) {
			throw new RuntimeException("User not found with ID: " + request.getUserId());
		}

		// 2️⃣ Validate product
		ProductDTO product = productClient.getProductById(request.getProductId());
		if (product == null) {
			throw new RuntimeException("Product not found with ID: " + request.getProductId());
		}
		if (product.getQuantity() < request.getQuantity()) {
			throw new RuntimeException("Insufficient stock for product ID: " + request.getProductId());
		}

		// 3️⃣ Create order
		double totalPrice = product.getPrice() * request.getQuantity();
		Order order = new Order();
		String customId = generateOrderId();
		order.setId(customId); // ensure string
		order.setUserId(request.getUserId());
		order.setProductId(request.getProductId());
		order.setQuantity(request.getQuantity());
		order.setTotalPrice(product.getPrice() * request.getQuantity());
		order.setStatus(OrderStatus.PENDING);

		Order savedOrder = orderRepository.save(order);

		OrderCreatedEvent event = new OrderCreatedEvent();
		event.setUserId(savedOrder.getUserId());
		event.setProductId(savedOrder.getProductId());
		event.setQuantity(savedOrder.getQuantity());
		event.setTotalPrice(savedOrder.getTotalPrice());
		event.setStatus(savedOrder.getStatus());
		event.setTimestamp(Instant.now());

		kafkaTemplate.send(TOPIC, String.valueOf(savedOrder.getId()), event);

		return savedOrder;
	}

	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}

	public Order getOrderById(String id) {
		return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found: " + id));
	}

	public Order updateStatus(String id, OrderStatus status) {
		Order order = getOrderById(id);
		order.setStatus(status);
		return orderRepository.save(order);
	}
	
	private String generateOrderId() {
        // Example: USR20251012-001
        String prefix = "ORD";
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%03d", new Random().nextInt(1000)); // 000–999
        return prefix + datePart + "-" + randomPart;
    }
}
