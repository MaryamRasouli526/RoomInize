/**

 * Hanterar:
 * - Furniture loading (REST API)
 * - SVG loading
 * - Drag & drop (HTML5 API)
 * - Room saving/loading
 * - UI events & category filtering
 * - Sound effects
 */

let room;
let allFurniture = [];
let allSvgs = [];
let lastDraggedItem = null;
let currentRoomType = null;

let currentRoomId = null;


/**
 * Sound registry för UI-interaktioner
 */
const sounds = {
    click: new Audio("assets/sounds/click.mp3"),
    drag: new Audio("assets/sounds/drag.mp3"),
    drop: new Audio("assets/sounds/drop.mp3")
};

/**
 * Spelar upp ett ljud (reset + play)
 * @param {Audio} sound
 */
function play(sound) {
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(err => {
        console.log("Ljud blockerat:", err);
    });
}


/**
 * Uppdaterar (PUT) ett RoomLayout i backend
 * @param {Object} layoutData
 */
async function updateRoom(layoutData) {
    const errorBox = document.getElementById("error-message");
    const text = document.getElementById("error-text");

    try {
        const response = await fetch(`http://localhost:8080/api/room-layouts/${currentRoomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(layoutData)
        });

        if (response.status === 404) {
            console.warn("RoomLayout finns inte → skapar nytt istället");

            currentRoomId = null;

            return await createRoom(layoutData);
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();

        if (errorBox) {
            errorBox.style.display = "none";
            errorBox.style.background = "#dc2626";
        }
        if (text) text.textContent = "";

        return data;

    } catch (error) {
        console.error("API error:", error);
        showError("❌ " + error.message);
        return null;
    }
}

/**
 * Skapar nytt RoomLayout i backend (POST)
 * @param {Object} layoutData
 */
async function createRoom(layoutData) {
    const res = await fetch("http://localhost:8080/api/room-layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(layoutData)
    });

    if (!res.ok) {
        throw new Error("Create failed");
    }

    const data = await res.json();

    if (data?.id) {
        currentRoomId = data.id;
        localStorage.setItem("roomId_" + currentRoomType, currentRoomId);
    }

    return data;
}


/**
 * Hämtar alla möbler från backend
 */
async function loadFurniture() {
    const res = await fetch("http://localhost:8080/api/furniture");
    allFurniture = await res.json();

    await loadSvgs();

    const container = document.getElementById("furnitureList");

    allFurniture = removeEmojiDuplicates(allFurniture);

    container.innerHTML = "";

    renderFurniture(allFurniture);
    renderSvgFurniture(allSvgs);
}


/**
 * Hämtar SVG-lista från backend
 */
async function loadSvgs() {
    const res = await fetch("http://localhost:8080/api/furniture/svgs");
    allSvgs = await res.json();
}


/**
 * Renderar SVG-furniture i sidebar (drag & drop items)
 * @param {Array} list
 */
function renderSvgFurniture(list) {
    const container = document.getElementById("furnitureList");
    if (!container) return;

    list.forEach(svg => {
        const div = document.createElement("div");

        div.className = "list-group-item furniture-item glass text-white";
        div.setAttribute("tabindex", "0");
        div.setAttribute("role", "listitem");

        div.innerHTML = `
            <img src="/assets/svg/${encodeURIComponent(svg)}" width="30" height="30">
            <b>${svgNames[svg] || svg}</b>
            <small class="text-warning">SVG</small>
        `;

        div.draggable = true;

        // DRAG START (HTML5 API)
        div.addEventListener("dragstart", (e) => {
            play(sounds.drag);

            lastDraggedItem = { type: "SVG", svg };

            e.dataTransfer.setData("type", "SVG");
            e.dataTransfer.setData("svg", svg);
        });

        div.addEventListener("click", () => {
            play(sounds.click);
        });

        div.addEventListener("keydown", (e) => {

            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                play(sounds.click);

                const canvas = room?.canvas;
                if (!room || !canvas) return;

                const x = canvas.width / 2;
                const y = canvas.height / 2;

                const newObj = {
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
                };

                room.objects.push(newObj);

                room.selected = room.objects.length - 1;

                room.draw();

                room.canvas.focus();

                play(sounds.drop);

                console.log("SVG ENTER → selected + focus");
            }
        });

        container.appendChild(div);
    });
}


/**
 * Tar bort dubletter i furniture-listan
 */
function removeEmojiDuplicates(list) {
    const seen = new Set();

    return list.filter(item => {
        const key = `${item.imageUrl}-${item.category}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}


/**
 * Renderar möbler i listan (icke-SVG objekt) och kopplar in
 * drag & drop, klick- och tangentbordsinteraktion (Enter/Space)
 * för att placera objekt i rummet.
 *
 */
function renderFurniture(list) {
    const container = document.getElementById("furnitureList");
    if (!container) return;

    list.forEach(item => {
        const div = document.createElement("div");

        div.className = "list-group-item furniture-item glass text-white";
        div.setAttribute("tabindex", "0");
        div.setAttribute("role", "listitem");

        div.innerHTML = `
            <span style="font-size:22px">${item.imageUrl}</span>
            <b>${item.name}</b>
            <small>${item.category}</small>
        `;

        div.draggable = true;

        div.addEventListener("keydown", (e) => {

            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                play(sounds.click);

                const canvas = room?.canvas;
                if (!room || !canvas) return;

                const x = canvas.width / 2;
                const y = canvas.height / 2;

                const scale =
                    item.category === "SOFA" ? 1.4 :
                        item.category === "BED" ? 1.5 :
                            item.category === "WARDROBE" ? 1.6 :
                                item.category === "TABLE" ? 1.2 :
                                    item.category === "CHAIR" ? 1.1 :
                                        item.category === "DECORATION" ? 0.9 :
                                            item.category === "RUG" ? 1.2 : 1;

                const newObj = {
                    id: item.id,
                    ...item,
                    x,
                    y,
                    rotation: 0,
                    flipX: 1,
                    scale
                };

                room.objects.push(newObj);

                room.selected = room.objects.length - 1;

                room.draw();
                room.canvas.focus();

                play(sounds.drop);
            }
        });
        // DRAG START (HTML5 API)
        div.addEventListener("dragstart", (e) => {
            play(sounds.drag);
            lastDraggedItem = item;

            e.dataTransfer.setData("item", JSON.stringify(item));
        });

        container.appendChild(div);

        div.addEventListener("click", () => {
            play(sounds.click);
        });
    });


}


/**
 * Filtrerar furniture + SVG baserat på kategori
 * @param {string} cat
 */
function filterCategory(cat) {
    const container = document.getElementById("furnitureList");
    if (!container) return;

    container.innerHTML = "";

    if (cat === "ALL") {
        renderFurniture(allFurniture);
        renderSvgFurniture(allSvgs);
        return;
    }

    const filteredFurniture = allFurniture.filter(f => f.category === cat);
    renderFurniture(filteredFurniture);

    const filteredSvgs = allSvgs.filter(svg => {
        if (cat === "BED") return svg.includes("bed");
        if (cat === "CHAIR") return svg.includes("chair");
        if (cat === "TABLE") return svg.includes("table");
        if (cat === "DECORATION") return svg.includes("deco");
        if (cat === "SOFA") return svg.includes("couch");

        return false;
    });

    renderSvgFurniture(filteredSvgs);
}


/**
 * Väljer rumstyp och laddar UI + data
 * @param {string} type
 */
async function chooseRoom(type) {

    currentRoomType = type;

    currentRoomId = localStorage.getItem("roomId_" + type);

    if (!currentRoomId || currentRoomId === "null") {
        currentRoomId = null;
    }

    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("roomEditor").style.display = "flex";

    document.getElementById("roomTitle").innerText =
        type === "sovrum" ? "🛏️ Sovrum" : "🛋️ Vardagsrum";

    await loadFurniture();

    room = new RoomCanvas("roomCanvas");

    if (currentRoomId) {
        await loadRoomLayout(currentRoomId);
    }
}


/**
 * Sparar room till backend
 */
async function saveRoomToDB() {
    if (!room) return;

    const payload = {
        name: document.getElementById("roomTitle")?.innerText || "Room",
        jsonLayout: JSON.stringify({
            objects: room.objects,
            wallColor: room.wallColor,
            floorColor: room.floorColor,
            wallTexture: room.wallTexture,
            floorTexture: room.floorTexture
        })
    };

    try {
        let data;

        if (currentRoomId) {
            data = await updateRoom(payload);

            if (!data) {
                showError("❌ Kunde inte spara rummet");
                return;
            }
        } else {
            const res = await fetch("http://localhost:8080/api/room-layouts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Save failed");

            data = await res.json();
        }

        if (data?.id) {
            currentRoomId = data.id;
            localStorage.setItem("roomId_" + currentRoomType, currentRoomId);
            showSuccess("💾 Rummet sparat!");
        }

    } catch (err) {
        console.error(err);
        showError("❌ Kunde inte spara rummet");
    }
}


/**
 * Laddar sparat room layout från backend
 * @param {number} id
 */
async function loadRoomLayout(id) {
    if (!id) return;

    const res = await fetch(`http://localhost:8080/api/room-layouts/${id}`);

    if (!res.ok) return;

    const data = await res.json();

    if (!data || !data.jsonLayout) return;

    const parsed = JSON.parse(data.jsonLayout);

    room.objects = parsed.objects || [];

    room.wallColor = parsed.wallColor || "#f5f5f5";
    room.floorColor = parsed.floorColor || "#e0c9a6";
    room.wallTexture = parsed.wallTexture || null;
    room.floorTexture = parsed.floorTexture || null;

// WALL IMAGE
    if (parsed.wallTexture) {
        room.wallImage = new Image();
        room.wallImage.src = parsed.wallTexture;

        room.wallImage.onload = () => room.draw();
    }

// FLOOR IMAGE
    if (parsed.floorTexture) {
        room.floorImage = new Image();
        room.floorImage.src = parsed.floorTexture;

        room.floorImage.onload = () => room.draw();
    }
}


/**
 * Visar error UI
 */
function showError(message) {
    const box = document.getElementById("error-message");
    const text = document.getElementById("error-text");

    if (!box || !text) return;

    box.style.display = "block";
    box.style.background = "#dc2626";
    text.textContent = message;

    setTimeout(() => box.style.display = "none", 4000);
}


/**
 * Visar success UI
 */
function showSuccess(message) {
    const box = document.getElementById("error-message");
    const text = document.getElementById("error-text");

    if (!box || !text) return;

    box.style.display = "block";
    box.style.background = "green";
    text.textContent = message;

    setTimeout(() => {
        box.style.display = "none";
        box.style.background = "#dc2626";
    }, 3000);
}


/**
 * Kopplar save-knapp när DOM är redo
 */
document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.querySelector("button[aria-label='Spara rum']");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveRoomToDB);
    }
});