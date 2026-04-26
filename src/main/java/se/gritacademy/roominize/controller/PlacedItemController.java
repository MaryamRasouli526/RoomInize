package se.gritacademy.roominize.controller;

import se.gritacademy.roominize.model.PlacedItem;
import se.gritacademy.roominize.service.PlacedItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Detta är en controller-klass för hantering av placerade objekt (PlacedItem).
 *
 * Denna controller tar emot HTTP-anrop från frontend och
 * hanterar CRUD-operationer för objekt som har placerats i ett rum.
 */
@RestController
@RequestMapping("/api/placed-items")
@CrossOrigin(origins = "*")
public class PlacedItemController {

    @Autowired
    private PlacedItemService placedItemService;

    /**
     * Metoden Hämtar alla placerade objekt.
     *
     * @return lista av PlacedItem
     */
    @GetMapping
    public List<PlacedItem> getAllPlacedItems() {
        return placedItemService.getAllPlacedItems();
    }

    /**
     * Hämtar ett specifikt placerat objekt baserat på id.
     *
     * @param id objektets ID
     * @return PlacedItem om den finns annars ger det 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlacedItem> getPlacedItemById(@PathVariable Long id) {
        Optional<PlacedItem> placedItem = placedItemService.getPlacedItemById(id);
        if (placedItem.isPresent()) {
            return ResponseEntity.ok(placedItem.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Skapar ett nytt placerat objekt.
     *
     * @param placedItem objektet som ska sparas
     * @return sparat PlacedItem
     */
    @PostMapping
    public PlacedItem createPlacedItem(@RequestBody PlacedItem placedItem) {
        return placedItemService.savePlacedItem(placedItem);
    }

    /**
     * Uppdaterar ett befintligt placerat objekt.
     *
     * @param id objektets id
     * @param placedItemDetails är nya värden
     * @return uppdaterad PlacedItem eller 404 om den inte finns
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlacedItem> updatePlacedItem(@PathVariable Long id, @RequestBody PlacedItem placedItemDetails) {
        Optional<PlacedItem> placedItem = placedItemService.getPlacedItemById(id);
        if (placedItem.isPresent()) {
            placedItemDetails.setId(id);
            return ResponseEntity.ok(placedItemService.savePlacedItem(placedItemDetails));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tar bort ett placerat objekt baserat på id.
     *
     * @param id är objektets id
     * @return 200 OK om borttaget annars visas 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlacedItem(@PathVariable Long id) {
        if (placedItemService.getPlacedItemById(id).isPresent()) {
            placedItemService.deletePlacedItem(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}