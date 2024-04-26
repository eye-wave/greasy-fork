export async function loadDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("picrew")

    request.onerror = reject
    request.onsuccess = (event: Event) => resolve((event.target as IDBOpenDBRequest).result)
  })
}
