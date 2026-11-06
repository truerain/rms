import { useMemo, useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface MealExpenseRow {
  id: string;
  building: string;
  vendorName: string;
  expenseType: '식대' | '경비';
  venueType: '사내식당' | '일반식당' | '카페' | '편의점';
  mealType: '조식' | '중식' | '석식' | '간식';
  mealCount: number;
  mealPoints: number;
  companySupport: number;
  mealAmount: number;
  note: string;
}

type GroupKey = 'vendorName' | 'expenseType' | 'venueType' | 'mealType';

interface Totals {
  mealCount: number;
  mealPoints: number;
  companySupport: number;
  mealAmount: number;
}

interface GroupNode {
  id: string;
  level: number;
  value: string;
  totals: Totals;
  note: string;
  children?: GroupNode[];
}

const groupKeys: GroupKey[] = ['vendorName', 'expenseType', 'venueType', 'mealType'];

const rows: MealExpenseRow[] = [
  { id: 'C-001', building: '센터원 빌딩', vendorName: '한상 사내식당', expenseType: '식대', venueType: '사내식당', mealType: '조식', mealCount: 84, mealPoints: 420000, companySupport: 168000, mealAmount: 588000, note: '임직원 조식' },
  { id: 'C-002', building: '센터원 빌딩', vendorName: '한상 사내식당', expenseType: '식대', venueType: '사내식당', mealType: '중식', mealCount: 326, mealPoints: 1956000, companySupport: 978000, mealAmount: 2934000, note: '임직원 중식' },
  { id: 'C-003', building: '센터원 빌딩', vendorName: '한상 사내식당', expenseType: '식대', venueType: '사내식당', mealType: '석식', mealCount: 112, mealPoints: 672000, companySupport: 336000, mealAmount: 1008000, note: '야근 식대 포함' },
  { id: 'C-004', building: '센터원 빌딩', vendorName: '한상 사내식당', expenseType: '경비', venueType: '사내식당', mealType: '중식', mealCount: 18, mealPoints: 0, companySupport: 0, mealAmount: 216000, note: '외부 방문객 식사' },
  { id: 'C-005', building: '센터원 빌딩', vendorName: '브라운테이블', expenseType: '식대', venueType: '일반식당', mealType: '중식', mealCount: 65, mealPoints: 455000, companySupport: 130000, mealAmount: 585000, note: '제휴 식당' },
  { id: 'C-006', building: '센터원 빌딩', vendorName: '브라운테이블', expenseType: '식대', venueType: '일반식당', mealType: '석식', mealCount: 41, mealPoints: 287000, companySupport: 82000, mealAmount: 369000, note: '제휴 식당' },
  { id: 'C-007', building: '센터원 빌딩', vendorName: '커피스테이션', expenseType: '식대', venueType: '카페', mealType: '간식', mealCount: 93, mealPoints: 372000, companySupport: 93000, mealAmount: 465000, note: '월 한도 적용' },
  { id: 'C-008', building: '센터원 빌딩', vendorName: '커피스테이션', expenseType: '경비', venueType: '카페', mealType: '간식', mealCount: 27, mealPoints: 0, companySupport: 0, mealAmount: 162000, note: '회의비 처리' },
  { id: 'S-001', building: '서초 캠퍼스', vendorName: '그린키친', expenseType: '식대', venueType: '사내식당', mealType: '조식', mealCount: 58, mealPoints: 290000, companySupport: 116000, mealAmount: 406000, note: '임직원 조식' },
  { id: 'S-002', building: '서초 캠퍼스', vendorName: '그린키친', expenseType: '식대', venueType: '사내식당', mealType: '중식', mealCount: 248, mealPoints: 1488000, companySupport: 744000, mealAmount: 2232000, note: '임직원 중식' },
  { id: 'S-003', building: '서초 캠퍼스', vendorName: '키친오브서울', expenseType: '식대', venueType: '일반식당', mealType: '중식', mealCount: 73, mealPoints: 511000, companySupport: 146000, mealAmount: 657000, note: '도보 5분 제휴점' },
  { id: 'S-004', building: '서초 캠퍼스', vendorName: '데일리마트', expenseType: '식대', venueType: '편의점', mealType: '간식', mealCount: 44, mealPoints: 176000, companySupport: 44000, mealAmount: 220000, note: '식품 품목만 허용' },
];

function sumRows(items: MealExpenseRow[]): Totals {
  return items.reduce<Totals>((total, item) => ({
    mealCount: total.mealCount + item.mealCount,
    mealPoints: total.mealPoints + item.mealPoints,
    companySupport: total.companySupport + item.companySupport,
    mealAmount: total.mealAmount + item.mealAmount,
  }), { mealCount: 0, mealPoints: 0, companySupport: 0, mealAmount: 0 });
}

function buildGroups(items: MealExpenseRow[], level = 0, parentId = ''): GroupNode[] {
  const key = groupKeys[level];
  const grouped = new Map<string, MealExpenseRow[]>();

  items.forEach((item) => {
    const value = item[key];
    grouped.set(value, [...(grouped.get(value) ?? []), item]);
  });

  return Array.from(grouped, ([value, groupRows]) => {
    const id = `${parentId}/${key}:${value}`;
    return {
      id,
      level,
      value,
      totals: sumRows(groupRows),
      note: level === groupKeys.length - 1
        ? Array.from(new Set(groupRows.map((item) => item.note))).join(', ')
        : `${groupRows.length}개 상세 항목`,
      children: level < groupKeys.length - 1
        ? buildGroups(groupRows, level + 1, id)
        : undefined,
    };
  });
}

function collectExpandableIds(nodes: GroupNode[]): string[] {
  return nodes.flatMap((node) => [
    ...(node.children?.length ? [node.id] : []),
    ...collectExpandableIds(node.children ?? []),
  ]);
}

function collectVisibleNodes(nodes: GroupNode[], expandedIds: Set<string>): GroupNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(node.children?.length && expandedIds.has(node.id)
      ? collectVisibleNodes(node.children, expandedIds)
      : []),
  ]);
}

function won(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

const buildings = Array.from(new Set(rows.map((row) => row.building)));

export default function MealExpenseMultiGroupSample() {
  const [building, setBuilding] = useState(buildings[0]);

  const groups = useMemo(
    () => buildGroups(rows.filter((row) => row.building === building)),
    [building],
  );
  const expandableIds = useMemo(() => collectExpandableIds(groups), [groups]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const visibleNodes = useMemo(
    () => collectVisibleNodes(groups, expandedIds),
    [expandedIds, groups],
  );
  const buildingTotals = useMemo(
    () => sumRows(rows.filter((row) => row.building === building)),
    [building],
  );

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        justifyContent="space-between"
        gap={2}
        px={2}
        py={1.5}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <RestaurantRoundedIcon color="primary" />
          <Box>
            <Typography fontWeight={900}>F&amp;B 식대 현황</Typography>
            <Typography variant="caption" color="text.secondary">
              그룹 행의 금액은 하위 항목 합계입니다.
            </Typography>
          </Box>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} gap={1}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="building-label">빌딩</InputLabel>
            <Select
              labelId="building-label"
              value={building}
              label="빌딩"
              onChange={(event) => {
                setBuilding(event.target.value);
                setExpandedIds(new Set());
              }}
            >
              {buildings.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </Select>
          </FormControl>
          <Button size="small" onClick={() => setExpandedIds(new Set(expandableIds))}>전체 펼침</Button>
          <Button size="small" color="inherit" onClick={() => setExpandedIds(new Set())}>전체 접기</Button>
        </Stack>
      </Stack>

      <Box px={2} pb={1.5}>
        <Typography variant="body2" color="text.secondary">
          총 식수 <strong>{buildingTotals.mealCount.toLocaleString('ko-KR')}식</strong>
          {' · '}총 식대 <strong>{won(buildingTotals.mealAmount)}</strong>
        </Typography>
      </Box>

      <TableContainer sx={{ height: 500, overflow: 'auto', borderTop: 1, borderColor: 'divider' }}>
        <Table stickyHeader aria-label="F&B 식대 다중 컬럼 그룹 테이블" sx={{ minWidth: 1500 }}>
          <TableHead>
            <TableRow>
              {['업체명', '식대구분', '업장구분', '식사구분'].map((label, index) => (
                <TableCell
                  key={label}
                  sx={{
                    minWidth: index === 0 ? 220 : 150,
                    fontWeight: 900,
                    bgcolor: '#f8f9fd',
                    ...(index === 0 && { position: 'sticky', left: 0, zIndex: 4 }),
                  }}
                >
                  {label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ minWidth: 100, fontWeight: 900, bgcolor: '#f8f9fd' }}>식수</TableCell>
              <TableCell align="right" sx={{ minWidth: 150, fontWeight: 900, bgcolor: '#f8f9fd' }}>식대포인트</TableCell>
              <TableCell align="right" sx={{ minWidth: 150, fontWeight: 900, bgcolor: '#f8f9fd' }}>회사지원금</TableCell>
              <TableCell align="right" sx={{ minWidth: 160, fontWeight: 900, bgcolor: '#f8f9fd' }}>식대금액</TableCell>
              <TableCell sx={{ minWidth: 260, fontWeight: 900, bgcolor: '#f8f9fd' }}>비고</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleNodes.map((node) => {
              const canExpand = Boolean(node.children?.length);
              const expanded = expandedIds.has(node.id);
              const rowBackground = node.level === 0 ? '#f7f8ff' : node.level === 1 ? '#fbfcff' : '#fff';

              return (
                <TableRow key={node.id} hover sx={{ bgcolor: rowBackground }}>
                  {groupKeys.map((key, columnLevel) => (
                    <TableCell
                      key={key}
                      sx={{
                        py: 1,
                        ...(columnLevel === 0 && {
                          position: 'sticky', left: 0, zIndex: 1, bgcolor: rowBackground,
                        }),
                      }}
                    >
                      {node.level === columnLevel ? (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {canExpand && (
                            <IconButton
                              size="small"
                              onClick={() => toggle(node.id)}
                              aria-label={`${node.value} ${expanded ? '접기' : '펼치기'}`}
                              aria-expanded={expanded}
                            >
                              {expanded
                                ? <KeyboardArrowDownRoundedIcon fontSize="small" />
                                : <KeyboardArrowRightRoundedIcon fontSize="small" />}
                            </IconButton>
                          )}
                          {!canExpand && <Box sx={{ width: 34 }} />}
                          <Typography variant="body2" fontWeight={canExpand ? 800 : 500}>
                            {node.value}
                          </Typography>
                        </Stack>
                      ) : node.level < columnLevel ? (
                        <Typography variant="caption" color="text.disabled">전체</Typography>
                      ) : null}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: canExpand ? 800 : 400 }}>
                    {node.totals.mealCount.toLocaleString('ko-KR')}식
                  </TableCell>
                  <TableCell align="right">{won(node.totals.mealPoints)}</TableCell>
                  <TableCell align="right">{won(node.totals.companySupport)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>{won(node.totals.mealAmount)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap>{node.note}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
