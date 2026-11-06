import { useMemo, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';

type Order = 'asc' | 'desc';
type OrderBy = keyof ProductRow;

interface ProductRow {
  id: number;
  product: string;
  category: string;
  stock: number;
  price: number;
}

const rows: ProductRow[] = [
  { id: 1, product: '무선 키보드', category: '주변기기', stock: 32, price: 89000 },
  { id: 2, product: '27인치 모니터', category: '디스플레이', stock: 8, price: 349000 },
  { id: 3, product: 'USB-C 허브', category: '주변기기', stock: 45, price: 69000 },
  { id: 4, product: '웹캠', category: '영상기기', stock: 17, price: 129000 },
  { id: 5, product: '모니터 암', category: '가구', stock: 12, price: 159000 },
];

const columns: Array<{ id: OrderBy; label: string; numeric?: boolean }> = [
  { id: 'product', label: '상품명' },
  { id: 'category', label: '분류' },
  { id: 'stock', label: '재고', numeric: true },
  { id: 'price', label: '가격', numeric: true },
];

export default function SortableTableSample() {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('product');

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => {
      const left = a[orderBy];
      const right = b[orderBy];
      const compared = typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), 'ko');
      return order === 'asc' ? compared : -compared;
    }),
    [order, orderBy],
  );

  const handleSort = (column: OrderBy) => {
    setOrder(orderBy === column && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(column);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="정렬 가능한 상품 테이블">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.numeric ? 'right' : 'left'}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleSort(column.id)}
                  sx={{ fontWeight: 800 }}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell align="right">{row.stock}개</TableCell>
              <TableCell align="right">{row.price.toLocaleString('ko-KR')}원</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
