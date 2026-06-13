# SharePoint Downloader

Web app tải file từ SharePoint Online qua Access Token hoặc Certificate (client credentials).

## Tech stack

- **Next.js 14** (pages router)
- **Ant Design 6** + Tailwind CSS
- **@pnp/sp** v2 — gọi SharePoint REST API
- **@azure/msal-node** — lấy token qua certificate

## Cài đặt

```bash
pnpm install
pnpm dev
```

## Tính năng

### Tab 1 — Access Token

Tải file bằng Bearer token có sẵn (lấy từ nơi khác).

| Trường | Mô tả |
|--------|-------|
| Access Token | JWT token, audience phải là SharePoint (`https://tenant.sharepoint.com`) |
| Site URL | `https://tenant.sharepoint.com/sites/MySite` |
| File URL | Server-relative path, ví dụ `/sites/MySite/Shared Documents/report.xlsx` |

### Tab 2 — Certificate

Tự động lấy token từ Azure AD qua client credentials + certificate, sau đó tải file.

| Trường | Mô tả |
|--------|-------|
| Tenant ID | Directory (tenant) ID trong Azure Portal |
| Client ID | Application (client) ID |
| Thumbprint | SHA-1 thumbprint của certificate đã upload lên App Registration |
| Private Key | Nội dung file `.pem` / `.key` (dán tay hoặc upload) |
| Site URL | URL site SharePoint |
| File URL | Server-relative path (để trống nếu chỉ muốn lấy token) |

## API Routes

### `POST /api/download`

Tải file từ SharePoint bằng Bearer token.

**Request body:**
```json
{
  "token": "<access_token>",
  "spUrl": "https://tenant.sharepoint.com/sites/MySite",
  "fileUrl": "/sites/MySite/Shared Documents/report.xlsx"
}
```

**Response:** binary stream của file, với headers `Content-Disposition` và `Content-Type`.

### `POST /api/download-cert`

Lấy access token từ Azure AD qua certificate (client credentials flow).

**Request body:**
```json
{
  "tenantId": "...",
  "clientId": "...",
  "thumbprint": "73B1341B...",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n...",
  "spUrl": "https://tenant.sharepoint.com/sites/MySite"
}
```

**Response:**
```json
{ "token": "<access_token>" }
```

## Cấu hình Azure AD

App Registration cần có:
- **API permissions:** `SharePoint > Sites.Selected` hoặc `Sites.Read.All` (Application)
- **Certificate:** upload file `.cer` (public key) vào tab *Certificates & secrets*

## Lưu ý kỹ thuật

`@pnp/sp` v2 dùng `new Request("")` trong hàm `mergeHeaders()` để normalize headers. Trên Node.js 18+, `global.Request` là undici (native fetch) và reject URL rỗng với lỗi `"Failed to parse URL from "`. Workaround: override `global.Request/Headers/Response` với node-fetch tại module level trong `pages/api/download.ts` — an toàn vì project dùng pages router (Node.js runtime, không có Edge middleware).
