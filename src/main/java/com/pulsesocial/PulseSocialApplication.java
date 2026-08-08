package com.pulsesocial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PulseSocialApplication {

    public static void main(String[] args) {
        SpringApplication.run(PulseSocialApplication.class, args);
    }
}

