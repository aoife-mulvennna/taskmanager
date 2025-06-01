package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private boolean completed;
    private Integer importance;

    public Task(){}

    public Task(String title, String description, boolean completed, Integer importance){
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.importance = importance;
    }

   public Long getId() { return id; }
   public String getTitle() { return title; }
   public void setTitle(String title) { this.title = title; }
   public String getDescription() { return description; }
   public void setDescription(String description) { this.description = description; }
   public boolean isCompleted() { return completed; }
   public void setCompleted(boolean completed) { this.completed = completed; }
   public Integer getImportance() {return importance;}
   public void setImportance(Integer importance){this.importance = importance; }

}
