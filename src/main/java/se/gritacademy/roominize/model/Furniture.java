package se.gritacademy.roominize.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Detta är en entity-klass som representerar en möbel i systemet.
 *
 * Denna klass används som en del av Model-lagret i MVC och beskriver
 * vilka typer av emoji möbler som finns tillgängliga i applikationen.
 * Varje möbel innehåller information om namn, kategori och storlek
 * Dessutom hur den ska visas visuellt (emoji eller bild).
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Furniture {

    /**
     * Unikt id för möbeln.
     * Genereras automatiskt av databasen.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Namn på möbeln exempelvis "Säng" eller "Stol".
     */
    private String name;

    /**
     * Kategori som beskriver vilken typ av möbel det är.
     * Lagrar enum-värdet som text i databasen.
     */
    @Enumerated(EnumType.STRING)
    private FurnitureCategory category;

    /**
     * Möbels bredd.
     */
    private Double width;

    /**
     * Möbels höjd.
     */
    private Double height;

    /**
     * Visuell representation av möbeln.
     * Kan vara en emoji eller en URL till en bild/SVG.
     */
    private String imageUrl;

}