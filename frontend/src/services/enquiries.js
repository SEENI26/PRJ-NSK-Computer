/**
 * Enquiry submission.
 *
 * The site is otherwise static and local-JSON driven (§27), but the contact
 * form is real: it posts to the PHP API so enquiries land in the staff inbox.
 * This module is the single seam between the two — swap the URL here and
 * nothing else changes.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class EnquiryError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = 'EnquiryError';
    this.fieldErrors = fieldErrors;
  }
}

/** Map our field names onto the API's, and mark the source. */
function toPayload(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || undefined,
    message: `Requirement: ${form.requirement}\n\n${form.message.trim()}`,
    // The API requires at least one line; a general enquiry has no product, so
    // it is sent as a single free-text item rather than a catalogue reference.
    items: [],
  };
}

export async function submitEnquiry(form) {
  if (!API_BASE) {
    // No backend configured — fail loudly rather than pretending it sent.
    throw new EnquiryError(
      'The enquiry service is not configured yet. Please call or WhatsApp us.',
    );
  }

  let response;
  try {
    response = await fetch(`${API_BASE}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(form)),
    });
  } catch {
    throw new EnquiryError('Could not reach the server. Check your connection and try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = payload?.error;
    throw new EnquiryError(
      error?.message ?? `Request failed (${response.status})`,
      error?.errors ?? {},
    );
  }

  return payload?.data ?? {};
}
