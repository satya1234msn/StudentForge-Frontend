// Client-side temporary and disposable email detector
export const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  '10minutemail.net',
  '10minmail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'spam4.me',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'cool.fr.nf',
  'jetable.fr.nf',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'throwawaymail.com',
  'getnada.com',
  'abcvg.com',
  'givmail.com',
  'inboxkitten.com',
  'fakeinbox.com',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'fakemailgenerator.com',
  'generator.email',
  'mohmal.com',
  'mytemp.email',
  'emailondeck.com',
  'crazymailing.com',
  'maildrop.cc',
  'dropmail.me',
  'tempail.com',
  'disposablemail.com',
  'tempmailaddress.com',
  'burnermail.io',
  'harakirimail.com',
  'tmailor.com',
  '10mail.org',
  'minuteinbox.com',
  'tempr.email',
  'discard.email',
  'spambox.us',
  'zillamail.com',
  'mailnesia.com',
  'mytempemail.com',
  'mailcatch.com',
  'trashymail.com',
  'tempinbox.com',
  'getairmail.com',
  'filzmail.com',
  'incognitomail.com',
  'jetable.org',
  'safetymail.info',
  'anonymbox.com',
  'deadaddress.com',
  'dontsendmespam.de',
  'emailias.com',
  'kasmail.com',
  'mailnull.com',
  'shortmail.net',
  'sofort-mail.de',
  'spamgourmet.com',
  'temporaryemail.net',
  'trash-mail.com',
  'whyspam.me',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'inboxbear.com',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'letthemeatspam.com',
  'mailinater.com',
  'mailinator2.com',
  'notmailinator.com',
  'reallymymail.com',
  'reconmail.com',
  'sogetthis.com',
  'suremail.info',
  'thespamrequest.com',
  'tradermail.info',
  'veryrealemail.com',
  'zippymail.info',
  'mailtemp.top',
  'tempmail.plus',
  'emailfake.com',
  'crazymail.com',
  'fake-mail.com'
]);

const SUSPICIOUS_PATTERNS = [
  /temp.*mail/i,
  /dispos/i,
  /throw.*away/i,
  /fake.*mail/i,
  /trash.*mail/i,
  /burner/i,
  /spam.*box/i,
  /10.*minute/i,
  /minute.*inbox/i,
  /guerrilla/i,
  /mailinator/i,
  /yopmail/i
];

export function isDisposableEmail(email) {
  if (!email || typeof email !== 'string') return false;

  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return true;
  }

  for (const known of DISPOSABLE_DOMAINS) {
    if (domain.endsWith('.' + known)) {
      return true;
    }
  }

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(domain)) {
      return true;
    }
  }

  return false;
}
