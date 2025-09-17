// Dog data - Replace with your actual image paths
const dogs = [
  {
    name: "Penny",
    breed: "Boston Terrier",
    age: "2 years",
    image: "Photos/BostonTerrier.png",  // Local image path (replace with actual path)
  },
  {
    name: "Luna",
    breed: "English Bull dog",
    age: "1.5 years",
    image: "Photos/EnglishBullDog.png",
  },
  {
    name: "Max",
    breed: "German Shepard",
    age: "3 years",
    image: "Photos/GermanShepard.png",
  },
  {
    name: "Daisy",
    breed: "Golden Retriever",
    age: "10 months",
    image: "Photos/GoldenRetriever.png",
  },
  {
    name: "Daisy",
    breed: "Great Dane",
    age: "6 months",
    image: "Photos/GreatDane.png",
  },
  {
    name: "Daisy",
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
    name: "Daisy",
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
];

// Function to create and display dog cards dynamically
function displayDogCards(dogs) {
  const container = document.getElementById('dog-cards-container');
  container.innerHTML = ''; // Clear previous content

  dogs.forEach(dog => {
    console.log(dog.image); // Debugging image paths

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

// Call the function to display the dog cards
displayDogCards(dogs);