import { ChangeEvent, useMemo, useState } from 'react';
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

interface OrderRow {
  id: string;
  customer: string;
  item: string;
  amount: number;
}

const rows: OrderRow[] = Array.from({ length: 13 }, (_, index) => ({
  id: `ORD-${String(index + 1).padStart(3, '0')}`,
  customer: ['김민준', '이서연', '박지호', '최유진'][index % 4],
  item: ['오피스 체어', '데스크 램프', '키보드', '모니터'][index % 4],
  amount: 59000 + index * 17500,
}));

export default function SelectableTableSample() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const visibleRows = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage],
  );
  const allVisibleSelected = visibleRows.length > 0
    && visibleRows.every((row) => selected.has(row.id));
  const someVisibleSelected = visibleRows.some((row) => selected.has(row.id));

  const toggleAllVisible = () => {
    const next = new Set(selected);
    visibleRows.forEach((row) => {
      if (allVisibleSelected) next.delete(row.id);
      else next.add(row.id);
    });
    setSelected(next);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const changeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Typography px={2} py={1.5} variant="body2" fontWeight={700}>
        선택된 주문: {selected.size}건
      </Typography>
      <TableContainer>
        <Table aria-label="선택 및 페이지네이션 주문 테이블">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allVisibleSelected}
                  indeterminate={!allVisibleSelected && someVisibleSelected}
                  onChange={toggleAllVisible}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }}>주문번호</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>고객</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>상품</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>금액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => {
              const isSelected = selected.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  hover
                  selected={isSelected}
                  onClick={() => toggleRow(row.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox"><Checkbox checked={isSelected} /></TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell align="right">{row.amount.toLocaleString('ko-KR')}원</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={changeRowsPerPage}
        rowsPerPageOptions={[5, 10]}
        labelRowsPerPage="페이지당 행"
      />
    </Paper>
  );
}
