///////////////
//Mobile Menu
///////////////

const btnOpen = document.querySelector("#btnOpen");
const btnClose = document.querySelector("#btnClose");
const media = window.matchMedia("(max-width: 53rem)")
const topNavMenu = document.querySelector(".topnav__menu");
const main = document.querySelector('main');
const html = document.querySelector("html");
const body = document.querySelector("body");

function setupTopNav(e) {
  if (e.matches) {
    topNavMenu.setAttribute("inert", "");
    topNavMenu.style.transition = "none";
  } else {
    topNavMenu.removeAttribute("inert");
  }
}

function openMobileMenu() {
  btnOpen.setAttribute("aria-expanded", "true");
  body.style.overflow = "hidden";
  topNavMenu.setAttribute("data-lenis-prevent", "");
  topNavMenu.removeAttribute("inert");
  topNavMenu.removeAttribute("style");
  main.setAttribute('inert', '');
  // bodyScrollLockUpgrade.disableBodyScroll(body);

}

function closeMobileMenu() {
  btnOpen.setAttribute("aria-expanded", "false");
  topNavMenu.setAttribute("inert", "");
  main.removeAttribute('inert');
  // bodyScrollLockUpgrade.enableBodyScroll(body);

  setTimeout(() => {
    topNavMenu.style.transition = "none"
  }, 200)

}

btnOpen.addEventListener("click", openMobileMenu)
btnClose.addEventListener("click", closeMobileMenu)

///////////////
//Logo Carousel
///////////////

const scrollers = document.querySelectorAll(".logo-wrapper")

if (!window.matchMedia("(prefer-reduced-motion: reduce)").matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);

    const scrollerInner = scroller.querySelector(".logos");
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    })
  });
}

setupTopNav(media);

media.addEventListener("change", function (e) {
  setupTopNav(e);
})

///////////////
//Copy Content
///////////////

function copyContent(clickedTooltip) {
  // Kopiowanie zawartości do schowka
  navigator.clipboard.writeText("Hello@melon.studio")
    .then(function () {
      // Wyświetlanie tooltipa
      let tooltip = document.getElementById("tooltip");
      let tooltip_menu = document.getElementById("tooltip-menu");

      // Sprawdzenie, który tooltip został kliknięty
      if (clickedTooltip === tooltip) {
        tooltip.style.display = "block";
        tooltip_menu.style.display = "none";
      } else if (clickedTooltip === tooltip_menu) {
        tooltip.style.display = "none";
        tooltip_menu.style.display = "block";
      }

      // Ukrywanie tooltipów po 3 sekundach
      setTimeout(function () {
        tooltip.style.display = "none";
        tooltip_menu.style.display = "none";
      }, 2000);
    })
    .catch(function (error) {
      console.error('Copy failed: ', error);
    });
}

///////////////
//Smooth Scroll
///////////////

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)


// ///////////////
// //Fetching Song
// ///////////////

async function getCurrentTrack() {
  try {
    const response = await fetch('/api/current-track');

    // Sprawdzenie, czy odpowiedź jest poprawna (status 200)
    if (!response.ok) {
      throw new Error('Nie można pobrać danych');
    }

    const data = await response.json();
    const currentTrackElement = document.getElementById('spotifyContainer');
    const isLiveContainer = document.getElementById('isLiveContainer');
    const spotifyLink = document.getElementById('spotifyLink');

    const songLink = data.item.external_urls.spotify;


    spotifyLink.href = songLink;

    if (data.is_playing) {
      // Jeśli odtwarzana jest piosenka
      isLiveContainer.innerHTML = 'LIVE';
      isLiveContainer.classList.add('live');
    } else {
      const lastPlayedTimestamp = new Date(data.timestamp).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastPlayedTimestamp;

      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;

      if (timeDifference < hour) {
        const minutesAgo = Math.floor(timeDifference / minute);
        isLiveContainer.innerHTML = `${minutesAgo} minutes ago`;
      } else if (timeDifference < day) {
        const hoursAgo = Math.floor(timeDifference / hour);
        isLiveContainer.innerHTML = `${hoursAgo} hours ago`;
      } else {
        const daysAgo = Math.floor(timeDifference / day);
        isLiveContainer.innerHTML = `${daysAgo} days ago`;
      }
    }

    currentTrackElement.innerHTML = `
      <img src="${data.item.album.images[0].url}" id="imgContainer" alt="" height="60px" width="60px">
      <div class="song">
          <div class="song__title" id="titleContainer">${data.item.name}</div>
          <div class="song__author" id="authorContainer">${data.item.artists[0].name}</div>
      </div>
    `;
  } catch (error) {
    console.error('Błąd pobierania aktualnej piosenki:', error);

    // Obsługa błędów dla użytkownika (może być wyświetlony jakiś komunikat)
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Wystąpił błąd podczas pobierania danych.';
    document.body.appendChild(errorMessage);
  }
}

getCurrentTrack();







//////////////////
/// Podawanie daty
//////////////////

// Utwórz funkcję, która aktualizuje datę
function updateDate() {
  try {
    var now = new Date();

    // Utwórz obiekt formatowania daty/czasu z opcją timeZone
    var formatter = new Intl.DateTimeFormat('pl-PL', {
      timeZone: 'Europe/Warsaw',
      timeStyle: 'short', // lub 'short', 'long' itp., w zależności od preferencji
      hour12: false // aby użyć zapisu 24-godzinnego
    });

    // Sformatuj aktualny czas dla Poznania
    var formattedTime = formatter.format(now);

    // Znajdź elementy HTML
    const currentDateContact = document.getElementById('currentDateContact');
    const currentDate = document.getElementById('currentDate');

    // Aktualizuj tekst w elementach HTML
    if (currentDate) {
      currentDate.innerHTML = formattedTime;
    } else if (currentDateContact) {
      currentDateContact.innerHTML = formattedTime;
    } else {
      throw new Error('Nie można znaleźć elementu HTML.');
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas aktualizowania daty:', error.message);
  }
}

// Wywołaj funkcję aktualizacji daty
updateDate();

// Ustaw interwał do automatycznego aktualizowania daty co minutę
setInterval(updateDate, 60000);



//////////////
/// Akordeony
//////////////
const items = document.querySelectorAll('.accordion-item');

function toggleAccordion() {
  const itemToggle = this.querySelector('button').getAttribute('aria-expanded');

  for (i = 0; i < items.length; i++) {
    items[i].querySelector('button').setAttribute('aria-expanded', 'false');
  }

  if (itemToggle == 'false') {
    this.querySelector('button').setAttribute('aria-expanded', 'true');
  }
}

items.forEach(item => item.addEventListener('click', toggleAccordion));


/////////////////////
///Move top on scroll
/////////////////////
// document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

// document.body.scrollTop = 0; // For Safari