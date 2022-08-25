import type { List } from '../types/types';


/**
 * Returns the next id for a new *item*.
 * Mimics the id auto incrementing feature of a backend database.
 */
export function getNextIdFromCollection(collection: {id: number}[]) {
    let ids = collection.map(item => item.id);
    let maxId = Math.max(...ids);

    return maxId + 1;
}

/**
 * Find the index of the List with the given id in the given collection of Lists.
 * Returns the index of the corresponing List in the array, or -1 if the List does not exist.
 */
export function findIndexOfListById(lists: List[], id: number) {
    for (let [index, list] of lists.entries()) {
        if (list.id == id) {
            return index;
        }
    }

    return -1;
}