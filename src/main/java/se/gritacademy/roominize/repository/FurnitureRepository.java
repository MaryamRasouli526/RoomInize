package se.gritacademy.roominize.repository;

import se.gritacademy.roominize.model.Furniture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository för Furniture-entiteten.
 * Hanterar databasanrop för möbler, såsom att spara, hämta,uppdatera och ta bort Furniture-objekt.
 * Ärver standard CRUD-metoder från JpaRepository.
 */
@Repository
public interface FurnitureRepository extends JpaRepository<Furniture, Long> {

    /**
     * Inga egna metoder definierade.
     * Standardmetoder från JpaRepository används, t.ex:
     * - save()
     * - findById()
     * - findAll()
     * - deleteById()
     */
}
