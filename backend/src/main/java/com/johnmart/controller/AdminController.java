package com.johnmart.controller;

import com.johnmart.dto.AdminStatsResponse;
import com.johnmart.dto.ApiResponse;
import com.johnmart.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getDashboardStats() {
        try {
            AdminStatsResponse stats = adminService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to load dashboard stats: " + e.getMessage()));
        }
    }
}
