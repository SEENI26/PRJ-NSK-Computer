/**
 * Enquiry submission.
 *
 * The site is otherwise static and local-JSON driven (§27), but the contact
 * form is real: it posts to the PHP API so enquiries land in the staff inbox.
 * This module is the single seam between the two.
 *
 * It used to read VITE_API_BASE_URL with `??` and refuse to send when it was
 * unset — and .env ships it empty to mean "same origin, use the dev proxy", so
 * every enquiry was rejected with "not configured yet" and nothing ever
 * reached the shop. An empty value is now treated as the intended default.
 */
import { api, ApiError } from '@/services/api';

export class EnquiryError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = 'EnquiryError';
    this.fieldErrors = fieldErrors;
  }
}

/** Map the form's field names onto the API's. */
function toPayload(form, { token, elapsedMs } = {}) {
  return {
    name: form.name.trim(),
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    subject: form.requirement,
    // The requirement is a select, so it is carried in the subject and repeated
    // in the body — staff read the message, not the metadata.
    message: `Requirement: ${form.requirement}\n\n${form.message.trim()}`,
    source: 'website',

    // Anti-spam. `website` is the honeypot the API already checks for: it is
    // hidden from people and irresistible to bots.
    website: form.website ?? '',
    elapsed_ms: elapsedMs,
    recaptcha_token: token || undefined,
  };
}

export async function submitEnquiry(form, options = {}) {
  try {
    return await api.post('/enquiries', toPayload(form, options));
  } catch (error) {
    if (error instanceof ApiError) {
      throw new EnquiryError(error.message, error.fieldErrors());
    }
    throw new EnquiryError('Could not reach the server. Check your connection and try again.');
  }
}
