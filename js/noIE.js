// IE is too broken and does not support many useful/necessary features
if (/MSIE|Trident/.test(window.navigator.userAgent)) {
	alert("This page does not support IE as it lacks many of the features required by this page. Please try again using Chrome, Edge, Firefox etc.");
	throw new Error("IE is not supported!");
}