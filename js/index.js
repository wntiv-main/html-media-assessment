document.querySelectorAll("a.email").forEach(el => el.setAttribute("href", `mailto:${el.innerText}`));

function onTableScroll(el){
	var shadows = [];
	if(el.scrollWidth - el.clientWidth < 20) {
		el.style.boxShadow = "none";
		return;
	}
	if((el.scrollWidth - el.clientWidth) - el.scrollLeft > 10) {
		shadows.push("inset #ffffff80 -50px 0px 50px -50px");
	}
	if(el.scrollLeft > 10) {
		shadows.push("inset #ffffff80 50px 0px 50px -50px");
	}
	el.style.boxShadow = shadows.join(", ") || "none";
}
document.querySelectorAll("article .tablecontainer").forEach(el => {
	el.addEventListener("scroll", e => onTableScroll(e.target));
	window.addEventListener("resize", e => onTableScroll(el));
	onTableScroll(el);
})