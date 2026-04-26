# Roominize 

## Projektbeskrivning

Roominize är ett webbaserat system för att designa och bygga rum digitalt. Användaren kan placera möbler, justera position, rotation och skala samt spara kompletta rumslayouter i en databas.

Projektet är byggt med:

- Java 17+
- Spring Boot 3+
- Gradle
- MySQL
- JavaScript (canvas-baserad editor)
- phpMyAdmin

---

## 4 huvudentiteter

- **Room** – ett rum som innehåller layout och placerade objekt  
- **Furniture** – möbler som kan placeras i ett rum  
- **PlacedItem** – en möbel instans placerad i ett specifikt rum
- **RoomLayout** - Det är ett helt rumm i systemet. 

---

## ⚙️ API-funktioner

API:et erbjuder:

- Full CRUD för Room, Furniture och PlacedItem  
- Spara och ladda rumsdesigner (JSON-layout)  
- SVG-stöd för möbler
- Automatisk konvertering mellan layout och canvas-objekt  
- Felhantering med HTTP-statuskoder  
- CORS-stöd för frontend  
- REST-baserad arkitektur  

---

## 📊 Hur projektet uppfyller kraven

### Implementationer

|  Implementation |
|------|---------------|
| Entiter | Room, Furniture, PlacedItem, RoomLayout |
| CRUD-operationer | Full CRUD via Controller + Service |
| Relationer | Room ↔ PlacedItem (OneToMany / ManyToOne) |
| Databas | MySQL via Spring Data JPA |
| JSON-hantering | Layout sparas som JSON-string |
| Felhantering | Optional + RuntimeException |
| Spring Boot | Backend byggd i Spring Boot 3 |
| Struktur | Controller / Service / Model / Repository |

---

### VG-krav

| Krav | Implementation |
|------|---------------|
| Avancerad logik | JSON → Room conversion i RoomService |
| Interaktiv frontend | Canvas-baserad editor i JavaScript |
| Drag & drop | HTML5 Drag & Drop API |
| Accessibility | WCAG 2.1 stöd (ARIA + live regions) |
| SVG import | Dynamisk hämtning av SVG-filer |
| Undo/Redo | Stack-baserad state-hantering |
| Rotation & scaling | Matematiska transformationer i canvas |
| LocalStorage | Sparar aktivt rum per användartyp |
| Realtidsrendering | Omdragning av canvas vid varje ändring |

---

##  Tekniska funktioner

### Java / Spring Boot
- REST API för rumsdata  
- JPA entities för databashantering  
- Service layer för affärslogik  
- JSON parsing med Jackson  

### JavaScript (Frontend)
- Canvas-rendering av rum  
- Drag & Drop API  
- Undo/Redo system  
- Accessibility (WCAG 2.1)  
- SVG + emoji-baserade objekt  

### Databas (MySQL)
- Lagrar Room, Furniture och PlacedItem  
- Relationer via foreign keys  
- JSON-layout sparas som LONGTEXT  

---

##  Validering och felhantering

- RuntimeException används för felhantering  
- Optional används för säker hämtning  

### HTTP statuskoder:
- **200 OK**
- **404 Not Found**
- **500 Internal Server Error**

---

## Affärslogik

- Möbler placeras med korrekt scale per kategori  
- Rotation sker med trigonometriska beräkningar  
- Flip (X-axis) stöds  
- JSON-layout kan återställas exakt som ursprungligt rum  

---

## API-endpoints
/api/rooms
/api/furniture
/api/placed-items
/swagger-ui/index.html


## Tangentbordsstyrning
- Rotation (R)
- Spegling (F)
- Radering (delete)
- Förstoring/Förminskning (+, -)
- Förflytta sig på knappar och föremål (tab)
- Sätta möbler i canvas (Enter/space)
- Flytta runt föremål i canvas (pilar)

  ## SQL-dump och docker-compose.yml
- De finns att hämta i repot
- Glöm inte att ha docker uppe med  docker compose up -d.


  ## Hur man öppnar en databas i intellij:
**Detta baseras på mina spring.datasource värden i application.properties. Kolla i mitt projekt ovan**
- Gå till **View → Tool Windows → Database**.
   - Klicka på **+ → Data Source → MySQL**.
   - Fyll i uppgifter från `application.properties`:
     - Host: `localhost`
     - Port: `3306`
     - Database: `roomdb`
     - User: `root`
     - Password: `rootpassword`
     - JDBC URL: `jdbc:mysql://localhost:3306/roomdb`
   - Klicka **Test Connection** och sedan **OK**.
 
   - Applikationen visas i localhost:8080
 
  ## Installation och körning

### Klona och köra projektet via Git Bash

Om du vill bara ha projektet direkt i min dator

1. Öppna Git Bash i din dator.

2. Klona projektet:

```bash
git clone https://github.com/MaryamRasouli526/RoomInize.git
```

  ## Författare
Maryam Rasouli - utvecklaren

Email: maryam.rasouli@gritacademy.se

### Version
- 1.0


