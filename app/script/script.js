///////////////
//Mobile Menu
///////////////

const btnOpen = document.querySelector("#btnOpen");
const btnClose = document.querySelector("#btnClose");
const media = window.matchMedia("(max-width: 53rem)")
const topNavMenu = document.querySelector(".topnav__menu");
const main = document.querySelector('main');
const html= document.querySelector("html");

function setupTopNav(e){
  if (e.matches){
    // console.log("mobile")
topNavMenu.setAttribute("inert", "");
topNavMenu.style.transition = "none";
} else{
  // console.log("dektop")
  topNavMenu.removeAttribute("inert");
  }
}

function openMobileMenu(){
  btnOpen.setAttribute("aria-expanded", "true");
  topNavMenu.removeAttribute("inert");
  topNavMenu.removeAttribute("style");
  main.setAttribute('inert', '');
  bodyScrollLockUpgrade.disableBodyScroll(body);

}

function closeMobileMenu(){
  btnOpen.setAttribute("aria-expanded", "false");
  topNavMenu.setAttribute("inert", "");
  main.removeAttribute('inert');
  bodyScrollLockUpgrade.enableBodyScroll(body);

  setTimeout(() =>{
    topNavMenu.style.transition = "none"
  }, 200)

}

btnOpen.addEventListener("click", openMobileMenu)
btnClose.addEventListener("click", closeMobileMenu)

///////////////
//Logo Carousel
///////////////

const scrollers = document.querySelectorAll(".logo-wrapper")

if(!window.matchMedia("(prefer-reduced-motion: reduce)").matches){
    addAnimation();
}

function addAnimation(){
    scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector(".logos");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) =>{
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

  media.addEventListener("change", function(e){
    setupTopNav(e);
  })