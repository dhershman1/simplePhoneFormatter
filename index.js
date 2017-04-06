/**
 * @overview Format phone numbers into a nice clean state
 * @author Dustin Hershman
 * @version 1.1.0
 */

/**
 * @module Phone-Prettify
 */

var methods = {};

/**
 * Breaks down our phone number string to a 3 piece object
 * @function breakdownFull
 * @param  {string} phone The uglified phone string
 * @return {object}       Returns the broken down object
 */
function breakdownFull(phone) {
	return {
		areaCode: phone.substr(0, 3),
		localCode: phone.substr(3, 3),
		lineNumber: phone.substr(6, 4)
	};
}

/**
* Breaks down our phone number string to a 2 piece object
* @function breakdownShort
* @param  {string} phone The uglified phone string
* @return {object}       Returns the broken down object
*/
function breakdownShort(phone) {
	return {
		localCode: phone.substr(0, 3),
		lineNumber: phone.substr(3, 4)
	};
}

/**
 * Breaks down our phone number string to a 4 piece object
 * @function breakdownExtension
 * @param  {string} phone The uglified phone string
 * @return {object}       Returns the broken down object
 */
function breakdownExtension(phone) {
	return {
		extension: phone.substr(10),
		areaCode: phone.substr(0, 3),
		localCode: phone.substr(3, 3),
		lineNumber: phone.substr(6, 4)
	};
}

/**
 * Breaks down our phone number string to a 4 piece object
 * @function breakdownLongDistance
 * @param  {string} phone The uglified phone string
 * @return {object}       Returns the broken down object
 */
function breakdownLongDistance(phone) {
	return {
		countryCode: phone.substr(0, 1),
		areaCode: phone.substr(1, 3),
		localCode: phone.substr(4, 3),
		lineNumber: phone.substr(7, 4)
	};
}

methods = {
	uglify: function(phone) {
		return phone.replace(/[a-z]\w+|\W/gi, '');
	},

	/**
	 * Formats the string to a dashed style
	 * @function dashed
	 * @param  {string} phone Uglified phone string
	 * @return {string}       Returns the formatted phone string
	 */
	dashed: function(phone) {
		var isFull = (phone.length >= 10);
		var pObj = (isFull) ? breakdownFull(phone) : breakdownShort(phone);

		if (isFull) {
			return ((pObj.areaCode) + '-' + (pObj.localCode) + '-' + (pObj.lineNumber));
		}

		return ((pObj.localCode) + '-' + (pObj.lineNumber));
	},

	/**
	 * Formats the string to a normal style
	 * @function normal
	 * @param  {string} phone Uglified phone string
	 * @return {string}       Returns the formatted phone string
	 */
	normal: function(phone) {
		var isFull = (phone.length >= 10);
		var pObj = (isFull) ? breakdownFull(phone) : breakdownShort(phone);

		if (isFull) {
			return ('(' + (pObj.areaCode) + ') ' + (pObj.localCode) + '-' + (pObj.lineNumber));
		}

		return ((pObj.localCode) + '-' + (pObj.lineNumber));
	},

	/**
		* Formats the string to a dotted style
		* @function dotted
		* @param  {string} phone Uglified phone string
		* @return {string}       Returns the formatted phone string
		*/
	dotted: function(phone) {
		var isFull = (phone.length >= 10);
		var pObj = (isFull) ? breakdownFull(phone) : breakdownShort(phone);

		if (isFull) {
			return ((pObj.areaCode) + '.' + (pObj.localCode) + '.' + (pObj.lineNumber));
		}

		return ((pObj.localCode) + '.' + (pObj.lineNumber));
	},

		/**
		* Formats the string to a long distance with a custom format style
		* @function longDistance
		* @param  {string} phone Uglified phone string
		* @param {string} format The desired format for the phone number
		* @return {string}       Returns the formatted phone string
		*/
	longDistance: function(phone, format) {
		var pObj = breakdownLongDistance(phone);
		var formattedPhone = '';

		if (format && format !== 'longDistance') {
			formattedPhone = methods[format](((pObj.areaCode) + (pObj.localCode) + (pObj.lineNumber)));

			return ((pObj.countryCode) + '+' + formattedPhone);
		}

		return ((pObj.countryCode) + '+' + (pObj.areaCode) + '-' + (pObj.localCode) + '-' + (pObj.lineNumber));
	},

		/**
		* Formats the string to an extension with a custom format style
		* @function extension
		* @param  {string} phone Uglified phone string
		* @param {string} format The desired format for the phone number
		* @return {string}       Returns the formatted phone string
		*/
	extension: function(phone, format) {
		var pObj = breakdownExtension(phone);
		var formattedPhone = '';

		if (format && format !== 'extension') {
			formattedPhone = methods[format](((pObj.areaCode) + (pObj.localCode) + (pObj.lineNumber)));

			return (formattedPhone + ' x ' + (pObj.extension));
		}

		return ((pObj.areaCode) + '-' + (pObj.localCode) + '-' + (pObj.lineNumber) + ' x ' + (pObj.extension));
	}
};

/**
* Our main initiator
* @function formatPhoneNumber
* @param  {string|number} phone    Our custom phone string gets converted to a string if needed
* @param  {string} format   The main format string to format our phone with
* @param  {string} exFormat An extra format string used for longDistance and extension format types
* @return {string}          Returns a the final formatted string
*/
module.exports = function (phone, format, exFormat) {
	var uglyPhone = '';

	if (!phone) {
		throw new Error('No Phone provided');
	}
	uglyPhone = methods.uglify(phone.toString());

	if (!format) {
		return uglyPhone;
	}

	return methods[format](uglyPhone, exFormat);
};
