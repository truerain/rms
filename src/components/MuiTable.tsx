import { ReactNode, useMemo, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  Checkbox,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';

type RowId = string | number;
type SortDirection = 'asc' | 'desc';
type SortValue = string | number | Date | null | undefined;

export interface MuiTableColumn<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render: (row: T) => ReactNode;
  value?: (row: T) => SortValue;
  searchableValue?: (row: T) => string | number;
}

interface MuiTableProps<T> {
  rows: T[];
  columns: MuiTableColumn<T>[];
  getRowId: (row: T) => RowId;
  tableHeight?: number | string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  initialRowsPerPage?: number;
  onSelectionChange?: (selectedRows: T[]) => void;
}

function compareValues(a: SortValue, b: SortValue): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b), 'ko', {
    numeric: true,
    sensitivity: 'base',
  });
}

export default function MuiTable<T>({
  rows,
  columns,
  getRowId,
  tableHeight,
  searchPlaceholder = '검색어를 입력하세요',
  emptyMessage = '표시할 데이터가 없습니다.',
  initialRowsPerPage = 5,
  onSelectionChange,
}: MuiTableProps<T>) {
  const [query, setQuery] = useState('');
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<SortDirection>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedIds, setSelectedIds] = useState<Set<RowId>>(new Set());

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko');
    if (!normalizedQuery) return rows;

    return rows.filter((row) =>
      columns.some((column) => {
        const rawValue = column.searchableValue?.(row) ?? column.value?.(row);
        return String(rawValue ?? '')
          .toLocaleLowerCase('ko')
          .includes(normalizedQuery);
      }),
    );
  }, [columns, query, rows]);

  const sortedRows = useMemo(() => {
    const column = columns.find((item) => item.id === orderBy);
    if (!column?.value) return filteredRows;

    return filteredRows
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        const comparison = compareValues(column.value!(left.row), column.value!(right.row));
        return comparison === 0
          ? left.index - right.index
          : order === 'asc'
            ? comparison
            : -comparison;
      })
      .map(({ row }) => row);
  }, [columns, filteredRows, order, orderBy]);

  const visibleRows = useMemo(
    () => sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, sortedRows],
  );

  const visibleIds = visibleRows.map(getRowId);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.has(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  const updateSelection = (nextIds: Set<RowId>) => {
    setSelectedIds(nextIds);
    onSelectionChange?.(rows.filter((row) => nextIds.has(getRowId(row))));
  };

  const handleSort = (columnId: string) => {
    const isAscending = orderBy === columnId && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(columnId);
    setPage(0);
  };

  const handleSelectAllVisible = () => {
    const nextIds = new Set(selectedIds);
    if (allVisibleSelected) {
      visibleIds.forEach((id) => nextIds.delete(id));
    } else {
      visibleIds.forEach((id) => nextIds.add(id));
    }
    updateSelection(nextIds);
  };

  const handleSelectRow = (row: T) => {
    const rowId = getRowId(row);
    const nextIds = new Set(selectedIds);
    if (nextIds.has(rowId)) nextIds.delete(rowId);
    else nextIds.add(rowId);
    updateSelection(nextIds);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', borderColor: 'divider' }}>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography fontWeight={800}>구성원 목록</Typography>
          <Typography variant="body2" color="text.secondary">
            전체 {filteredRows.length}명 · 선택 {selectedIds.size}명
          </Typography>
        </Box>
        <TextField
          size="small"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          placeholder={searchPlaceholder}
          inputProps={{ 'aria-label': '테이블 검색' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
      </Box>

      <TableContainer
        sx={{
          height: tableHeight,
          overflowY: tableHeight == null ? 'visible' : 'auto',
        }}
      >
        <Table stickyHeader aria-label="구성원 테이블" sx={{ minWidth: 880 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={allVisibleSelected}
                  indeterminate={selectedVisibleCount > 0 && !allVisibleSelected}
                  onChange={handleSelectAllVisible}
                  inputProps={{ 'aria-label': '현재 페이지 전체 선택' }}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: 800,
                    bgcolor: '#fafbff',
                    zIndex: 2,
                  }}
                >
                  {column.sortable && column.value ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => {
                const rowId = getRowId(row);
                const selected = selectedIds.has(rowId);
                return (
                  <TableRow
                    hover
                    key={rowId}
                    selected={selected}
                    onClick={() => handleSelectRow(row)}
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selected}
                        onChange={() => handleSelectRow(row)}
                        onClick={(event) => event.stopPropagation()}
                        inputProps={{ 'aria-label': `${rowId} 행 선택` }}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedRows.length}
        page={Math.min(page, Math.max(0, Math.ceil(sortedRows.length / rowsPerPage) - 1))}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="페이지당 행"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
      />
    </Paper>
  );
}
