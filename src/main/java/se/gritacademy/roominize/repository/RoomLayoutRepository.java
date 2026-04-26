package se.gritacademy.roominize.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.gritacademy.roominize.model.RoomLayout;

/**
 * Repository för RoomLayout-entiteten.
 * Hanterar lagring och hämtning av sparade rumslayouter (JSON-data).
 * Använder standard CRUD-metoder via JpaRepository.
 */
public interface RoomLayoutRepository extends JpaRepository<RoomLayout, Long> {

    /**
     * Inga egna metoder definierade.
     * Standardmetoder från JpaRepository används, t.ex:
     * - save()
     * - findById()
     * - findAll()
     * - deleteById()
     */
}