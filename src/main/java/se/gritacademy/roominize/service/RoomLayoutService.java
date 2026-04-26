package se.gritacademy.roominize.service;

import org.springframework.stereotype.Service;
import se.gritacademy.roominize.model.RoomLayout;
import se.gritacademy.roominize.repository.RoomLayoutRepository;

import java.util.Optional;

/**
 * Service-klass för RoomLayout.
 * Hanterar affärslogik för sparade rums-layouter (JSON),
 * samt synkronisering mellan layout och faktiska Room-objekt.
 */
@Service
public class RoomLayoutService {

    private final RoomLayoutRepository repo;
    private final RoomService roomService;

    /**
     * Konstruktor som injicerar repository och RoomService.
     */
    public RoomLayoutService(RoomLayoutRepository repo, RoomService roomService) {
        this.repo = repo;
        this.roomService = roomService;
    }

    /**
     * Sparar en ny RoomLayout i databasen.
     * Skapar även ett motsvarande Room baserat på layouten.
     */
    public RoomLayout save(RoomLayout layout) {
        RoomLayout saved = repo.save(layout);

        roomService.createRoomFromLayout(saved);

        return saved;
    }

    /**
     * Hämtar en RoomLayout baserat på ID.
     */
    public Optional<RoomLayout> get(Long id) {
        return repo.findById(id);
    }

    /**
     * Uppdaterar en befintlig RoomLayout.
     * Uppdaterar även motsvarande Room baserat på den nya layouten.
     */
    public RoomLayout update(Long id, RoomLayout updated) {
        RoomLayout existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("RoomLayout not found: " + id));

        existing.setName(updated.getName());
        existing.setJsonLayout(updated.getJsonLayout());

        RoomLayout saved = repo.save(existing);

        roomService.updateRoomFromLayout(id, saved);

        return saved;
    }
}