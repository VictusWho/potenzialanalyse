const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "20minutemail.com", "30minutemail.com",
  "airmail.cc", "anonymbox.com",
  "burnermail.io", "byom.de",
  "discard.email", "dispostable.com", "dropmail.me",
  "emailondeck.com", "emlhub.com", "emlpro.com", "emltmp.com",
  "fakeinbox.com", "fake-mail.net",
  "getairmail.com", "getnada.com", "guerrillamail.biz",
  "guerrillamail.com", "guerrillamail.de", "guerrillamail.info",
  "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "harakirimail.com",
  "inboxbear.com", "inboxalias.com",
  "mailcatch.com", "maildrop.cc", "mailinator.com", "mailinator.net",
  "mailinator2.com", "mailnesia.com", "mailsac.com",
  "mintemail.com", "moakt.com", "mohmal.com", "mvrht.net",
  "nada.email",
  "pokemail.net",
  "sharklasers.com", "spam4.me", "spamgourmet.com",
  "temp-mail.org", "temp-mail.io", "temp-mail.ru",
  "tempail.com", "tempinbox.com", "tempmail.com", "tempmail.de",
  "tempmail.email", "tempmail.net", "tempmail.plus", "tempmailo.com",
  "tempr.email", "throwawaymail.com", "tmail.ws", "tmpmail.net",
  "trashmail.com", "trashmail.de", "trashmail.net", "trashmail.org",
  "wegwerfemail.com", "wegwerfemail.de", "wegwerfemail.net",
  "yopmail.com", "yopmail.fr", "yopmail.net",
]);

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}
