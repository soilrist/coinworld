# 담이농장 홈페이지

담이농장 유기농 고구마 소개용 정적 사이트입니다. 빌드 과정 없이 `index.html`을 브라우저로 열면 바로 보입니다. 예전 HTML 연습 파일은 `practice/` 폴더로 옮겨 두었습니다.

## 공개하기 (카페24 웹호스팅)

`master`에 저장되면 GitHub Actions(`.github/workflows/deploy.yml`)가 SSH로 카페24에 접속해 아래 순서로 올립니다. 사이트를 잠가 둔 상태(`chmod 000 ~/www`)여도 그대로 동작합니다.

1. `www`를 잠급니다.
2. `www` 안의 예전 파일을 **모두 지웁니다**. (해킹으로 남은 파일 제거)
3. 새 홈페이지 파일을 올립니다.
4. `www`를 다시 엽니다 (`chmod 755`). 중간에 실패하면 잠긴 채로 남아 안전합니다.

처음 한 번만 저장소 **Settings → Secrets and variables → Actions → New repository secret**에서 아래 둘 중 **한 쪽**을 넣어 주세요. 비밀번호는 이곳에만 넣고 채팅이나 파일에는 절대 적지 않습니다. 채팅에 한 번이라도 올라간 비밀번호는 먼저 바꾼 뒤, 바꾼 새 비밀번호를 넣으세요.

**방법 B: FTP (추천, 카페24는 보통 SSH 접속을 IP로 막아 둡니다)**
- `CAFE24_FTP_HOST`: `damefarm1.cafe24.com`
- `CAFE24_FTP_USER`: `damefarm1`
- `CAFE24_FTP_PASS`: FTP 비밀번호 (바꾼 새 비밀번호)

**방법 A: SSH (카페24에서 SSH 접속이 어디서나 허용될 때만)**
- `CAFE24_SSH_HOST`: `xn--980bp0a336bwfa.com` (담이농장.com의 영문 표기)
- `CAFE24_SSH_USER`: `damefarm1`
- `CAFE24_SSH_PASS`: SSH 비밀번호 (바꾼 새 비밀번호)
- `CAFE24_SSH_KNOWN_HOSTS`: PowerShell에서 `ssh-keyscan xn--980bp0a336bwfa.com` 을 실행해 나온 줄 전체

SSH Secrets가 모두 있으면 SSH를, 없으면 FTP를 씁니다.

**접속 시험:** 이 설정이 master에 들어간 뒤에는 **Actions → 카페24에 올리기 → Run workflow**(“접속만 확인” 체크)로 파일은 건드리지 않고 접속만 시험할 수 있습니다. 업로드가 실패하면 사이트는 잠긴 채로 남으니, 로그를 보고 고친 뒤 Run workflow에서 체크를 풀고 다시 실행하세요.

올라가는 파일: `index.html`, `styles.css`, `site.js`, `farm-info.js`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `photos/` 안의 사진

주소는 https://담이농장.com 기준입니다. 카페24에 SSL(https)이 없으면 카페24 호스팅 관리 → 보안서버(SSL)에서 무료 인증서를 켜 주세요.

## 관리자 (가격 수정 권한)

관리자 계정은 이 저장소를 가진 GitHub 계정(soilrist)입니다. 다른 사람에게 가격 수정을 맡기려면 저장소 **Settings → Collaborators → Add people**로 그 사람의 GitHub 계정을 추가하세요. 따로 로그인하는 관리자 페이지는 서버가 필요해 해킹 위험이 다시 생기므로 두지 않았습니다.

## 가격·상품·연락처 고치는 법 (휴대폰에서도 됩니다)

1. GitHub에서 이 저장소를 열고 `farm-info.js` 파일을 누릅니다.
2. 오른쪽 위 연필(✏️ Edit) 버튼을 누릅니다.
3. 파일 위쪽 설명대로 가격이나 연락처 글자를 고칩니다. 예: `- 5kg | 38,000원`, 품절이면 `- 10kg | 65,000원 | 품절`
4. 아래(또는 오른쪽 위) **Commit changes** 버튼을 누르면 끝입니다. 1~2분 뒤 카페24 사이트에 반영됩니다.

` (백틱) 기호 사이의 글자만 고치면 됩니다. 실수로 홈페이지가 이상해지면 파일의 History에서 이전 버전으로 되돌릴 수 있습니다.

## 사진 넣는 법

1. GitHub에서 `photos` 폴더를 열고 **Add file → Upload files**로 사진을 올립니다.
2. `farm-info.js` 맨 아래 `사진목록`에 `파일이름.jpg | 사진 설명`을 한 줄씩 적고 저장합니다. 사진 파일 이름은 영어와 숫자로 지어 주세요 (예: harvest1.jpg).

사진목록이 비어 있으면 사진 칸은 나오지 않고, 파일 이름이 틀린 사진은 자동으로 빠집니다.

## 실제 정보로 바꿔야 할 곳

- 인증을 갱신하면 `farm-info.js` 사업자정보의 인증 기간을 바꾸기 (유기농 2027.8.9, 저탄소 2028.8.31 만료)
- 농장 소개 글 (`index.html`의 농장 소개 부분)
- 공유 미리보기용 `og-image.png` (1200×630) 추가
- 담이농장.com 도메인(가비아 등록)은 2026-10-22 만료이니 꼭 연장하기

## 보안

이 홈페이지는 서버, 관리자 페이지, 데이터베이스가 없는 정적 사이트라 예전 호스팅처럼 서버를 뚫고 들어올 곳이 없습니다. 외부 스크립트도 쓰지 않고, 페이지에 보안 정책(CSP)을 넣어 이 저장소 안의 파일만 실행되게 막아 두었습니다. 지켜야 할 것은 GitHub 계정입니다.

- GitHub 계정에 2단계 인증(2FA)을 켜 두기
- 저장소 협업자(Settings → Collaborators)는 꼭 필요한 사람만
- 다른 사이트의 스크립트나 위젯 코드를 붙여넣지 않기
- 나중에 담이농장.com을 연결할 때는 도메인 등록 업체 계정 비밀번호를 바꾸고 2단계 인증을 켠 뒤, DNS가 GitHub Pages만 가리키는지 확인하기
