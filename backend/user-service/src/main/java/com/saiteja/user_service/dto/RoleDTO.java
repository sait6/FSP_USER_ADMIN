package com.saiteja.user_service.dto;

public class RoleDTO {
	private Long id;
    private String name;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public RoleDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
