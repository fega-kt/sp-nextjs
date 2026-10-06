import { toast } from 'sonner';

// Azure AD errors are a wall of text (codes, trace/correlation IDs, timestamps) —
// keep only the "AADSTSxxxx: description." sentence
function shorten(msg: string): string {
  const aad = msg.match(/AADSTS\d+:.*?\.(?=\s|$)/);
  return aad ? aad[0] : msg;
}

export function toastError(title: string, err: unknown) {
  const msg = (err as Error)?.message ?? String(err);
  toast.error(title, { description: shorten(msg) });
}
