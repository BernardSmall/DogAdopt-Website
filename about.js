const staffmember = [
  {
    name: "Ava Thompson",
    title: "Director • Behavior & Training",
    photo: "Photos/Ava Thompson.png",
  },
  {
    name: "Luis Ortega",
    title: "Shelter Partnerships",
    photo: "Photos/Luis Ortega.png",
  },
  {
    name: "Maya Chen",
    title: "Volunteer Programs",
    photo: "Photos/Maya Chen.png",
  },
  {
    name: "Sam Patel",
    title: "Community Outreach",
    photo: "Photos/Sam Patel.png",
  },
];

function displayStaffCards(staff) {
  const container = document.getElementById('team-cards-container');
  container.innerHTML = ''; // Clear previous content

  staff.forEach(member => {
    // Create the card elements
    const card = document.createElement('article');
    card.classList.add('about-card', 'about-person');

    const media = document.createElement('div');
    media.classList.add('about-person__media');
    const img = document.createElement('img');
    img.src = member.photo;
    img.alt = member.name;
    media.appendChild(img);

    const body = document.createElement('div');
    body.classList.add('about-person__body');

    const name = document.createElement('h3');
    name.classList.add('about-person__name');
    name.textContent = member.name;

    const title = document.createElement('p');
    title.classList.add('about-muted');
    title.textContent = member.title;

    body.appendChild(name);
    body.appendChild(title);
    card.appendChild(media);
    card.appendChild(body);
    container.appendChild(card);
  });
}

displayStaffCards(staffmember);
