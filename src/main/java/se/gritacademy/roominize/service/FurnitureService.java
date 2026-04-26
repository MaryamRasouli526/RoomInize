package se.gritacademy.roominize.service;

import se.gritacademy.roominize.model.Furniture;
import se.gritacademy.roominize.repository.FurnitureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service-klass för Furniture.
 * Innehåller affärslogik och fungerar som ett mellanlager mellan controller och repository.
 * Hanterar hämtning, sparande och borttagning av möbler.
 */
@Service
public class FurnitureService {

    @Autowired
    private FurnitureRepository furnitureRepository;

    /**
     * Hämtar alla möbler från databasen.
     */
    public List<Furniture> getAllFurniture() {
        return furnitureRepository.findAll();
    }

    /**
     * Hämtar en specifik möbel baserat på id.
     */
    public Optional<Furniture> getFurnitureById(Long id) {
        return furnitureRepository.findById(id);
    }

    /**
     * Sparar eller uppdaterar en möbel i databasen.
     */
    public Furniture saveFurniture(Furniture furniture) {
        return furnitureRepository.save(furniture);
    }

    /**
     * Tar bort en möbel baserat på id.
     * Kastar ett undantag om möbeln inte finns.
     */
    public void deleteFurniture(Long id) {
        if (!furnitureRepository.existsById(id)) {
            throw new RuntimeException("Furniture not found: " + id);
        }
        furnitureRepository.deleteById(id);
    }

}