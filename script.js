// Dog data - Replace with your actual image paths
const dogs = [
  {
    name: "Penny",
    breed: "Boston Terrier",
    age: "2 years",
    image: "Photos/BostonTerrier.png",  // Local image path (replace with actual path)
  },
  {
    name: "bo'oh o' wah'ah",
    breed: "English Bull dog",
    age: "1.5 years",
    image: "Photos/EnglishBullDog.png",
  },
  {
    name: "Maximus",
    breed: "German Shepard",
    age: "3 years",
    image: "Photos/GermanShepard.png",
  },
  {
    name: "Inca",
    breed: "Golden Retriever",
    age: "10 months",
    image: "Photos/GoldenRetriever.png",
  },
  {
    name: "Gabby",
    breed: "Great Dane",
    age: "6 months",
    image: "Photos/GreatDane.png",
  },
  {
    name: "Mr World Wide",
    breed: "PitBull",
    age: "10 years",
    image: "Photos/PitBull.png",
  },
  {
    name: "Daisy",
    breed: "Poodle",
    age: "11 months",
    image: "Photos/Poodle.png",
  },
  {
    name: "Jamal-que",
    breed: "Staffy",
    age: "3.5 years",
    image: "Photos/Staffy.png",
  },
  {
    name: "Milo",
    breed: "Yorkie",
    age: "14 years",
    image: "Photos/Yorkie.png",
  },

  {
    name: "Husk",
    breed: "Husky",
    age: "9 months",
    image: "Photos/Husky.png",
  },
  {
    name: "Puggy",
    breed: "Pug",
    age: "5 years",
    image: "Photos/Pug.png",
  },
  {
    name: "Shnotz",
    breed: "Schauzer",
    age: "7 months",
    image: "Photos/Shnauzer.png",
  },
  {
    name: "Lad",
    breed: "Scottish Terrier",
    age: "3.5 years",
    image: "Photos/ScottishTerrier.png",
  },
  {
    name: "Bagle",
    breed: "Beagle",
    age: "1 years",
    image: "Photos/Beagle.png",
  },
   {
    name: "Jan Allerman",
    breed: "German Shepherd",
    age: "3 years",
    image: "Photos/GermanShepard2.png", // Replace with actual path
  },
  {
    name: "Daisy",
    breed: "Dachshund",
    age: "2 years",
    image: "Photos/Dachsund.png", // Replace with actual path
  },
  {
    name: "mr T",
    breed: "Rottweiler",
    age: "4 years",
    image: "Photos/Rotweiler.png", // Replace with actual path
  },
  {
    name: "Rocky",
    breed: "Boxer",
    age: "5 years",
    image: "Photos/Boxer.png", // Replace with actual path
  },
  {
    name: "Benny",
    breed: "Basset Hound",
    age: "6 years",
    image: "Photos/BassetHound.png", // Replace with actual path
  },
  {
    name: "Spot",
    breed: "Dalmatian",
    age: "1 year",
    image: "Photos/Dalmation.png", // Replace with actual path
  },
  {
    name: "Scout",
    breed: "Border Collie",
    age: "2.5 years",
    image: "Photos/BorderCollie.png", // Replace with actual path
  },
  {
    name: "Milo",
    breed: "Alaskan Malamut",
    age: "4 years",
    image: "Photos/AlaskanMalamut.png", // Replace with actual path
  },
  {
    name: "Jaco",
    breed: "Boerbull",
    age: "5 years",
    image: "Photos/Boerbull.png", // Replace with actual path
  },
  {
    name: "Croissant ass chien",
    breed: "French Bulldog",
    age: "2 years",
    image: "Photos/FrenchBullDog.png", // Replace with actual path
  },
  {
    name: "Rex",
    breed: "Rhodesian Ridgeback",
    age: "6 years",
    image: "Photos/RhodesianRidgeback.png", // Replace with actual path
  },
  {
    name: "Lee",
    breed: "Shih Tzu",
    age: "1 year",
    image: "Photos/ShiTzu.png", // Replace with actual path
  },
  {
    name: "Mayo Monkey",
    breed: "Swiss Shepherd",
    age: "3 years",
    image: "Photos/SwissShepard.png", // Replace with actual path
  },
  
];




// Function to display the first 4 dogs
function displayDogCards(dogs) {
  const container = document.getElementById('dog-cards-container');
  container.innerHTML = ''; // Clear previous content

  // Slice the array to only display first 4 dogs
  dogs.slice(0, 4).forEach(dog => {
    // Create the card elements
    const card = document.createElement('article');
    card.classList.add('home-card', 'home-dog');

    const media = document.createElement('div');
    media.classList.add('home-dog__media');
    media.style.backgroundImage = `url(${dog.image})`;

    const body = document.createElement('div');
    body.classList.add('home-dog__body');

    const name = document.createElement('h3');
    name.classList.add('home-dog__name');
    name.textContent = dog.name;

    const breedAge = document.createElement('p');
    breedAge.classList.add('home-text--muted');
    breedAge.textContent = `${dog.breed} • ${dog.age}`;

    const adoptBtn = document.createElement('a');
    adoptBtn.classList.add('home-btn', 'home-btn--sm');
    adoptBtn.href = "#";
    adoptBtn.textContent = "Adopt me";
    adoptBtn.style.fontWeight = "bold"; // Bold text
    adoptBtn.style.textAlign = "center"; // Center text
    adoptBtn.addEventListener('click', function() {
      alert(`You have chosen to adopt ${dog.name}. Thank you!`);
    });

    body.appendChild(name);
    body.appendChild(breedAge);
    body.appendChild(adoptBtn);
    card.appendChild(media);
    card.appendChild(body);
    container.appendChild(card);
  });
}

// Initial display of dog cards
displayDogCards(dogs);

// Optional: Add search/filter functionality
const searchInput = document.querySelector('#search-input');
if(searchInput) {
  searchInput.addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    const filteredDogs = dogs.filter(dog => dog.name.toLowerCase().includes(query) || dog.breed.toLowerCase().includes(query));
    displayDogCards(filteredDogs);
  });
}