# OfficeTools 100

로그인과 외부 API 없이 브라우저에서 처리하는 업무용 웹 도구 100개 포털입니다.

## 공개 주소

- 포털: `https://beerandnacho.github.io/Officetools/`
- 개별 도구: `https://beerandnacho.github.io/Officetools/tools/<slug>/`
- 카탈로그 안내: [`docs/TOOL-CATALOG-100.md`](docs/TOOL-CATALOG-100.md)

## 업무 영역

- 텍스트·문서
- 회의·커뮤니케이션
- 프로젝트·기획
- 시간·생산성
- 재무·영업
- 데이터·스프레드시트
- 인사·조직
- 개발·IT·보안

각 도구는 입력 폼, 계산·변환·문서 생성, 결과 복사, TXT 저장을 제공합니다. 입력한 데이터는 서버로 전송하지 않고 현재 브라우저에서 처리합니다.

## 구조

```text
src/catalog.js       100개 도구 메타데이터·입력·템플릿
src/engine.js        계산·변환·문서 생성 공통 실행 엔진
src/portal.js        검색·카테고리·최근 사용 포털
src/styles.css       반응형 업무용 UI
scripts/check.mjs    카탈로그·연산 연결·JavaScript 검증
scripts/build.mjs    포털과 독립 URL 100개 정적 빌드
docs/                업무 영역과 대표 도구 안내
```

## 로컬 실행 전 검증

```bash
npm run check
npm run build
```

빌드 결과는 `dist/`에 생성되며, `dist/tools/<slug>/index.html` 형태로 독립 도구 주소 100개가 만들어집니다.
