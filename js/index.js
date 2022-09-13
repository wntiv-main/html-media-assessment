document.querySelectorAll("a.email").forEach(el => el.setAttribute("href", `mailto:${el.innerText}`));

function onTableScroll(el) {
	var shadows = [];
	if (el.scrollWidth - el.clientWidth < 20) {
		el.style.boxShadow = "none";
		return;
	}
	if ((el.scrollWidth - el.clientWidth) - el.scrollLeft > 10) {
		shadows.push("inset #ffffff80 -50px 0px 50px -50px");
	}
	if (el.scrollLeft > 10) {
		shadows.push("inset #ffffff80 50px 0px 50px -50px");
	}
	el.style.boxShadow = shadows.join(", ") || "none";
}
document.querySelectorAll("article .tablecontainer").forEach(el => {
	el.addEventListener("scroll", e => onTableScroll(e.target));
	window.addEventListener("resize", e => onTableScroll(el));
	onTableScroll(el);
});

function scrollToAnchor() {
	setTimeout(() => {
		var hash = location.hash.replace("#", "");
		if (hash) {
			document.scrollingElement.scrollTo({
				behavior: "smooth",
				top: document.getElementById(hash).getBoundingClientRect().top +
					document.scrollingElement.scrollTop -
					document.querySelector("nav").getBoundingClientRect().height -
					20
			});
		};
	}, 100);
}

document.querySelectorAll("h2").forEach(el => {
	var section = encodeURIComponent(el.innerText.toLowerCase().replace(/\s/g, "-"));
	var anchor = document.createElement("a");
	anchor.innerText = "\u00A7";
	anchor.id = section;
	anchor.href = `#${section}`;
	anchor.title = "Link to this section";
	anchor.className = "section-link";
	anchor.addEventListener("click", scrollToAnchor);
	el.prepend(anchor);
});

scrollToAnchor();