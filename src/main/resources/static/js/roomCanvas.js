/**
 * RoomCanvas ansvarar för hela canvas-renderingen i applikationen.
 * Den hanterar ritning av rum och användarinteraktioner (drag, klick),
 * samt tillgänglighet (WCAG) genom screen reader-stöd och tangentbordsfokus.
 */
class RoomCanvas {

    /**
     * Konstruktor som initierar canvas, state, event listeners
     * och kopplar ihop moduler för rendering, input och fysik.
     */
    constructor(id) {


        this.wallTexture = null;
        this.floorTexture = null;

        this.lastSelectedItem = null;

        this.wallImage = new Image();
        this.floorImage = new Image();
        this.wallColor = "#f5f5f5";
        this.floorColor = "#e0c9a6";

        const wallColorInput = document.getElementById("wallColor");
        const floorColorInput = document.getElementById("floorColor");

        wallColorInput?.addEventListener("input", (e) => {
            this.wallColor = e.target.value;
            this.wallTexture = null; // stäng av texture
            this.draw();
        });

        floorColorInput?.addEventListener("input", (e) => {
            this.floorColor = e.target.value;
            this.floorTexture = null; // stäng av texture
            this.draw();
        });

        this.undoBtn = document.getElementById("undoBtn");
        this.redoBtn = document.getElementById("redoBtn");

        this.liveRegion = document.getElementById("a11y-live");
        this.a11yList = document.getElementById("a11yList");

        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");

        this.objects = [];
        this.selected = -1;

        this.dragging = false;
        this.floorRatio = 0.55;

        // WCAG: accessibility state
        this.lastAnnounced = "";

        // modules
        this.physics = new RoomPhysics(this);
        this.input = new RoomInput(this);
        this.renderer = new RoomRenderer(this);

        this.input.init();



        const wallSelect = document.getElementById("wallTexture");
        const floorSelect = document.getElementById("floorTexture");

        wallSelect?.addEventListener("change", (e) => {

            const value = e.target.value;

            // om det är färg
            const isColor = value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl");

            if (isColor) {
                this.wallTexture = null;
                this.wallColor = value;
                this.draw();
                return;
            }

            // annars bild
            this.wallTexture = value;

            if (this.wallTexture) {
                this.wallImage.src = this.wallTexture;
                this.wallImage.onload = () => this.draw();
            } else {
                this.draw();
            }
        });


        floorSelect?.addEventListener("change", (e) => {

            const value = e.target.value;

            const isColor = value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl");

            if (isColor) {
                this.floorTexture = null;
                this.floorColor = value;
                this.draw();
                return;
            }

            this.floorTexture = value;

            if (this.floorTexture) {
                this.floorImage.src = this.floorTexture;
                this.floorImage.onload = () => this.draw();
            } else {
                this.draw();
            }
        });

        this.undoBtn?.addEventListener("click", () => this.input.undo());
        this.redoBtn?.addEventListener("click", () => this.input.redo());

        this.initA11y();

        this.draw();
    }

    /**
     * Beräknar Y-positionen för golvet i canvasen.
     */
    get floorY() {
        return this.canvas.height * this.floorRatio;
    }



    /**
     * Huvudmetod för rendering.
     * Ritar rummet och uppdaterar tillgänglighetsinformation.
     */
    draw() {
        this.renderer.draw();

        // WCAG: uppdatera UI-lista (viktigt för icke-visuella användare)
        this.updateA11y();

        this.announceSelection();
    }

    // WCAG 2.1: canvas accessibility setup

    /**
     * Initierar tillgänglighetsinställningar för canvasen,
     * inklusive ARIA-attribut och live region för screen readers.
     */
    initA11y() {

        // WCAG FIX: bättre role än application för denna typ av canvas-editor
        this.canvas.setAttribute("tabindex", "0");
        this.canvas.setAttribute("role", "img");
        this.canvas.setAttribute(
            "aria-label",
            "Rumsdesigner canvas där möbler kan placeras, flyttas och roteras"
        );

        // live region för skärmläsare
        let live = document.getElementById("a11y-live");

        if (!live) {
            live = document.createElement("div");
            live.id = "a11y-live";
            live.setAttribute("aria-live", "polite");
            live.setAttribute("aria-atomic", "true");

            live.style.position = "absolute";
            live.style.left = "-9999px";

            document.body.appendChild(live);
        }

        this.liveRegion = live;

        this.canvas.addEventListener("mousedown", () => {
            this.canvas.focus();
        });

    }

    //  WCAG: annonserar val (screen reader support)

    /**
     * Annonserar valt objekt via screen reader.
     * Undviker upprepning för bättre användarupplevelse.
     */
    announceSelection() {

        if (this.selected === -1) return;

        const obj = this.objects[this.selected];
        if (!obj) return;

        const msg = `${obj.name || obj.category} valt, kategori ${obj.category}`;

        // WCAG FIX: undvik spam i screen readers
        if (msg !== this.lastAnnounced) {
            this.lastAnnounced = msg;
            this.liveRegion.textContent = msg;
        }
    }

    /**
     * Uppdaterar den visuella och tillgängliga listan över objekt i rummet.
     * Gör det möjligt att interagera med objekten via tangentbord och screen readers.
     */
    updateA11y() {

        if (!this.a11yList) return;

        this.a11yList.innerHTML = "";

        this.objects.forEach((obj, i) => {

            const btn = document.createElement("button");

            btn.onclick = () => {
                this.lastSelectedItem = obj;
                this.canvas.focus();
                this.draw();
            };

            btn.type = "button"; // WCAG FIX
            btn.className = "btn btn-sm btn-outline-light m-1";

            btn.setAttribute("role", "listitem");
            btn.setAttribute(
                "aria-label",
                `${obj.name || obj.category}, position ${Math.round(obj.x)}, ${Math.round(obj.y)}`
            );

            btn.innerText =
                `${obj.name || obj.category} ` +
                `(x:${Math.round(obj.x)}, y:${Math.round(obj.y)})`;

            btn.onclick = () => {
                this.selected = i;
                this.canvas.focus(); // WCAG FIX: keyboard focus sync
                this.draw();
            };

            this.a11yList.appendChild(btn);
        });

    }
}