# Event Booking GraphQL API
![GraphQL Event Booking API](https://i.postimg.cc/BvSRfPL7/GraphQl.png)

Ovaj GraphQL API je napravljen koristeći tehnologije MongoDB, Node.js i GraphQL. Svaka od ovih tehnologija ima svoju ulogu u izgradnji API-ja:

- **MongoDB** se koristi kao baza podataka za skladištenje podataka o događajima, korisnicima i rezervacijama.
- **Node.js** u kombinaciji sa **Express.js**-om se koristi za backend implementaciju API-ja i za izvršavanje GraphQL upita.
- **GraphQL** se koristi kao upitni jezik za pristup podacima i definisanje strukture API-ja.

## Modeli
![GraphQL Event Booking API](https://i.postimg.cc/JhbXL08X/Graph-QL-Event-Booking-API-PMOV.png)

API ima tri osnovna modela:

1. **Event (Događaj)** - Model koji predstavlja pojedinačni događaj sa atributima kao što su id, title(naslov), description(opis), price(cena), date(datum) i creator(referenca ka User modelu, id korisnika koji je kreirao dati dogadjaj).

2. **User (Korisnik)** - Model koji predstavlja korisnika sa atributima kao što su id, email, password(lozinka), isManager(uloga, običan korisnik ili menadžer) i createdEvents(listu id-ijeva svih dogadjaja).

3. **Booking (Rezervacija)** - Model koji predstavlja rezervaciju korisnika za određeni događaj. Sadrzi atribute id, event(referenca ka modelu Event), user(referenca ka modelu User), createdAt i updatedAt.

Kardinalnosti veza izmedju modela jesu sledece:

- **User** moze kreirati vise **Event**-ova, dok jedan **Event** moze biti kreiran od jednog i samo jednog **User**-a.
- **Booking** moze biti kreiran od jednog i samo jednog **User**-a, dok jedan **User** moze kreirati vise **Booking**-a.
- **Booking** se moze odnositi na jedan i samo jedan **Event**, dok jedan **Event** moze biti deo vise **Booking**-a.

## Korisničke uloge
![GraphQL Event Booking API](https://i.postimg.cc/bYWP0r7K/Korisnicke-uloge.png)

User model ima dve korisničke uloge:

- **Običan korisnik** - Može praviti rezervacije i otkazivati ih.
- **Menadžer** - Može izvršavati CRUD operacije nad događajima i pregledati sve rezervacije.

## Slučajevi korišćenja

API podržava sledeće slučajeve korišćenja:

- Registracija korisnika
- Registracija menadžera
- Login korisnika
- Login menadžera
- Kreiranje događaja
- Izmena događaja
- Pregled svih događaja
- Brisanje događaja
- Pravljenje rezervacije
- Otkazivanje rezervacije
- Pregled svih rezervacija
- Odjava korisnika/menadzera
