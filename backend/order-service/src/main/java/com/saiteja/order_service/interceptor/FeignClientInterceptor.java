package com.saiteja.order_service.interceptor;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;

public class FeignClientInterceptor implements RequestInterceptor {
	public void apply(RequestTemplate template) {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if (attributes != null) {
			HttpServletRequest request = attributes.getRequest();
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null) {
				template.header("Authorization", authHeader);
			}
		}
	}
}
