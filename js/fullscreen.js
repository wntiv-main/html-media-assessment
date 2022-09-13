var fullscreenEls = [];

Array.from(document.getElementsByClassName("imgcontainer")).forEach(el => {
    el.addEventListener("click", function handleClick() {
        for (var i = 0; i < fullscreenEls.length; i++) {
            var pair = fullscreenEls[i];
            if (pair.initialEl == el) {
                var fullscreenEl = pair.fullscreenEl;
                fullscreenEl.style.opacity = 0;
                setTimeout(fullscreenEl.remove.bind(fullscreenEl), 300);
                fullscreenEls.splice(i, 1);
                return;
            }
        }
        var fullscreenEl = el.cloneNode(true);
        fullscreenEl.addEventListener("click", handleClick);
        fullscreenEl.classList.add("fullscreen");
        document.body.appendChild(fullscreenEl);
        setTimeout(() => fullscreenEl.style.opacity = 1, 10);
        fullscreenEls.push({
            initialEl: el,
            fullscreenEl: fullscreenEl
        });
    });
})