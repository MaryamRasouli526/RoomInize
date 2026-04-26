/**
 * RoomInput hanterar all användarinteraktion i RoomCanvas.
 * Den ansvarar för drag & drop, markering, rotering, resizing,
 * undo/redo samt tangentbordsstyrning av objekt i rummet.
 */
class RoomInput {

    constructor(room) {
        this.room = room;

        this.rotating = false;
        this.rotateStart = 0;


        this.undoStack = [];
        this.redoStack = [];

        this.resizing = false;
        this.resizeStart = null;

        this.startScale = 1;
    }

    /**
     * Sparar nuvarande state av objektlistan för undo-funktionalitet.
     */
    saveState() {
        this.undoStack.push(JSON.stringify(this.room.objects));
        this.redoStack = [];
    }

    /**
     * Ångrar senaste förändringen genom att återställa tidigare state.
     */
    undo() {
        if (!this.undoStack.length) return;

        this.redoStack.push(JSON.stringify(this.room.objects));
        this.room.objects = JSON.parse(this.undoStack.pop());

        this.room.draw();
        this.announce("Ångrade");
    }

    /**
     * Gör om en tidigare ångrad förändring.
     */
    redo() {
        if (!this.redoStack.length) return;

        this.undoStack.push(JSON.stringify(this.room.objects));
        this.room.objects = JSON.parse(this.redoStack.pop());

        this.room.draw();
        this.announce("Gjorde om");
    }

    /**
     * Räknar ut musens position i canvas-koordinater.
     */
    getMousePos(e) {
        const rect = this.room.canvas.getBoundingClientRect();

        return {
            x: (e.clientX - rect.left) * (this.room.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.room.canvas.height / rect.height)
        };
    }

    /**
     * Omvandlar global position till lokal position relativt ett roterat objekt.
     */
    getLocalPos(obj, x, y) {
        const dx = x - obj.x;
        const dy = y - obj.y;

        const angle = -obj.rotation * Math.PI / 180;

        return {
            x: dx * Math.cos(angle) - dy * Math.sin(angle),
            y: dx * Math.sin(angle) + dy * Math.cos(angle)
        };
    }

    /**
     * Initierar alla event listeners för canvas:
     * drag & drop, musinteraktion och tangentbordsstyrning.
     */
    init() {

        const c = this.room.canvas;

        // 1. MUST först (innan focus används)
        c.setAttribute("tabindex", "0");

        // 3. FORCE FOCUS helper
        const forceFocus = () => {
            setTimeout(() => c.focus(), 0);
        };

        // 4. FOCUS EVENTS (använd forceFocus istället för direkt focus)
        c.addEventListener("click", forceFocus);
        c.addEventListener("mousedown", forceFocus);

        // 5. DRAG & DROP
        c.addEventListener("dragover", e => e.preventDefault());

        c.addEventListener("drop", e => {
            e.preventDefault();

            const { x, y } = this.getMousePos(e);

            this.saveState();

            const type = e.dataTransfer.getData("type");

            if (type === "SVG") {

                const svg = e.dataTransfer.getData("svg");

                this.room.objects.push({
                    name: svg,
                    category: "SVG",
                    imageUrl: `/assets/svg/${svg}`,
                    x,
                    y,
                    rotation: 0,
                    flipX: 1,
                    scale: 1,
                    width: 80,
                    height: 80
                });

                play(sounds.drop);

                this.room.draw();
                this.announce("SVG placerad");
                return;
            }

            const data = JSON.parse(e.dataTransfer.getData("item"));

            let scale = 1;

            if (data.category === "SOFA") scale = 1.4;
            if (data.category === "BED") scale = 1.5;
            if (data.category === "WARDROBE") scale = 1.6;
            if (data.category === "TABLE") scale = 1.2;
            if (data.category === "CHAIR") scale = 1.1;
            if (data.category === "DECORATION") scale = 0.9;
            if (data.category === "RUG") scale = 1.2;

            this.room.objects.push({
                ...data,
                x,
                y,
                rotation: 0,
                flipX: 1,
                scale
            });

            play(sounds.drop);

            this.room.draw();
            this.announce("Objekt placerat");
        });

        c.addEventListener("mousedown", e => {

            const { x, y } = this.getMousePos(e);

            if (this.room.selected !== -1) {

                play(sounds.click);

                const obj = this.room.objects[this.room.selected];
                const local = this.getLocalPos(obj, x, y);

                const w = (obj.width || 80) * obj.scale;
                const h = (obj.height || 80) * obj.scale;

                const handleSize = 25;

                if (Math.abs(local.x - w / 2) < handleSize &&
                    Math.abs(local.y + h / 2) < handleSize) {

                    this.saveState();

                    this.room.objects.splice(this.room.selected, 1);
                    this.room.selected = -1;

                    this.room.draw();
                    return;
                }

                if (Math.abs(local.x + w / 2) < handleSize &&
                    Math.abs(local.y + h / 2) < handleSize) {

                    this.saveState();

                    obj.flipX *= -1;
                    this.room.draw();
                    return;
                }

                if (Math.abs(local.x) < handleSize &&
                    local.y < -h / 2 - 10) {

                    this.rotating = true;

                    const angle = Math.atan2(local.y, local.x);
                    this.rotateStart = angle - obj.rotation * Math.PI / 180;
                    return;
                }

                if (Math.abs(local.x - w / 2) < handleSize &&
                    Math.abs(local.y - h / 2) < handleSize) {

                    this.resizing = true;
                    this.saveState();

                    this.startScale = obj.scale;
                    this.resizeStart = {
                        x,
                        y,
                        objX: obj.x,
                        objY: obj.y
                    };

                    return;
                }
            }

            this.room.selected = -1;

            this.room.objects.forEach((obj, i) => {

                const dx = x - obj.x;
                const dy = y - obj.y;

                const w = (obj.width || 80) * obj.scale;
                const h = (obj.height || 80) * obj.scale;

                if (Math.abs(dx) < w / 2 &&
                    Math.abs(dy) < h / 2) {

                    this.room.selected = i;
                    this.room.lastSelectedItem = obj;
                    this.room.dragging = true;

                    play(sounds.click);

                    c.focus();
                }
            });

            this.room.draw();
        });

        c.addEventListener("mousemove", e => {

            const { x, y } = this.getMousePos(e);

            if (this.room.selected === -1) return;

            const obj = this.room.objects[this.room.selected];

            if (this.rotating) {

                const dx = x - obj.x;
                const dy = y - obj.y;

                const angle = Math.atan2(dy, dx);
                obj.rotation = (angle - this.rotateStart) * 180 / Math.PI;

                this.room.draw();
                return;
            }

            if (this.room.dragging) {
                obj.x = x;
                obj.y = y;
                this.room.draw();
            }

            if (this.resizing) {

                const dx = x - this.resizeStart.objX;
                const dy = y - this.resizeStart.objY;

                const dist = Math.sqrt(dx * dx + dy * dy);

                const sign = (dx + dy < 0) ? -1 : 1;

                obj.scale = Math.max(0.2, this.startScale + (dist / 200) * sign);

                this.room.draw();
                return;
            }
        });

        c.addEventListener("mouseup", () => {

            if (this.resizing) {
                this.saveState();
            }

            this.room.dragging = false;
            this.rotating = false;
            this.resizing = false;

            this.resizeStart = null;
        });

        c.addEventListener("keydown", e => {

            console.log("KEY:", e.key); // 🧪 TEST

            if (e.key === "Enter") {

                const item = this.room.lastSelectedItem;

                if (!item) {
                    console.log("INGET ITEM VALT");
                    return;
                }

                const canvas = this.room.canvas;
                const x = canvas.width / 2;
                const y = canvas.height / 2;

                this.saveState();

                let obj;

                if (item.type === "SVG") {

                    obj = {
                        name: item.svg,
                        category: "SVG",
                        imageUrl: `/assets/svg/${item.svg}`,
                        x,
                        y,
                        rotation: 0,
                        flipX: 1,
                        scale: 1,
                        width: 80,
                        height: 80
                    };

                } else {

                    let scale = 1;

                    if (item.category === "SOFA") scale = 1.4;
                    if (item.category === "BED") scale = 1.5;
                    if (item.category === "WARDROBE") scale = 1.6;
                    if (item.category === "TABLE") scale = 1.2;
                    if (item.category === "CHAIR") scale = 1.1;
                    if (item.category === "DECORATION") scale = 0.9;
                    if (item.category === "RUG") scale = 1.2;

                    obj = {
                        ...item,
                        x,
                        y,
                        rotation: 0,
                        flipX: 1,
                        scale
                    };
                }

                this.room.objects.push(obj);

                play(sounds.drop);
                this.room.draw();
                this.announce("Objekt placerat med Enter");
            }

            if (e.ctrlKey && e.key === "z") this.undo();
            if (e.ctrlKey && e.key === "y") this.redo();

            if (this.room.selected === -1) return;

            const obj = this.room.objects[this.room.selected];
            const step = 10;

            if (e.key === "Delete") {
                this.saveState();
                this.room.objects.splice(this.room.selected, 1);
                this.room.selected = -1;
            }

            if (e.key === "ArrowLeft") obj.x -= step;
            if (e.key === "ArrowRight") obj.x += step;
            if (e.key === "ArrowUp") obj.y -= step;
            if (e.key === "ArrowDown") obj.y += step;

            if (e.key === "r") obj.rotation += 90;
            if (e.key === "f") obj.flipX *= -1;

            if (e.key === "+") obj.scale = Math.min(5, obj.scale + 0.1);
            if (e.key === "-") obj.scale = Math.max(0.2, obj.scale - 0.1);

            this.room.draw();
        });
    }

    /**
     * Skickar en tillgänglighets-annotation till screen readers.
     */
    announce(msg) {
        const live = document.getElementById("a11y-live");
        if (live) live.textContent = msg;
    }
}