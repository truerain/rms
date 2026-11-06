import { Fragment, useMemo, useState } from 'react';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface OrganizationNode {
  id: string;
  name: string;
  type: '본부' | '팀' | '구성원';
  owner: string;
  members?: number;
  children?: OrganizationNode[];
}

interface VisibleNode {
  node: OrganizationNode;
  level: number;
}

const organization: OrganizationNode[] = [
  {
    id: 'product', name: '프로덕트 본부', type: '본부', owner: '김민준', members: 18,
    children: [
      {
        id: 'product-design', name: '프로덕트 디자인팀', type: '팀', owner: '이서연', members: 6,
        children: [
          { id: 'designer-1', name: '박지호', type: '구성원', owner: 'Product Designer' },
          { id: 'designer-2', name: '최유진', type: '구성원', owner: 'UX Researcher' },
        ],
      },
      {
        id: 'product-planning', name: '서비스 기획팀', type: '팀', owner: '정하준', members: 5,
        children: [
          { id: 'planner-1', name: '한지민', type: '구성원', owner: 'Product Manager' },
          { id: 'planner-2', name: '윤도현', type: '구성원', owner: 'Service Planner' },
        ],
      },
    ],
  },
  {
    id: 'engineering', name: '개발 본부', type: '본부', owner: '오수빈', members: 26,
    children: [
      {
        id: 'frontend', name: '프론트엔드팀', type: '팀', owner: '강현우', members: 8,
        children: [
          { id: 'frontend-1', name: '임채원', type: '구성원', owner: 'Frontend Engineer' },
          { id: 'frontend-2', name: '송준서', type: '구성원', owner: 'Frontend Engineer' },
        ],
      },
      {
        id: 'backend', name: '백엔드팀', type: '팀', owner: '조은별', members: 10,
        children: [
          { id: 'backend-1', name: '유시우', type: '구성원', owner: 'Backend Engineer' },
          { id: 'backend-2', name: '문서윤', type: '구성원', owner: 'DevOps Engineer' },
        ],
      },
    ],
  },
];

function collectParentIds(nodes: OrganizationNode[]): string[] {
  return nodes.flatMap((node) => [
    ...(node.children?.length ? [node.id] : []),
    ...collectParentIds(node.children ?? []),
  ]);
}

function flattenVisibleNodes(
  nodes: OrganizationNode[],
  expandedIds: Set<string>,
  level = 0,
): VisibleNode[] {
  return nodes.flatMap((node) => [
    { node, level },
    ...(node.children?.length && expandedIds.has(node.id)
      ? flattenVisibleNodes(node.children, expandedIds, level + 1)
      : []),
  ]);
}

const parentIds = collectParentIds(organization);

export default function HierarchicalTableSample() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(organization.map((node) => node.id)),
  );

  const visibleNodes = useMemo(
    () => flattenVisibleNodes(organization, expandedIds),
    [expandedIds],
  );

  const toggleNode = (id: string) => {
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
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        gap={1.5}
        px={2}
        py={1.5}
      >
        <Box>
          <Typography fontWeight={800}>조직 구조</Typography>
          <Typography variant="caption" color="text.secondary">
            현재 {visibleNodes.length}개 항목 표시
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setExpandedIds(new Set(parentIds))}>전체 펼침</Button>
          <Button size="small" color="inherit" onClick={() => setExpandedIds(new Set())}>전체 접기</Button>
        </Stack>
      </Stack>

      <TableContainer sx={{ height: 430, overflowY: 'auto' }}>
        <Table stickyHeader aria-label="계층형 조직 테이블" sx={{ minWidth: 680 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 280, fontWeight: 800, bgcolor: '#fafbff' }}>이름</TableCell>
              <TableCell sx={{ minWidth: 100, fontWeight: 800, bgcolor: '#fafbff' }}>구분</TableCell>
              <TableCell sx={{ minWidth: 180, fontWeight: 800, bgcolor: '#fafbff' }}>책임자 / 직무</TableCell>
              <TableCell align="right" sx={{ minWidth: 90, fontWeight: 800, bgcolor: '#fafbff' }}>인원</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleNodes.map(({ node, level }) => {
              const hasChildren = Boolean(node.children?.length);
              const isExpanded = expandedIds.has(node.id);
              return (
                <Fragment key={node.id}>
                  <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{ pl: level * 3 }}
                      >
                        {hasChildren ? (
                          <IconButton
                            size="small"
                            onClick={() => toggleNode(node.id)}
                            aria-label={`${node.name} ${isExpanded ? '접기' : '펼치기'}`}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded
                              ? <KeyboardArrowDownRoundedIcon />
                              : <KeyboardArrowRightRoundedIcon />}
                          </IconButton>
                        ) : (
                          <Box sx={{ width: 34, display: 'flex', justifyContent: 'center' }}>
                            <PersonRoundedIcon fontSize="small" color="disabled" />
                          </Box>
                        )}
                        {hasChildren && (
                          level === 0
                            ? <AccountTreeRoundedIcon color="primary" fontSize="small" />
                            : <FolderRoundedIcon color="action" fontSize="small" />
                        )}
                        <Typography variant="body2" fontWeight={level < 2 ? 750 : 500}>
                          {node.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Level ${level + 1} · ${node.type}`}
                        size="small"
                        color={level === 0 ? 'primary' : 'default'}
                        variant={level === 0 ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>{node.owner}</TableCell>
                    <TableCell align="right">{node.members == null ? '—' : `${node.members}명`}</TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
