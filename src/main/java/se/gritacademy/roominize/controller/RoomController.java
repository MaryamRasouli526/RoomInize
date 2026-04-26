package se.gritacademy.roominize.controller;

import se.gritacademy.roominize.model.Room;
import se.gritacademy.roominize.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller-klass för hantering av Room.
 *
 * Denna controller ansvarar för att ta emot HTTP-anrop från frontend.
 * Dessutom utföra CRUD-operationer för rum.
 * Den kommunicerar med RoomService för att hantera affärslogik och datalagring.
 */
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * Hämtar alla rum i systemet.
     *
     * @return lista av Room-objekt
     */
    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    /**
     * Hämtar ett specifikt rum baserat på id.
     *
     * @param id är rummets is
     * @return Room om det finns annars retuneras 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        if (room.isPresent()) {
            return ResponseEntity.ok(room.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Skapar ett nytt rum.
     *
     * @param room är rummet som ska sparas
     * @return sparat Room
     */
    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.saveRoom(room);
    }

    /**
     * Uppdaterar ett befintligt rum.
     *
     * @param id är rummets id
     * @param roomDetails är nya värden
     * @return uppdaterat Room eller 404 om det inte finns
     */
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Optional<Room> room = roomService.getRoomById(id);
        if (room.isPresent()) {
            roomDetails.setId(id);
            return ResponseEntity.ok(roomService.saveRoom(roomDetails));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tar bort ett rum baserat på id.
     *
     * @param id är rummets ID
     * @return 200 OK om borttaget annars 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if (roomService.getRoomById(id).isPresent()) {
            roomService.deleteRoom(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}