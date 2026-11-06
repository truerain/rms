export type EmployeeStatus = '재직' | '휴직' | '퇴사 예정';

export interface Employee {
  id: number;
  name: string;
  email: string;
  team: string;
  role: string;
  status: EmployeeStatus;
  joinedAt: string;
}

export const employees: Employee[] = [
  { id: 1001, name: '김민준', email: 'minjun.kim@rms.dev', team: '플랫폼', role: 'Frontend Engineer', status: '재직', joinedAt: '2022-03-14' },
  { id: 1002, name: '이서연', email: 'seoyeon.lee@rms.dev', team: '프로덕트', role: 'Product Designer', status: '재직', joinedAt: '2021-11-01' },
  { id: 1003, name: '박지호', email: 'jiho.park@rms.dev', team: '데이터', role: 'Data Analyst', status: '휴직', joinedAt: '2023-01-09' },
  { id: 1004, name: '최유진', email: 'yujin.choi@rms.dev', team: '플랫폼', role: 'Backend Engineer', status: '재직', joinedAt: '2020-08-24' },
  { id: 1005, name: '정하준', email: 'hajun.jung@rms.dev', team: '비즈니스', role: 'Account Manager', status: '재직', joinedAt: '2023-06-19' },
  { id: 1006, name: '한지민', email: 'jimin.han@rms.dev', team: '프로덕트', role: 'Product Manager', status: '퇴사 예정', joinedAt: '2019-12-02' },
  { id: 1007, name: '윤도현', email: 'dohyun.yoon@rms.dev', team: '보안', role: 'Security Engineer', status: '재직', joinedAt: '2022-09-05' },
  { id: 1008, name: '오수빈', email: 'subin.oh@rms.dev', team: '데이터', role: 'ML Engineer', status: '재직', joinedAt: '2024-02-26' },
  { id: 1009, name: '강현우', email: 'hyunwoo.kang@rms.dev', team: '플랫폼', role: 'DevOps Engineer', status: '재직', joinedAt: '2021-04-12' },
  { id: 1010, name: '임채원', email: 'chaewon.lim@rms.dev', team: '피플', role: 'People Partner', status: '휴직', joinedAt: '2020-10-19' },
  { id: 1011, name: '송준서', email: 'junseo.song@rms.dev', team: '비즈니스', role: 'Sales Manager', status: '재직', joinedAt: '2023-08-07' },
  { id: 1012, name: '조은별', email: 'eunbyeol.jo@rms.dev', team: '프로덕트', role: 'UX Researcher', status: '재직', joinedAt: '2022-05-30' },
];
