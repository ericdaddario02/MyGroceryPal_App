/**
 * Returns the next id for a new *item*.
 * Mimics the id auto incrementing feature of a backend database.
 */
export function getNextIdFromCollection(collection: {id: number}[]) {
	if (collection.length == 0) {
		return 1;
	}

    let ids = collection.map(item => item.id);
    let maxId = Math.max(...ids);

    return maxId + 1;
}

/**
 * Find the index of the item with the given id in the given collection.
 * Returns the index of the corresponing item in the array, or -1 if the item does not exist.
 */
export function findIndexOfItemById(collection: {id: number}[], id: number) {
    for (let [index, item] of collection.entries()) {
        if (item.id == id) {
            return index;
        }
    }

    return -1;
}

/**
 * Returns an array of all new items in `collection` that are NOT in `referenceCollection`.
 */
export function findAllNewItems<T>(referenceCollection: (T & {id: number})[], collection: (T & {id: number})[]) {
	let newTags: T[] = [];

	for (let tag of collection) {
		let index = findIndexOfItemById(referenceCollection, tag.id);

		if (index == -1) {
			newTags.push(tag);
		}
	}

	return newTags;
}

/**
 * Returns a hex code string for a random colour.
 */
export function generateRandomColour() {
	let randomColour = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

	return randomColour;
}
