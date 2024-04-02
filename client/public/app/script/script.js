///////////////
//Mobile Menu
///////////////

const btnOpen = document.querySelector("#btnOpen");
const btnClose = document.querySelector("#btnClose");
const media = window.matchMedia("(max-width: 53rem)")
const topNavMenu = document.querySelector(".topnav__menu");
const main = document.querySelector('main');
const html = document.querySelector("html");

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
  topNavMenu.removeAttribute("inert");
  topNavMenu.removeAttribute("style");
  main.setAttribute('inert', '');
  bodyScrollLockUpgrade.disableBodyScroll(body);

}

function closeMobileMenu() {
  btnOpen.setAttribute("aria-expanded", "false");
  topNavMenu.setAttribute("inert", "");
  main.removeAttribute('inert');
  bodyScrollLockUpgrade.enableBodyScroll(body);

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


///////////////
//Copy Content
///////////////

async function copyContent() {
  try {
    await navigator.clipboard.writeText("Hello@melon.studio");
    console.log("Content copied to clipboard");
    /* Resolved - text copied to clipboard successfully */
  } catch (err) {
    console.error("Failed to copy: ", err);
    /* Rejected - text failed to copy to the clipboard */
  }
}

setupTopNav(media);

media.addEventListener("change", function (e) {
  setupTopNav(e);
})


///////////////
//Smooth Scroll
///////////////

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)


///////////////
//Fetching Song
///////////////
const jsonUrl = 'http://localhost:3001/current-song';


fetch(jsonUrl)
  .then(response => response.json()) // Assuming the server response is JSON
  .then(data => {
    // console.log(data);
    // Log the response data to the console
    // You can now save the data or use it in your application as needed
    // Saving the response data depends on where you want to save it
    // For example, saving it to local storage in the browser:
    localStorage.setItem('currentSong', JSON.stringify(data));
  })
  .catch(error => console.error('Error fetching current song:', error));




fetchDataAndUpdate()
// Funkcja do pobierania i aktualizowania danych
function fetchDataAndUpdate() {
  
  // Pobierz dane z pliku JSON za pomocą metody fetch()
  fetch(jsonUrl)
    .then(response => {
      // Sprawdź, czy odpowiedź jest poprawna
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Jeśli odpowiedź jest poprawna, zwróć dane w formacie JSON
      return response.json();
    })
    .then(jsonData => {
      // Sprawdź czy aktualnei słcuham piosenek
      const lastPlayed = jsonData.is_playing;
      const statusContainer = document.getElementById('isLiveContainer');

      if (lastPlayed) {
        statusContainer.innerHTML = "LIVE";
        statusContainer.classList.add("live");

      } else {

        const lastPlayedTimestamp = jsonData.timestamp;
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastPlayedTimestamp;

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (timeDifference < hour) {
          const minutesAgo = Math.floor(timeDifference / minute);
          statusContainer.innerHTML = `${minutesAgo} minutes ago`;
      } else if (timeDifference < day) {
          const hoursAgo = Math.floor(timeDifference / hour);
          statusContainer.innerHTML = `${hoursAgo} hours ago`;
      } else {
          const daysAgo = Math.floor(timeDifference / day);
          statusContainer.innerHTML = `${daysAgo} days ago`;
      }

      }

      // Pobierz nazwę piosenki z danych JSON
      const songName = jsonData.item.name;
      const songAuthor = jsonData.item.artists[0].name;
      const songImage = jsonData.item.album.images[1].url;
      const songLink = jsonData.item.external_urls.spotify;


      // Znajdź kontener HTML
      const titleContainer = document.getElementById('titleContainer');
      const authorContainer = document.getElementById('authorContainer');
      const imgContainer = document.getElementById('imgContainer');
      const spotifyLink = document.getElementById('spotifyLink');

      // Wstaw nazwę piosenki do kontenera HTML
      titleContainer.innerHTML = songName;
      authorContainer.innerHTML = songAuthor;
      imgContainer.src = songImage;
      spotifyLink.href = songLink;

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Wywołaj funkcję fetchDataAndUpdate() co 10 sekund (10000 ms)
// setInterval(fetchDataAndUpdate, 1000);

var now = new Date();

// Utwórz obiekt formatowania daty/czasu z opcją timeZone
var formatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    timeStyle: 'short', // lub 'short', 'long' itp., w zależności od preferencji
    hour12: false // aby użyć zapisu 24-godzinnego
});

// Sformatuj aktualny czas dla Poznania
var formattedTime = formatter.format(now);
const currentDate = document.getElementById('currentDate');
currentDate.innerHTML = formattedTime;


