package se.gritacademy.roominize.controller;

import se.gritacademy.roominize.model.Furniture;
import se.gritacademy.roominize.service.FurnitureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

/**
 * Detta är en Controller-klass som hanterar REST API för Furniture.
 *
 * Den ansvarar för att ta emot HTTP-anrop från frontend,
 * skicka vidare till service-lagret och returnera svar.
 *
 * Innehåller även ett extra endpoint för att hämta SVG-filer
 * från serverns filsystem.
 */
@RestController
@RequestMapping("/api/furniture")
@CrossOrigin(origins = "*")
public class FurnitureController {

    @Autowired
    private FurnitureService furnitureService;

    /**
     * Hämtar alla möbler i systemet.
     *
     * @return lista av Furniture-objekt
     */
    @GetMapping
    public List<Furniture> getAllFurniture() {
        return furnitureService.getAllFurniture();
    }

    /**
     * Hämtar en specifik möbel baserat på id.
     *
     * @param id möbelns id
     * @return Furniture om den finns annars 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Furniture> getFurnitureById(@PathVariable Long id) {
        Optional<Furniture> furniture = furnitureService.getFurnitureById(id);
        if (furniture.isPresent()) {
            return ResponseEntity.ok(furniture.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Skapar en ny möbel i systemet.
     *
     * @param furniture objekt som ska sparas
     * @return sparad Furniture
     */
    @PostMapping
    public Furniture createFurniture(@RequestBody Furniture furniture) {
        return furnitureService.saveFurniture(furniture);
    }

    /**
     * Uppdaterar en befintlig möbel.
     *
     * @param id möbelns ID
     * @param furnitureDetails nya värden
     * @return uppdaterad Furniture eller 404 om den inte finns
     */
    @PutMapping("/{id}")
    public ResponseEntity<Furniture> updateFurniture(
            @PathVariable Long id,
            @RequestBody Furniture furnitureDetails) {

        Optional<Furniture> furniture = furnitureService.getFurnitureById(id);

        if (furniture.isPresent()) {
            furnitureDetails.setId(id);
            return ResponseEntity.ok(furnitureService.saveFurniture(furnitureDetails));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tar bort en möbel baserat på ID.
     *
     * @param id möbelns ID
     * @return 200 OK om borttagen annars 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFurniture(@PathVariable Long id) {
        if (furnitureService.getFurnitureById(id).isPresent()) {
            furnitureService.deleteFurniture(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    private static final String SVG_FOLDER = "src/main/resources/static/assets/svg";

    /**
     * Hämtar alla SVG-filer från serverns assets-mapp.
     *
     * Används i frontend för att lista alla tillgängliga SVG-möbler.
     *
     * @return lista av filnamn (.svg)
     * @throws IOException om filsystemet inte kan läsas
     */
    @GetMapping("/svgs")
    public List<String> getAllSvgs() throws IOException {

        Path svgPath = Paths.get(SVG_FOLDER);

        return Files.list(svgPath)
                .filter(path -> path.toString().endsWith(".svg"))
                .map(Path::getFileName)
                .map(Path::toString)
                .collect(Collectors.toList());
    }
}
