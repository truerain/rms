import { ElementType, useMemo, useState } from 'react';
import AutoAwesomeMosaicRoundedIcon from '@mui/icons-material/AutoAwesomeMosaicRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import {
  Box,
  Chip,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import SourcePreview, { SourceFile } from './components/SourcePreview';
import BasicTableSample from './samples/table/BasicTableSample';
import SortableTableSample from './samples/table/SortableTableSample';
import SelectableTableSample from './samples/table/SelectableTableSample';
import ReusableMuiTableSample from './samples/table/ReusableMuiTableSample';
import HierarchicalTableSample from './samples/table/HierarchicalTableSample';
import MealExpenseMultiGroupSample from './samples/table/MealExpenseMultiGroupSample';
import basicSource from './samples/table/BasicTableSample.tsx?raw';
import sortableSource from './samples/table/SortableTableSample.tsx?raw';
import selectableSource from './samples/table/SelectableTableSample.tsx?raw';
import reusableSource from './samples/table/ReusableMuiTableSample.tsx?raw';
import muiTableSource from './components/MuiTable.tsx?raw';
import employeeSource from './data/employees.ts?raw';
import hierarchicalSource from './samples/table/HierarchicalTableSample.tsx?raw';
import mealExpenseSource from './samples/table/MealExpenseMultiGroupSample.tsx?raw';

interface SampleDefinition {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  features: string[];
  component: ElementType;
  files: SourceFile[];
}

const samples: SampleDefinition[] = [
  {
    id: 'basic-table',
    title: '기본 Table',
    description: '가장 작은 구성의 MUI Table입니다. 한 파일만 복사하면 바로 사용할 수 있습니다.',
    icon: TableChartRoundedIcon,
    features: ['TableHead', 'TableBody', 'Chip'],
    component: BasicTableSample,
    files: [{ name: 'BasicTableSample.tsx', content: basicSource }],
  },
  {
    id: 'sortable-table',
    title: '정렬 Table',
    description: 'TableSortLabel과 제네릭 키 타입으로 오름차순·내림차순 정렬을 구현합니다.',
    icon: SortRoundedIcon,
    features: ['TableSortLabel', 'useMemo', '타입 안전 정렬'],
    component: SortableTableSample,
    files: [{ name: 'SortableTableSample.tsx', content: sortableSource }],
  },
  {
    id: 'selectable-table',
    title: '선택·페이지 Table',
    description: 'Checkbox 행 선택과 TablePagination을 함께 사용하는 실무형 예제입니다.',
    icon: CheckBoxRoundedIcon,
    features: ['Checkbox', 'TablePagination', '페이지 전체 선택'],
    component: SelectableTableSample,
    files: [{ name: 'SelectableTableSample.tsx', content: selectableSource }],
  },
  {
    id: 'hierarchical-table',
    title: '계층형 Table',
    description: '레벨이 있는 데이터를 들여쓰기로 표현하고 부모 행을 접거나 펼치는 예제입니다.',
    icon: AccountTreeRoundedIcon,
    features: ['3단계 데이터', '행 접기·펼치기', '전체 펼침·접기', 'Sticky Header'],
    component: HierarchicalTableSample,
    files: [{ name: 'HierarchicalTableSample.tsx', content: hierarchicalSource }],
  },
  {
    id: 'meal-expense-multi-group',
    title: 'F&B 식대 현황',
    description: '업체명·식대구분·업장구분 컬럼에서 단계별로 접고 펼치는 다중 컬럼 그룹 예제입니다.',
    icon: RestaurantRoundedIcon,
    features: ['컬럼별 접기·펼치기', '그룹 합계', '빌딩 선택', '가로·세로 스크롤'],
    component: MealExpenseMultiGroupSample,
    files: [{ name: 'MealExpenseMultiGroupSample.tsx', content: mealExpenseSource }],
  },
  {
    id: 'reusable-table',
    title: '재사용 MuiTable',
    description: '검색·정렬·선택·페이지네이션을 컬럼 설정만으로 재사용하는 제네릭 컴포넌트입니다.',
    icon: AutoAwesomeMosaicRoundedIcon,
    features: ['제네릭 API', '검색', '정렬', '선택', '페이지네이션'],
    component: ReusableMuiTableSample,
    files: [
      { name: 'MuiTable.tsx', content: muiTableSource },
      { name: '사용 예시.tsx', content: reusableSource },
      { name: '샘플 데이터.ts', content: employeeSource },
    ],
  },
];

function App() {
  const [selectedId, setSelectedId] = useState(samples[0].id);
  const [view, setView] = useState<'preview' | 'source'>('preview');
  const selectedSample = useMemo(
    () => samples.find((sample) => sample.id === selectedId) ?? samples[0],
    [selectedId],
  );
  const Sample = selectedSample.component;

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack direction="row" spacing={1.25} alignItems="center" mb={1}>
          <Box sx={{ p: 1, borderRadius: 2.5, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
            <CodeRoundedIcon />
          </Box>
          <Typography variant="overline" color="primary.main" fontWeight={900}>RMS · MUI LAB</Typography>
        </Stack>
        <Typography variant="h4">복사해서 사용하는 MUI 샘플</Typography>
        <Typography color="text.secondary" mt={1} mb={3.5}>
          미리보기로 동작을 확인하고, 소스 탭에서 필요한 파일을 그대로 복사하세요.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px minmax(0, 1fr)' }, gap: 3 }}>
          <Paper variant="outlined" sx={{ alignSelf: 'start', overflow: 'hidden' }}>
            <Box px={2} py={1.5}>
              <Typography variant="subtitle2" fontWeight={900}>TABLE SAMPLES</Typography>
              <Typography variant="caption" color="text.secondary">MUI 5.15 기준</Typography>
            </Box>
            <Divider />
            <List disablePadding>
              {samples.map((sample) => {
                const Icon = sample.icon;
                return (
                  <ListItemButton
                    key={sample.id}
                    selected={sample.id === selectedId}
                    onClick={() => {
                      setSelectedId(sample.id);
                      setView('preview');
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 38 }}><Icon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={sample.title} primaryTypographyProps={{ fontSize: 14, fontWeight: 750 }} />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          <Box minWidth={0}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} mb={2}>
              <Box>
                <Typography variant="h5" fontWeight={900}>{selectedSample.title}</Typography>
                <Typography color="text.secondary" mt={0.5}>{selectedSample.description}</Typography>
              </Box>
              <Tabs value={view} onChange={(_, nextView: 'preview' | 'source') => setView(nextView)}>
                <Tab value="preview" icon={<ViewListRoundedIcon />} iconPosition="start" label="미리보기" />
                <Tab value="source" icon={<CodeRoundedIcon />} iconPosition="start" label="소스" />
              </Tabs>
            </Stack>

            <Stack direction="row" gap={1} flexWrap="wrap" mb={2.5}>
              {selectedSample.features.map((feature) => (
                <Chip key={feature} label={feature} size="small" variant="outlined" />
              ))}
            </Stack>

            {view === 'preview' ? (
              <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 3 }, overflow: 'hidden' }}>
                <Sample />
              </Paper>
            ) : (
              <SourcePreview files={selectedSample.files} />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
