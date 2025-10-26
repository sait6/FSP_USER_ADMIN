package com.saiteja.user_service.config;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.saiteja.common.dto.OrderCreatedEvent;
import com.saiteja.user_service.service.UserService;

@Service
public class UserEventConsumer {
	private final UserService userService;

    public UserEventConsumer(UserService userService) {
        this.userService = userService;
    }

    @KafkaListener(topics = "order-events", groupId = "user-service-group")
    public void consume(OrderCreatedEvent event) {
        System.out.println("📩 User Service received order event: " + event);
    }

}
