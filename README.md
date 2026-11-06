# RMS · MUI Sample Lab

React 18.2.0, TypeScript 5.0.2, MUI 5.15.21 기반의 복사 가능한 샘플 프로젝트입니다.

## 실행

```bash
npm install
npm run dev
```

## Table 샘플

| 샘플 | 파일 | 복사 단위 |
| --- | --- | --- |
| 기본 Table | `src/samples/table/BasicTableSample.tsx` | 파일 1개 |
| 정렬 Table | `src/samples/table/SortableTableSample.tsx` | 파일 1개 |
| 선택·페이지 Table | `src/samples/table/SelectableTableSample.tsx` | 파일 1개 |
| 계층형 Table | `src/samples/table/HierarchicalTableSample.tsx` | 파일 1개 |
| F&B 식대 현황 | `src/samples/table/MealExpenseMultiGroupSample.tsx` | 파일 1개 |
| 재사용 MuiTable | `src/components/MuiTable.tsx` | 컴포넌트 + 사용 예시 |

각 샘플은 화면의 **소스** 탭에서도 확인하고 복사할 수 있습니다. 기본·정렬·선택 샘플은 외부 프로젝트에 한 파일만 붙여 넣을 수 있도록 데이터와 타입을 파일 내부에 포함했습니다.

재사용 샘플은 다음 파일을 참고합니다.

- `src/components/MuiTable.tsx`: 제네릭 테이블 본체
- `src/samples/table/ReusableMuiTableSample.tsx`: 컬럼 정의와 사용 예시
- `src/data/employees.ts`: 타입 및 샘플 데이터

재사용 `MuiTable`의 본문 높이를 고정하고 세로 스크롤을 사용하려면 `tableHeight`를 전달합니다. 헤더는 `stickyHeader`로 고정됩니다.

```tsx
<MuiTable
  rows={rows}
  columns={columns}
  getRowId={(row) => row.id}
  tableHeight={420}
/>
```

## 대상 프로젝트 의존성

```bash
npm install @mui/material@5.15.21 @mui/icons-material@5.15.21 \
  @emotion/react@11.11.4 @emotion/styled@11.11.5
```

## 검증

```bash
npm run typecheck
npm run build
```

새 샘플을 추가할 때는 `src/samples/<분류>`에 독립 파일로 만들고 `src/App.tsx`의 `samples` 배열에 등록합니다.
