package se.gritacademy.roominize.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.gritacademy.roominize.model.PlacedItem;
import se.gritacademy.roominize.model.Room;
import se.gritacademy.roominize.model.RoomLayout;
import se.gritacademy.roominize.repository.RoomRepository;

import java.util.*;

/**
 * Service-klass för Room.
 * Hanterar affärslogik för rum, inklusive skapande och uppdatering baserat på JSON-layout från frontend.
 * Ansvarar även för CRUD-operationer och kopplingar mellan Room och PlacedItem.
 */
@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;


    /**
     * Hämtar alla rum från databasen.
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
     * Hämtar ett specifikt rum baserat på ID.
     */
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }



    /**
     * Skapar ett nytt Room baserat på en RoomLayout (JSON).
     * Parsar JSON och konverterar objekt till PlacedItem.
     */
    @Transactional
    public Room createRoomFromLayout(RoomLayout layout) {

        try {
            ObjectMapper mapper = new ObjectMapper();

            Map<String, Object> parsed = mapper.readValue(layout.getJsonLayout(), Map.class);

            List<Map<String, Object>> objects =
                    (List<Map<String, Object>>) parsed.get("objects");

            Room room = new Room();
            room.setName(layout.getName());
            room.setPlacedItems(new ArrayList<>());

            if (objects != null) {
                for (Map<String, Object> obj : objects) {

                    PlacedItem item = new PlacedItem();

                    item.setX(getDouble(obj.get("x")));
                    item.setY(getDouble(obj.get("y")));
                    item.setRotation(getDouble(obj.get("rotation")));
                    item.setScale(getDouble(obj.get("scale")));
                    item.setFlipX(getDouble(obj.get("flipX")));

                    item.setRoom(room);

                    room.getPlacedItems().add(item);
                }
            }

            return roomRepository.save(room);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Room from layout", e);
        }
    }


    /**
     * Uppdaterar ett befintligt Room baserat på en RoomLayout (JSON).
     * Om rummet inte finns skapas ett nytt.
     */
    @Transactional
    public Room updateRoomFromLayout(Long id, RoomLayout layout) {

        Room room = roomRepository.findById(id)
                .orElseGet(() -> {
                    Room newRoom = new Room();
                    newRoom.setPlacedItems(new ArrayList<>());
                    return newRoom;
                });

        try {
            ObjectMapper mapper = new ObjectMapper();

            Map<String, Object> parsed = mapper.readValue(layout.getJsonLayout(), Map.class);

            List<Map<String, Object>> objects =
                    (List<Map<String, Object>>) parsed.get("objects");

            room.setName(layout.getName());

            room.getPlacedItems().clear();

            if (objects != null) {
                for (Map<String, Object> obj : objects) {

                    PlacedItem item = new PlacedItem();

                    item.setX(getDouble(obj.get("x")));
                    item.setY(getDouble(obj.get("y")));
                    item.setRotation(getDouble(obj.get("rotation")));
                    item.setScale(getDouble(obj.get("scale")));
                    item.setFlipX(getDouble(obj.get("flipX")));

                    item.setRoom(room);

                    room.getPlacedItems().add(item);
                }
            }

            return roomRepository.save(room);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update Room from layout", e);
        }
    }

    /**
     * Sparar eller uppdaterar ett Room direkt i databasen.
     */
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    // HELPER

    /**
     * Hjälpmetod för att konvertera Object till Double.
     */
    private Double getDouble(Object o) {
        if (o == null) return null;
        return ((Number) o).doubleValue();
    }

    // DELETE

    /**
     * Tar bort ett Room baserat på id.
     * Kastar ett undantag om rummet inte finns.
     */
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found: " + id);
        }
        roomRepository.deleteById(id);
    }
}