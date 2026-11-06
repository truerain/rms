import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

type ProjectStatus = '진행 중' | '완료' | '대기';

interface ProjectRow {
  id: number;
  name: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
}

const rows: ProjectRow[] = [
  { id: 1, name: '관리자 대시보드', owner: '김민준', status: '진행 중', progress: 72 },
  { id: 2, name: '모바일 주문', owner: '이서연', status: '완료', progress: 100 },
  { id: 3, name: '정산 자동화', owner: '박지호', status: '대기', progress: 15 },
  { id: 4, name: '고객 포털', owner: '최유진', status: '진행 중', progress: 48 },
];

const statusColor: Record<ProjectStatus, 'primary' | 'success' | 'default'> = {
  '진행 중': 'primary',
  완료: 'success',
  대기: 'default',
};

export default function BasicTableSample() {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="기본 프로젝트 테이블">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>프로젝트</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>담당자</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>상태</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800 }}>진행률</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>
                <Chip label={row.status} color={statusColor[row.status]} size="small" />
              </TableCell>
              <TableCell align="right">{row.progress}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
