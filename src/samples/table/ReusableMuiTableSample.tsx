import { useMemo, useState } from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import MuiTable, { MuiTableColumn } from '../../components/MuiTable';
import { Employee, EmployeeStatus, employees } from '../../data/employees';

const statusColor: Record<EmployeeStatus, 'success' | 'warning' | 'default'> = {
  재직: 'success',
  휴직: 'warning',
  '퇴사 예정': 'default',
};

export default function ReusableMuiTableSample() {
  const [selectedCount, setSelectedCount] = useState(0);
  const columns = useMemo<MuiTableColumn<Employee>[]>(() => [
    {
      id: 'name', label: '구성원', minWidth: 230, sortable: true,
      value: (row) => row.name,
      searchableValue: (row) => `${row.name} ${row.email}`,
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
            {row.name.slice(-2)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={800}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{row.email}</Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'team', label: '소속 팀', minWidth: 110, sortable: true,
      value: (row) => row.team, render: (row) => row.team,
    },
    {
      id: 'role', label: '직무', minWidth: 170, sortable: true,
      value: (row) => row.role, render: (row) => row.role,
    },
    {
      id: 'status', label: '상태', sortable: true,
      value: (row) => row.status,
      render: (row) => <Chip label={row.status} color={statusColor[row.status]} size="small" />,
    },
    {
      id: 'joinedAt', label: '입사일', minWidth: 120, align: 'right', sortable: true,
      value: (row) => new Date(`${row.joinedAt}T00:00:00`),
      searchableValue: (row) => row.joinedAt,
      render: (row) => row.joinedAt,
    },
  ], []);

  return (
    <Box>
      {selectedCount > 0 && (
        <Typography mb={1.5} variant="body2" color="primary.main" fontWeight={800}>
          {selectedCount}명의 구성원이 선택되었습니다.
        </Typography>
      )}
      <MuiTable
        rows={employees}
        columns={columns}
        getRowId={(row) => row.id}
        tableHeight={420}
        searchPlaceholder="이름, 이메일, 팀, 직무 검색"
        onSelectionChange={(selectedRows) => setSelectedCount(selectedRows.length)}
      />
    </Box>
  );
}
