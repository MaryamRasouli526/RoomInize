package se.gritacademy.roominize.model;

import jakarta.persistence.*;

/**
 * RoomLayout är en entitet som representerar en sparad layout av ett rum.
 * Klassen används för att lagra en JSON-struktur som beskriver hur möbler
 * är placerade i rummet. Detta gör det möjligt att spara och ladda kompletta
 * rumsdesigner från databasen.
 */
@Entity
public class RoomLayout {

    /**
     * Unikt id för varje layout (primärnyckel i databasen).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Namn på layouten (t.ex. "Mitt vardagsrum").
     */
    private String name;

    /**
     * JSON-sträng som innehåller hela layouten (möbler, positioner, rotation osv).
     */
    @Column(columnDefinition = "LONGTEXT")
    private String jsonLayout;

    // CONSTRUCTOR

    /**
     * Tom konstruktor krävs av JPA.
     */
    public RoomLayout() {
    }

    /**
     * Konstruktor för att skapa en layout med alla fält.
     */
    public RoomLayout(Long id, String name, String jsonLayout) {
        this.id = id;
        this.name = name;
        this.jsonLayout = jsonLayout;
    }

    // GETTERS

    /**
     * Hämtar layoutens id.
     */
    public Long getId() {
        return id;
    }

    /**
     * Hämtar layoutens namn.
     */
    public String getName() {
        return name;
    }

    /**
     * Hämtar JSON-data för layouten.
     */
    public String getJsonLayout() {
        return jsonLayout;
    }


    // SETTERS

    /**
     * Sätter layoutens ID.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Sätter layoutens namn.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sätter JSON-data för layouten.
     */
    public void setJsonLayout(String jsonLayout) {
        this.jsonLayout = jsonLayout;
    }
}