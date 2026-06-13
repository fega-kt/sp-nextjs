# SharePoint Downloader

Web app tải file từ SharePoint Online, hỗ trợ 3 phương thức xác thực: Access Token, Certificate, và Client Secret.

## Tech stack

- **Next.js 14** (pages router)
- **Ant Design 6** + Tailwind CSS
- **@pnp/sp** v2 — gọi SharePoint REST API
- **@azure/msal-node** — lấy token qua certificate hoặc client secret

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

Tự động lấy token từ Azure AD qua client credentials + certificate, sau đó tải file (hoặc chỉ lấy token nếu để trống File URL).

| Trường | Mô tả |
|--------|-------|
| Tenant ID | Directory (tenant) ID trong Azure Portal |
| Client ID | Application (client) ID |
| Thumbprint | SHA-1 thumbprint của certificate đã upload lên App Registration |
| Private Key | Nội dung file `.pem` / `.key` (dán tay hoặc upload file) |
| Site URL | URL site SharePoint |
| File URL | Server-relative path (để trống nếu chỉ muốn lấy token) |

### Tab 3 — Client Secret

Tương tự Certificate nhưng dùng client secret thay vì certificate.

| Trường | Mô tả |
|--------|-------|
| Tenant ID | Directory (tenant) ID trong Azure Portal |
| Client ID | Application (client) ID |
| Client Secret | Secret value từ Azure Portal → Certificates & secrets |
| Site URL | URL site SharePoint |
| File URL | Server-relative path (để trống nếu chỉ muốn lấy token) |

### Tính năng khác

- **Deploy info:** icon ⓘ góc trên phải header, hover hiển thị thông tin build (người deploy, thời gian, commit hash, commit message)
- **Update notification:** tự động poll mỗi 60s, hiển thị thông báo góc trên phải nếu có bản cập nhật mới

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

**Response:** binary stream của file với headers `Content-Disposition` và `Content-Type`.

---

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

---

### `POST /api/download-secret`

Lấy access token từ Azure AD qua client secret (client credentials flow).

**Request body:**
```json
{
  "tenantId": "...",
  "clientId": "...",
  "clientSecret": "...",
  "spUrl": "https://tenant.sharepoint.com/sites/MySite"
}
```

**Response:**
```json
{ "token": "<access_token>" }
```

---

### `GET /api/version`

Trả về git commit hash hiện tại trên server — dùng bởi update check.

**Response:**
```json
{ "hash": "dd3a565" }
```

## Cấu hình Azure AD

App Registration cần có:
- **API permissions:** `SharePoint > Sites.Selected` hoặc `Sites.Read.All` (Application)
- **Certificate** (Tab Certificate): upload file `.cer` (public key) vào *Certificates & secrets*
- **Client secret** (Tab Client Secret): tạo secret trong *Certificates & secrets*, copy value ngay sau khi tạo

## Lưu ý kỹ thuật

`@pnp/sp` v2 dùng `new Request("")` trong hàm `mergeHeaders()` để normalize headers. Trên Node.js 18+, `global.Request` là undici (native fetch) và reject URL rỗng với lỗi `"Failed to parse URL from "`. Workaround: override `global.Request/Headers/Response` với node-fetch tại module level trong `pages/api/download.ts` — an toàn vì project dùng pages router (Node.js runtime, không có Edge middleware).
