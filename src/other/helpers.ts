import { ListTag } from "../types/types";

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
 * Return an array of all new tags
 * --- new as in not currently in the set of all tags for a list ---
 * when adding or updating a list item.
 */
export function findAllNewTags(listTags: ListTag[], listItemTags: ListTag[]) {
	let newTags = [];

	for (let tag of listItemTags) {
		let index = findIndexOfItemById(listTags, tag.id);

		if (index == -1) {
			newTags.push(tag);
		}
	}

	return newTags;
}
