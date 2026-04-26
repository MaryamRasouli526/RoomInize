/**
 * RoomPhysics hanterar logik för fysik och regler i rummet,
 * t.ex. kategoriregler, kollisionslogik (framtida expansion)
 * samt tillgängliga etiketter för WCAG/skrivstöd.
 */
class RoomPhysics {

    constructor(room) {
        this.room = room;

        //  WCAG: human-readable labels (för screen readers / a11y system)
        this.categoryLabels = {
            CHAIR: "Stol",
            TABLE: "Bord",
            BED: "Säng",
            SOFA: "Soffa",
            WARDROBE: "Garderob",
            DECORATION: "Dekoration",
            RUG: "Matta",
            STORAGE: "Förvaring"
        };
    }

    /**
     * Returnerar en mänskligt läsbar etikett för en möbelkategori.
     * Används för WCAG och UI-beskrivningar.
     */
    getLabel(category) {
        return this.categoryLabels[category] || "Okänt objekt";
    }
}

