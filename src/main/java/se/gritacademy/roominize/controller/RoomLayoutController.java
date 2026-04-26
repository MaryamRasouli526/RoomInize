package se.gritacademy.roominize.controller;

import org.springframework.web.bind.annotation.*;
import se.gritacademy.roominize.model.RoomLayout;
import se.gritacademy.roominize.service.RoomLayoutService;

import java.util.Optional;

/**
 * Det är en controller-klass för hantering av RoomLayout.
 *
 * Denna controller ansvarar för att hantera sparade layout-data för rum.
 * Till exempel möblernas positioner och visuella inställningar (JSON-layout).
 * Den används av frontend för att spara, hämta och uppdatera rumsdesigner.
 */
@RestController
@RequestMapping("/api/room-layouts")
@CrossOrigin(origins = "*")
public class RoomLayoutController {

    private final RoomLayoutService service;

    /**
     * Det är en konstruktor för att injicera RoomLayoutService.
     *
     * @param service är service som hanterar affärslogik för RoomLayout.
     */
    public RoomLayoutController(RoomLayoutService service) {
        this.service = service;
    }

    /**
     * Denna metod skapar en ny rums-layout.
     *
     * @param layout är layout-data som ska sparas
     * @return sparad RoomLayout
     */
    @PostMapping
    public RoomLayout createRoom(@RequestBody RoomLayout layout) {
        return service.save(layout);
    }

    /**
     * Hämtar en rums-layout baserat på id.
     *
     * @param id är layoutens id
     * @return Optional med RoomLayout om den finns
     */
    @GetMapping("/{id}")
    public Optional<RoomLayout> getRoom(@PathVariable Long id) {
        return service.get(id);
    }

    /**
     * Uppdaterar en befintlig rums-layout.
     *
     * @param id är layoutens id
     * @param layout är nya layout-data
     * @return är uppdaterad RoomLayout
     */
    @PutMapping("/{id}")
    public RoomLayout updateRoom(@PathVariable Long id, @RequestBody RoomLayout layout) {
        return service.update(id, layout);
    }
}
