package se.gritacademy.roominize.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity-klass som representerar ett rum i systemet.
 *
 * Denna klass är en del av Model-lagret i MVC
 * Den innehåller information om rummets egenskaper samt vilka objekt (PlacedItem) som finns placerade i rummet.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    /**
     * Unikt id för rummet.
     * Genereras automatiskt av databasen.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Namn på rummet (t.ex. "Sovrum", "Vardagsrum").
     */
    private String name;

    /**
     * Typ av rum (t.ex. BEDROOM, LIVING_ROOM).
     * Sparas som text i databasen.
     */
    @Enumerated(EnumType.STRING)
    private RoomType type;

    /**
     * Rummets bredd (i meter).
     */
    private Double width; // in meters

    /**
     * Rummets höjd (i meter).
     */
    private Double height; // in meters

    /**
     * Bakgrundsfärg för rummet.
     */
    private String backgroundColor;

    /**
     * JSON-sträng som innehåller layout-data för rummet.
     * Används för att spara canvasens tillstånd (möbler, positioner etc).
     */
    @Column(columnDefinition = "LONGTEXT")
    private String jsonLayout;

    /**
     * Lista över alla placerade objekt i rummet.
     *
     * Med cascade = ALL då alla ändringar (save, delete) påverkar även PlacedItem
     * Med orphanRemoval = true då tar bort objekt som inte längre är kopplade till rummet
     */
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlacedItem> placedItems;
}
