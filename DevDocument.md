# 개요
- https://github.com/vientoeste/node_php_ONLYFORCOUPLES
- MVC 모델을 따르려고 노력했으나 엄밀한 객체지향 구현에는 실패
- expressjs에서 php를 자식 프로세스로 호출해 controller 실행을 목표로 함
- 각 controller와 라우터는 1:1로 동작하진 않으나, 알맞는 역할을 하도록 함
- 현재 Diary 관련 기능(getter, setter)은 구현되었으나, filter 추가 등의 UX 기능 필요
- tailwindcss, nunjucks를 통해 UI 구현 예정
- 회원가입, 로그인 및 인증 기능 구현에는 성공
    * npm 패키지 passport, passport-local을 통해 로컬 로그인 기능을 구현하였음
- mysql은 PDO가 아닌 mysqli 라이브러리 함수 사용

# Issues
1. PHP의 print_r 값 넘기기
- JS의 Array나 Set 등 Iterable Type으로 넘길 방안 필요
2. PHP와 Node.js가 response code를 통해 소통함
- 에러 세분화에 약할 것으로 예상
- Internal Server Error, fatal error 등에 취약할 것
3. 과제 제출 관련
- 테스트용 DB 레코드는 백업이 힘들어 스키마만 RE로 따서 제출
- HTML 미구현에 따라 UI가 존재하지 않음
    * curl, postman을 통해 백엔드 로직 동작은 확인하였음