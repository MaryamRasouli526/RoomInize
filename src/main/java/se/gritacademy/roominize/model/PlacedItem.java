package se.gritacademy.roominize.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * En entity-klass som representerar ett placerat objekt i ett rum.
 *
 * Denna klass kopplar ihop ett Furniture-objekt med ett specifikt Room
 * Den innehåller även information om hur objektet är placerat visuellt på canvasen (position, rotation, skala och spegling).
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacedItem {

    /**
     * Unikt ID för det placerade objektet.
     * Genereras automatiskt av databasen.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Referens till rummet där objektet är placerat.
     */
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    /**
     * Referens till möbeln som placeras i rummet.
     */
    @ManyToOne
    @JoinColumn(name = "furniture_id")
    private Furniture furniture;

    /**
     * X-position på canvasen.
     */
    private Double x; // position on canvas

    /**
     * Y-position på canvasen.
     */
    private Double y; // position on canvas

    /**
     * Rotation i grader.
     */
    private Double rotation; // rotation in degrees

    /**
     * Skala (storlek) på objektet.
     */
    private Double scale;

    /**
     * Spegling i X-led (1 eller -1).
     */
    private Double flipX;

}