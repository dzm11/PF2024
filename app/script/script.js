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

async function copyContent() {
    try {
      await navigator.clipboard.writeText('Hello@melon.studio');
      console.log('Content copied to clipboard');
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error('Failed to copy: ', err);
      /* Rejected - text failed to copy to the clipboard */
    }
  }
