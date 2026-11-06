import { useEffect, useState } from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { Box, Button, Paper, Tab, Tabs } from '@mui/material';

export interface SourceFile {
  name: string;
  content: string;
}

interface SourcePreviewProps {
  files: SourceFile[];
}

export default function SourcePreview({ files }: SourcePreviewProps) {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveFile(0);
    setCopied(false);
  }, [files]);

  const currentFile = files[activeFile];

  const copySource = async () => {
    await navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', bgcolor: '#111827', color: '#e5e7eb' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #293244' }}>
        <Tabs
          value={activeFile}
          onChange={(_, value: number) => {
            setActiveFile(value);
            setCopied(false);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flex: 1, minWidth: 0, '& .MuiTab-root': { color: '#9ca3af' }, '& .Mui-selected': { color: '#fff' } }}
        >
          {files.map((file) => <Tab key={file.name} label={file.name} />)}
        </Tabs>
        <Button
          size="small"
          color="inherit"
          startIcon={copied ? <DoneRoundedIcon /> : <ContentCopyRoundedIcon />}
          onClick={copySource}
          sx={{ mx: 1.5, whiteSpace: 'nowrap' }}
        >
          {copied ? '복사됨' : '소스 복사'}
        </Button>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0, p: 2.5, maxHeight: 520, overflow: 'auto', fontSize: 13, lineHeight: 1.65,
          fontFamily: '"Cascadia Code", Consolas, monospace', whiteSpace: 'pre',
        }}
      >
        <code>{currentFile.content}</code>
      </Box>
    </Paper>
  );
}
