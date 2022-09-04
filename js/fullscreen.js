Array.from(document.getElementsByClassName("imgcontainer")).forEach(el => {
    el.addEventListener("click", e => el.classList.toggle("fullscreen"));
})