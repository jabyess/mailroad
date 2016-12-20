
/**
	 * Wraps a function and fires it based on the delay specified.
	 * @param {function} func - function to debounce
	 * @param {int} wait - delay between function execution in milliseconds
	 * @param {boolean} immediate - executes function at beginning of timeout or end. default false.
	 */
export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};