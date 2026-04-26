package se.gritacademy.roominize.service;

import se.gritacademy.roominize.model.PlacedItem;
import se.gritacademy.roominize.repository.PlacedItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service-klass för PlacedItem.
 * Hanterar affärslogik kopplad till objekt som är placerade i ett rum, inklusive hämtning, sparande och borttagning av placerade möbler.
 */
@Service
public class PlacedItemService {

    @Autowired
    private PlacedItemRepository placedItemRepository;

    /**
     * Hämtar alla placerade objekt från databasen.
     */
    public List<PlacedItem> getAllPlacedItems() {
        return placedItemRepository.findAll();
    }

    /**
     * Hämtar ett specifikt placerat objekt baserat på id.
     */
    public Optional<PlacedItem> getPlacedItemById(Long id) {
        return placedItemRepository.findById(id);
    }

    /**
     * Sparar eller uppdaterar ett placerat objekt i databasen.
     */
    public PlacedItem savePlacedItem(PlacedItem placedItem) {
        return placedItemRepository.save(placedItem);
    }

    /**
     * Tar bort ett placerat objekt baserat på id.
     * Kastar ett undantag om objektet inte finns.
     */
    public void deletePlacedItem(Long id) {
        if (!placedItemRepository.existsById(id)) {
            throw new RuntimeException("PlacedItem not found: " + id);
        }
        placedItemRepository.deleteById(id);
    }

}