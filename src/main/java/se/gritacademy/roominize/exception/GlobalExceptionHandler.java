package se.gritacademy.roominize.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Global exception handler för hela applikationen.
 *
 * Denna klass fångar upp undantag som kastas i controllers
 * Den returnerar standardiserade HTTP-svar till klienten.
 *
 * Syftet är att:
 * Förhindra att applikationen kraschar
 * Ge tydliga felmeddelanden till frontend
 * Centralisera felhantering på ett ställe
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Hanterar RuntimeException globalt.
     *
     * Om felmeddelandet innehåller "not found" returneras 404.
     * Annars returneras 500 (Internal Server Error).
     *
     * @param ex exception som kastats
     * @return ResponseEntity med felinformation i JSON-format
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntime(RuntimeException ex) {

        if (ex.getMessage().contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "timestamp", LocalDateTime.now(),
                    "status", 404,
                    "error", "Not Found",
                    "message", ex.getMessage()
            ));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status", 500,
                "error", "Internal Server Error",
                "message", ex.getMessage()
        ));
    }
}