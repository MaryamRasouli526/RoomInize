package se.gritacademy.roominize.repository;

import se.gritacademy.roominize.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository för Room-entiteten.
 * Ansvar för databashantering av rum, inklusive kopplingar till placerade objekt.
 * Ärver standard CRUD-funktioner från JpaRepository.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    /**
     * Inga egna metoder definierade.
     * Standardmetoder från JpaRepository används, t.ex:
     * - save()
     * - findById()
     * - findAll()
     * - deleteById()
     */
}