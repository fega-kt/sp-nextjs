import type { NextApiRequest, NextApiResponse } from 'next';
import { ConfidentialClientApplication } from '@azure/msal-node';

async function getTokenViaSecret(params: {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  resource: string;
}): Promise<string> {
  const { tenantId, clientId, clientSecret, resource } = params;

  const cca = new ConfidentialClientApplication({
    auth: {
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientId,
      clientSecret,
    },
  });

  const result = await cca.acquireTokenByClientCredential({
    scopes: [`${resource}/.default`],
  });

  if (!result?.accessToken) {
    throw new Error('Không lấy được token từ Azure AD');
  }
  return result.accessToken;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tenantId, clientId, clientSecret, spUrl } = req.body as {
    tenantId?: string;
    clientId?: string;
    clientSecret?: string;
    spUrl?: string;
  };

  if (!tenantId) return res.status(400).json({ error: 'Thiếu tenantId' });
  if (!clientId) return res.status(400).json({ error: 'Thiếu clientId' });
  if (!clientSecret) return res.status(400).json({ error: 'Thiếu clientSecret' });
  if (!spUrl) return res.status(400).json({ error: 'Thiếu spUrl' });

  let resource: string;
  try {
    const normalized = spUrl.startsWith('http') ? spUrl : `https://${spUrl}`;
    const url = new URL(normalized.trim());
    resource = `${url.protocol}//${url.hostname}`;
  } catch {
    return res.status(400).json({ error: 'Site URL không hợp lệ — hãy nhập dạng https://tenant.sharepoint.com/...' });
  }

  try {
    const token = await getTokenViaSecret({ tenantId, clientId, clientSecret, resource });
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
