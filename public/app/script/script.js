///////////////
//Barba JS
///////////////

// barba.init({
//   transitions: [{
//     name: 'opacity-transition',
//     leave(data) {
//       return gsap.to(data.current.container, {
//         opacity: 0
//       });
//     },
//     enter(data) {
//       return gsap.from(data.next.container, {
//         opacity: 0
//       });
//     }
//   }]
// });


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

async function fetchPlayerInfo() {
  try {
    const response = await fetch('/player-info');
    if (!response.ok) {
      throw new Error('Error fetching player info');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching player info:', error.message);
    throw error;
  }
}

function formatTimeAgo(timeElapsed) {
  const minutesAgo = Math.floor(timeElapsed / (1000 * 60));
  if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  } else if (minutesAgo < 1440) {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo} hours ago`;
  } else {
    const daysAgo = Math.floor(minutesAgo / 1440);
    return `${daysAgo} days ago`;
  }
}

async function displayTrackInfo() {
  try {
    const { currentTrack, recentTracks } = await fetchPlayerInfo();
    const trackInfo = document.getElementById('widgets__spotify');

    if (currentTrack && currentTrack.is_playing) {
      // Display currently playing track
      const trackName = currentTrack.item.name;
      const artistName = currentTrack.item.artists.map(artist => artist.name).join(', ');
      const trackUrl = currentTrack.item.external_urls.spotify;
      const imageUrl = currentTrack.item.album.images[0].url;

      // Tworzymy zawartość widgetu Spotify
      trackInfo.innerHTML = `
        <div class="widgets__spotify--header">
            <div class="header">Listening</div>
            <div class="time" id="isLiveContainer"></div>
        </div>
        <a href="${trackUrl}" target="_blank" id="spotifyLink">
            <div id="spotifyContainer" class="widgets__spotify--content">
                <img src="${imageUrl}" id="imgContainer" alt="" height="60px" width="60px">
                <div class="song">
                    <div class="song__title" id="titleContainer">${trackName}</div>
                    <div class="song__author" id="authorContainer">${artistName}</div>
                </div>
            </div>
        </a>
    `;

      const isLiveContainer = trackInfo.querySelector('#isLiveContainer');
      isLiveContainer.innerHTML = 'LIVE';
      isLiveContainer.classList.add('live');

      // trackInfo.innerHTML = `
      //   <div>
      //     <img src="${imageUrl}" alt="${trackName} Cover" style="max-width: 200px;">
      //     <p>
      //       <strong>${trackName}</strong> - ${artistName} (Played ${timeElapsedString})
      //       <br>
      //       <a href="${trackUrl}" target="_blank">Listen on Spotify</a>
      //     </p>
      //   </div>
      // `;
    } else if (recentTracks && recentTracks.items.length > 0) {
      // Display latest recently played track
      const latestTrack = recentTracks.items[0].track;
      const trackName = latestTrack.name;
      const artistName = latestTrack.artists.map(artist => artist.name).join(', ');
      const playedAt = new Date(recentTracks.items[0].played_at);
      const timeElapsed = Date.now() - playedAt.getTime();
      const timeElapsedString = formatTimeAgo(timeElapsed);
      const trackUrl = latestTrack.external_urls.spotify;
      const imageUrl = latestTrack.album.images[0].url;



      trackInfo.innerHTML = `
        <div class="widgets__spotify--header">
            <div class="header">Listening</div>
            <div class="time" id="isLiveContainer">${timeElapsedString}</div>
        </div>
        <a href="${trackUrl}" target="_blank" id="spotifyLink">
            <div id="spotifyContainer" class="widgets__spotify--content">
                <img src="${imageUrl}" id="imgContainer" alt="" height="60px" width="60px">
                <div class="song">
                    <div class="song__title" id="titleContainer">${trackName}</div>
                    <div class="song__author" id="authorContainer">${artistName}</div>
                </div>
            </div>
        </a>
    `;
    } else {
      trackInfo.textContent = 'No track data available';
    }
  } catch (error) {
    console.error('Error displaying track info:', error.message);
  }
}
// Call the function to initially display track info
displayTrackInfo();


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


//////////////////
/// Google Consent
//////////////////

function consentGranted() {
  // Zapisujemy stan zgody w localStorage
  localStorage.setItem('cookieConsent', 'true');
  // Aktualizujemy stan zgody za pomocą gtag
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
  // Ukrywamy banner
  document.getElementById('cookieBanner').style.display = 'none';
}

function consentDenied() {
  // Zapisujemy stan zgody w localStorage
  localStorage.setItem('cookieConsent', 'false');
  console.log(localStorage.getItem('cookieConsent'));


  // Aktualizujemy stan zgody za pomocą gtag
  gtag('consent', 'update', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
  });
  // Ukrywamy banner
  document.getElementById('cookieBanner').style.display = 'none';
}

// Sprawdzamy stan zgody przy ładowaniu strony
window.addEventListener('load', function () {

  try {
      // Pobieramy stan zgody z localStorage
      var cookieConsent = localStorage.getItem('cookieConsent');
      console.log(cookieConsent);

      // Jeśli zgoda została udzielona wcześniej, ukrywamy banner
      if (cookieConsent === 'true') {
          document.getElementById('cookieBanner').style.display = 'none';
      }
      // Jeśli zgoda została odmówiona wcześniej, ukrywamy banner i aktualizujemy stan zgody
      else if (cookieConsent === 'false') {
          consentDenied();
          document.getElementById('cookieBanner').style.display = 'block';
      }
      // Jeśli nie ma zgody w localStorage, wyświetlamy popup
      else {
          document.getElementById('cookieBanner').style.display = 'block';
      }
  } catch (e) {
      // Obsługa błędu dostępu do localStorage
      console.error('Error accessing localStorage:', e);
      // Wyświetlamy popup w przypadku błędu dostępu do localStorage
      document.getElementById('cookieBanner').style.display = 'block';
  }
});


