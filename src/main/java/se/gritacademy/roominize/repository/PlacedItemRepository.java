package se.gritacademy.roominize.repository;

import se.gritacademy.roominize.model.PlacedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository för PlacedItem-entiteten.
 * Ansvarar för databashantering av objekt som är placerade i ett rum.
 * Ärver CRUD-funktionalitet från JpaRepository.
 */
@Repository
public interface PlacedItemRepository extends JpaRepository<PlacedItem, Long> {

    /**
     * Inga egna metoder definierade.
     * Standardmetoder från JpaRepository används, t.ex:
     * - save()
     * - findById()
     * - findAll()
     * - deleteById()
     */
}