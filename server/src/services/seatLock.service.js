// very simple in-memory seat locks (not persistent; use Redis in production)
const locks = new Map(); // key: eventId, value: { expiresAt, quantity, token }

function lockSeats(eventId, quantity, ttlMs = 5 * 60 * 1000) {
  const now = Date.now();
  const existing = locks.get(eventId);
  if (existing && existing.expiresAt > now) {
    // existing lock = cannot lock easily; you can queue or return false
    return null;
  }
  const token = Math.random().toString(36).slice(2,10);
  locks.set(eventId, { expiresAt: now + ttlMs, quantity, token });
  // schedule cleanup
  setTimeout(() => {
    const l = locks.get(eventId);
    if (l && l.token === token) locks.delete(eventId);
  }, ttlMs + 1000);
  return token;
}

function releaseLock(eventId, token) {
  const lock = locks.get(eventId);
  if (lock && lock.token === token) {
    locks.delete(eventId);
    return true;
  }
  return false;
}

module.exports = { lockSeats, releaseLock };
