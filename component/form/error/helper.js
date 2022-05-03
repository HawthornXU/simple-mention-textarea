const stringRefersToArray = (string) => {
	return string.match(/\[.+?]/);
};

/** Formik fields are named as a stringified object, ie 'foo.bar.address[0]'
 * This function will retrieve the error message represented by the fields name.
 *
 * Note: We don't want to use eval, so do some tap dancing in order to find the
 * text string represented by the name.
 * @param name
 * @param errorObject The entire object, containing all errors currently present in the form.
 * @returns {*}
 */
export const getErrorFromObject = (name, errorObject) => {
	if (Object.keys(errorObject).length === 0) return null;

	const properties = name.split('.');
	const errorText = properties.reduce((collection, property) => {
		if (stringRefersToArray(property)) {
			const [propertyName] = property.split(/[[\d\]]\w+/);
			const arrayIndex = parseInt(property.match(/[+-]?\d+(?:\.\d+)?/g), 10);

			// If the array doesn't exist at all, return empty object which
			// will terminate the reduce on next iteration.
			if (!collection[propertyName]) {
				return {};
			}

			return collection[propertyName][arrayIndex] || {}; // ...or empty object if position is undefined.
		}
		return collection[property] || {};
	}, errorObject);

	return typeof errorText === 'object' ? '' : errorText;
};
