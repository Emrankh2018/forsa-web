/**
 * Runs before the arrival overlay is painted: if the visitor already saw this arrival in this
 * session (and did not ask to replay it with ?intro=1), the overlay is hidden by CSS at once, so a
 * returning visitor never sees a flash. Reduced motion is handled in CSS alone.
 */
export function ArrivalGate({ storageKey }: { storageKey: string }) {
  const script = `try{var k=${JSON.stringify(storageKey)};if(sessionStorage.getItem(k)&&!/[?&]intro=1/.test(location.search)){document.documentElement.setAttribute('data-arrival-done','')}}catch(e){}`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
