/**
 * RoomRenderer ansvarar för all rendering i canvasen.
 * Den ritar väggar, golv, möbler och UI-overlay (selection handles).
 * Klassen separerar visuellt rendering-lager från logik och input.
 */
class RoomRenderer {

    constructor(room) {
        this.room = room;
    }

    /**
     * Huvudmetod för att rendera hela scenen.
     * Ritar bakgrund, golv, objekt och markerade element.
     */
    draw() {


        const ctx = this.room.ctx;
        const floorY = this.room.floorY;

        // bara rensa canvas (ingen bgColor)
        ctx.clearRect(0, 0, this.room.canvas.width, this.room.canvas.height);

        if (this.room.wallTexture && this.room.wallImage.complete) {

            ctx.drawImage(
                this.room.wallImage,
                0,
                0,
                this.room.canvas.width,
                floorY
            );

        } else {

            ctx.fillStyle = this.room.wallColor;
            ctx.fillRect(0, 0, this.room.canvas.width, floorY);
        }

        if (this.room.floorTexture && this.room.floorImage.complete) {

            ctx.drawImage(
                this.room.floorImage,
                0,
                floorY,
                this.room.canvas.width,
                this.room.canvas.height - floorY
            );

        } else {

            ctx.fillStyle = this.room.floorColor;
            ctx.fillRect(
                0,
                floorY,
                this.room.canvas.width,
                this.room.canvas.height - floorY
            );
        }

        ctx.save();

        let wallGradient = ctx.createLinearGradient(0, floorY - 40, 0, floorY);
        wallGradient.addColorStop(0, "rgba(0,0,0,0)");
        wallGradient.addColorStop(1, "rgba(0,0,0,0.35)");

        ctx.fillStyle = wallGradient;
        ctx.fillRect(0, floorY - 40, this.room.canvas.width, 40);

        let floorGradient = ctx.createLinearGradient(0, floorY, 0, floorY + 40);
        floorGradient.addColorStop(0, "rgba(0,0,0,0.35)");
        floorGradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = floorGradient;
        ctx.fillRect(0, floorY, this.room.canvas.width, 40);

        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(this.room.canvas.width, floorY);
        ctx.stroke();

        ctx.restore();

        this.room.objects.forEach((obj, i) => {

            ctx.save();

            ctx.translate(obj.x, obj.y);
            ctx.rotate(obj.rotation * Math.PI / 180);
            ctx.scale(obj.flipX * obj.scale, obj.scale);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (obj.category === "SVG") {

                const img = new Image();
                img.src = obj.imageUrl;

                if (img.complete) {

                    const extraScale = 1.5;

                    ctx.drawImage(
                        img,
                        -obj.width * extraScale / 2,
                        -obj.height * extraScale / 2,
                        obj.width * extraScale,
                        obj.height * extraScale
                    );

                } else {

                    img.onload = () => this.room.draw();
                }

            } else {

                ctx.font = "60px Arial";

                const isRug = obj.category === "RUG" || obj.category === "MATTA";

                if (isRug) {
                    ctx.fillText(obj.imageUrl, 0, obj.height / 2);
                } else {
                    ctx.fillText(obj.imageUrl, 0, 0);
                }
            }

            ctx.restore();

            if (i === this.room.selected) {

                ctx.save();

                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.rotation * Math.PI / 180);
                ctx.scale(obj.flipX * obj.scale, obj.scale);

                const w = obj.width;
                const h = obj.height;

                ctx.strokeStyle = "#00bfff";
                ctx.lineWidth = 3;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(-w / 2, -h / 2, w, h);
                ctx.setLineDash([]);

                /**
                 * Ritar ett interaktions-handtag (rotate, delete, resize osv)
                 */
                const drawHandle = (x, y, color, label) => {

                    ctx.save();

                    ctx.beginPath();
                    ctx.fillStyle = "#fff";
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;

                    ctx.arc(x, y, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    if (label) {
                        ctx.fillStyle = color;
                        ctx.font = "12px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(label, x, y);
                    }

                    ctx.restore();
                };

                const TOP_Y = -h / 2;
                const BOT_Y = h / 2;
                const LEFT_X = -w / 2;
                const RIGHT_X = w / 2;


                const flipFix = obj.flipX < 0 ? -1 : 1;

                const fx = (x) => x * flipFix;

                // FLIP (TOP LEFT)
                drawHandle(fx(LEFT_X), TOP_Y, "#1ec8ff", "⇋");

                //  ROTATE (TOP CENTER)
                drawHandle(0, TOP_Y - 25, "#00bfff", "⟳");

                // DELETE (TOP RIGHT)
                drawHandle(fx(RIGHT_X), TOP_Y, "#ff2d2d", "✕");

                //  RESIZE (BOTTOM RIGHT)
                drawHandle(fx(RIGHT_X), BOT_Y, "#00ff88", "⇲");

                ctx.restore();
            }

        });
    }
}