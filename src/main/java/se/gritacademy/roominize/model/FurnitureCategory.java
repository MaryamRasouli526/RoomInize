package se.gritacademy.roominize.model;

/**
 * Dettam är en enum som representerar olika kategorier av möbler.
 *
 * Den används för att klassificera möbler i systemet
 * Det gör det möjligt att filtrera, sortera och hantera olika typer av möbler på ett strukturerat sätt.
 */
public enum FurnitureCategory {

    /**
     * Sängar (t.ex. enkel- eller dubbelsäng).
     */
    BED,

    /**
     * Stolar (t.ex. stol eller  fåtölj).
     */
    CHAIR,

    /**
     * Bord (t.ex. matbord eller kaffebord).
     */
    TABLE,

    /**
     * Förvaring (t.ex. garderob eller hylla).
     */
    STORAGE,

    /**
     * Dekoration (t.ex. lampor eller växter).
     */
    DECORATION
}