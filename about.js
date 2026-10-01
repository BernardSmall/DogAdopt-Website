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
    img.width = 1024;
    img.height = 1536;
    img.loading = "lazy";
    img.decoding = "async";
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


const menuButton = document.querySelector('.about-nav__toggle');
const header = document.querySelector('.about-header');
const desktopLayout = window.matchMedia('(min-width: 60rem)');

function setMenuOpen(open) {
  document.body.classList.toggle('about-menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});
header.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});
header.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
});
desktopLayout.addEventListener('change', () => {
  const focusedElement = document.activeElement;
  const focusWillHide = !desktopLayout.matches &&
    focusedElement.matches('.about-nav a, .about-header__cta a');
  const toggleWillHide = desktopLayout.matches && focusedElement === menuButton;
  setMenuOpen(false);
  if (focusWillHide) menuButton.focus();
  if (toggleWillHide) header.querySelector('.about-brand').focus();
});
document.body.classList.add('about-menu-ready');
document.getElementById('about-year').textContent = new Date().getFullYear();
