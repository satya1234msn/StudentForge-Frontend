// Curated realistic student projects for StudentForge
export const MOCK_PROJECTS = [
  {
    id: 'proj-campus-nav',
    ownerId: 'user-satya',
    title: 'Smart Campus Navigation System',
    description: 'A responsive PWA designed to help freshmen and campus visitors navigate basement corridors, laboratories, and lecture complexes utilizing bluetooth beacon scanning and SVG-based floor maps.',
    domainTags: ['Web Dev', 'Design UI/UX', 'Social Impact'],
    complexity: 'intermediate',
    teamSize: 4,
    deadline: '2026-09-15T00:00:00.000Z',
    status: 'forming',
    collegeOnly: true,
    collegeName: 'National Institute of Technology, Trichy',
    isOpenContribution: false,
    createdAt: '2026-03-01T10:00:00.000Z',
    owner: {
      id: 'user-satya',
      name: 'Satya Prasad',
      college: 'National Institute of Technology, Trichy',
      avatarUrl: null,
      reliabilityScore: 5.0
    },
    roles: [
      {
        id: 'role-1',
        projectId: 'proj-campus-nav',
        roleTitle: 'Lead UI/UX Designer',
        skillsRequired: ['Figma', 'UI Design'],
        levelRequired: 'intermediate',
        filled: true,
        filledBy: 'user-meera'
      },
      {
        id: 'role-2',
        projectId: 'proj-campus-nav',
        roleTitle: 'PWA Frontend Specialist',
        skillsRequired: ['React', 'JavaScript'],
        levelRequired: 'intermediate',
        filled: true,
        filledBy: 'user-aarav'
      },
      {
        id: 'role-3',
        projectId: 'proj-campus-nav',
        roleTitle: 'Backend API Engineer',
        skillsRequired: ['Express', 'Node.js', 'PostgreSQL'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-4',
        projectId: 'proj-campus-nav',
        roleTitle: 'Beacon & Map Data Engineer',
        skillsRequired: ['JavaScript', 'SVG', 'Leaflet'],
        levelRequired: 'beginner',
        filled: false,
        filledBy: null
      }
    ],
    members: [
      {
        id: 'm-1',
        projectId: 'proj-campus-nav',
        userId: 'user-satya',
        role: 'Project Owner',
        status: 'active',
        user: { id: 'user-satya', name: 'Satya Prasad', college: 'NIT Trichy', reliabilityScore: 5.0 }
      },
      {
        id: 'm-2',
        projectId: 'proj-campus-nav',
        userId: 'user-meera',
        role: 'Lead UI/UX Designer',
        status: 'active',
        user: { id: 'user-meera', name: 'Meera Nair', college: 'VIT', reliabilityScore: 4.8 }
      },
      {
        id: 'm-3',
        projectId: 'proj-campus-nav',
        userId: 'user-aarav',
        role: 'PWA Frontend Specialist',
        status: 'active',
        user: { id: 'user-aarav', name: 'Aarav Sharma', college: 'IIT Bombay', reliabilityScore: 4.9 }
      }
    ]
  },
  {
    id: 'proj-crops-ai',
    ownerId: 'user-priya',
    title: 'AI Crop Disease Diagnostics Tool',
    description: 'A mobile-friendly system enabling small-scale farmers to take leaf photographs and classify fungal rust, rot, or blight instantly on-field. Includes recommendations based on regional weather databases.',
    domainTags: ['AI/ML', 'Mobile App', 'Research'],
    complexity: 'advanced',
    teamSize: 4,
    deadline: '2026-10-30T00:00:00.000Z',
    status: 'forming',
    collegeOnly: false,
    collegeName: null,
    isOpenContribution: true,
    createdAt: '2026-03-02T12:30:00.000Z',
    owner: {
      id: 'user-priya',
      name: 'Priya Patel',
      college: 'BITS Pilani',
      avatarUrl: null,
      reliabilityScore: 4.8
    },
    roles: [
      {
        id: 'role-crops-1',
        projectId: 'proj-crops-ai',
        roleTitle: 'TensorFlow ML Architect',
        skillsRequired: ['Python', 'TensorFlow', 'PyTorch'],
        levelRequired: 'advanced',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-crops-2',
        projectId: 'proj-crops-ai',
        roleTitle: 'React Native Developer',
        skillsRequired: ['JavaScript', 'React Native', 'Tailwind CSS'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-crops-3',
        projectId: 'proj-crops-ai',
        roleTitle: 'Edge Pipeline Engineer',
        skillsRequired: ['Python', 'Docker', 'FastAPI'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      }
    ],
    members: [
      {
        id: 'm-crops-1',
        projectId: 'proj-crops-ai',
        userId: 'user-priya',
        role: 'Project Owner',
        status: 'active',
        user: { id: 'user-priya', name: 'Priya Patel', college: 'BITS Pilani', reliabilityScore: 4.8 }
      }
    ]
  },
  {
    id: 'proj-peercode',
    ownerId: 'user-aarav',
    title: 'PeerCode Arena - Live Collaborative Interview Sandbox',
    description: 'An open-source real-time pairing room where student peers run technical mock interviews, write synchronized code with syntax highlighting, and analyze algorithmic time complexity on the fly.',
    domainTags: ['Web Dev', 'Developer Tools'],
    complexity: 'intermediate',
    teamSize: 3,
    deadline: '2026-11-15T00:00:00.000Z',
    status: 'forming',
    collegeOnly: false,
    collegeName: null,
    isOpenContribution: true,
    createdAt: '2026-03-03T09:15:00.000Z',
    owner: {
      id: 'user-aarav',
      name: 'Aarav Sharma',
      college: 'Indian Institute of Technology, Bombay',
      avatarUrl: null,
      reliabilityScore: 4.9
    },
    roles: [
      {
        id: 'role-peer-1',
        projectId: 'proj-peercode',
        roleTitle: 'WebRTC / WebSockets Specialist',
        skillsRequired: ['React', 'Socket.io', 'WebSockets'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-peer-2',
        projectId: 'proj-peercode',
        roleTitle: 'Isolated Code Runner Engineer',
        skillsRequired: ['Node.js', 'Docker', 'Redis'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-peer-3',
        projectId: 'proj-peercode',
        roleTitle: 'Product UI Designer',
        skillsRequired: ['Figma', 'UI Design'],
        levelRequired: 'intermediate',
        filled: true,
        filledBy: 'user-meera'
      }
    ],
    members: [
      {
        id: 'm-peer-1',
        projectId: 'proj-peercode',
        userId: 'user-aarav',
        role: 'Project Owner',
        status: 'active',
        user: { id: 'user-aarav', name: 'Aarav Sharma', college: 'IIT Bombay', reliabilityScore: 4.9 }
      },
      {
        id: 'm-peer-2',
        projectId: 'proj-peercode',
        userId: 'user-meera',
        role: 'Product UI Designer',
        status: 'active',
        user: { id: 'user-meera', name: 'Meera Nair', college: 'VIT', reliabilityScore: 4.8 }
      }
    ]
  },
  {
    id: 'proj-ecotrack',
    ownerId: 'user-kabir',
    title: 'EcoTrack - Campus Carbon & Food Waste Auditor',
    description: 'An IoT and web analytics dashboard logging university hostel cafeteria food surpluses and energy usage to redistribute surplus meals to local non-profits and display carbon offsets.',
    domainTags: ['Web Dev', 'Data Science', 'Social Impact'],
    complexity: 'beginner',
    teamSize: 4,
    deadline: '2026-08-30T00:00:00.000Z',
    status: 'forming',
    collegeOnly: true,
    collegeName: 'Delhi Technological University',
    isOpenContribution: false,
    createdAt: '2026-03-04T14:20:00.000Z',
    owner: {
      id: 'user-kabir',
      name: 'Kabir Mehta',
      college: 'Delhi Technological University',
      avatarUrl: null,
      reliabilityScore: 4.7
    },
    roles: [
      {
        id: 'role-eco-1',
        projectId: 'proj-ecotrack',
        roleTitle: 'Frontend Dashboard Engineer',
        skillsRequired: ['React', 'Chart.js', 'Tailwind CSS'],
        levelRequired: 'beginner',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-eco-2',
        projectId: 'proj-ecotrack',
        roleTitle: 'Data Scraping & Analysis Lead',
        skillsRequired: ['Python', 'Pandas', 'SQL'],
        levelRequired: 'beginner',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-eco-3',
        projectId: 'proj-ecotrack',
        roleTitle: 'Sustainability Content Writer',
        skillsRequired: ['Technical Writing', 'Research'],
        levelRequired: 'beginner',
        filled: true,
        filledBy: 'user-ananya'
      }
    ],
    members: [
      {
        id: 'm-eco-1',
        projectId: 'proj-ecotrack',
        userId: 'user-kabir',
        role: 'Project Owner',
        status: 'active',
        user: { id: 'user-kabir', name: 'Kabir Mehta', college: 'DTU', reliabilityScore: 4.7 }
      }
    ]
  },
  {
    id: 'proj-chaindegree',
    ownerId: 'user-ananya',
    title: 'ChainDegree - Tamper-Proof Academic Credential Vault',
    description: 'A Web3 verification protocol allowing universities to issue cryptographically signed NFT degree credentials. Employers can verify certificate validity in under 3 seconds without contacting registrars.',
    domainTags: ['Blockchain', 'Security', 'Web Dev'],
    complexity: 'advanced',
    teamSize: 3,
    deadline: '2026-11-20T00:00:00.000Z',
    status: 'forming',
    collegeOnly: false,
    collegeName: null,
    isOpenContribution: true,
    createdAt: '2026-03-05T08:45:00.000Z',
    owner: {
      id: 'user-ananya',
      name: 'Ananya Deshmukh',
      college: 'Vellore Institute of Technology',
      avatarUrl: null,
      reliabilityScore: 5.0
    },
    roles: [
      {
        id: 'role-chain-1',
        projectId: 'proj-chaindegree',
        roleTitle: 'Solidity Smart Contract Developer',
        skillsRequired: ['Solidity', 'Hardhat', 'Ethers.js'],
        levelRequired: 'advanced',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-chain-2',
        projectId: 'proj-chaindegree',
        roleTitle: 'Web3 React Integrator',
        skillsRequired: ['React', 'TypeScript', 'Web3.js'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      }
    ],
    members: [
      {
        id: 'm-chain-1',
        projectId: 'proj-chaindegree',
        userId: 'user-ananya',
        role: 'Project Owner',
        status: 'active',
        user: { id: 'user-ananya', name: 'Ananya Deshmukh', college: 'VIT', reliabilityScore: 5.0 }
      }
    ]
  },
  {
    id: 'proj-biopulse',
    ownerId: 'user-rohit',
    title: 'BioPulse - Wearable Health Telemetry & Panic Watch',
    description: 'A hybrid cross-platform application syncing with BLE smart fitness bands to detect irregular heart spikes or falls among elder residents, alerting designated student volunteers and emergency contacts.',
    domainTags: ['Mobile App', 'AI/ML', 'Design UI/UX'],
    complexity: 'intermediate',
    teamSize: 4,
    deadline: '2026-10-10T00:00:00.000Z',
    status: 'forming',
    collegeOnly: false,
    collegeName: null,
    isOpenContribution: true,
    createdAt: '2026-03-06T11:00:00.000Z',
    owner: {
      id: 'user-rohit',
      name: 'Rohit Sen',
      college: 'Jadavpur University',
      avatarUrl: null,
      reliabilityScore: 4.8
    },
    roles: [
      {
        id: 'role-bio-1',
        projectId: 'proj-biopulse',
        roleTitle: 'Flutter BLE Developer',
        skillsRequired: ['Flutter', 'Dart', 'Bluetooth LE'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-bio-2',
        projectId: 'proj-biopulse',
        roleTitle: 'Anomaly Classifier Engineer',
        skillsRequired: ['Python', 'Scikit-Learn', 'NumPy'],
        levelRequired: 'intermediate',
        filled: false,
        filledBy: null
      },
      {
        id: 'role-bio-3',
        projectId: 'proj-biopulse',
        roleTitle: 'Health Systems UI/UX Lead',
        skillsRequired: ['Figma', 'UI Design'],
        levelRequired: 'intermediate',
        filled: true,
        filledBy: 'user-meera'
      }
    ],
    members: [
      {
        id: 'm-bio-1',
        projectId: 'proj-biopulse',
        userId: 'user-rohit',
        role: 'Project Owner',
        status: 'active',
        user: { id: 'user-rohit', name: 'Rohit Sen', college: 'Jadavpur University', reliabilityScore: 4.8 }
      }
    ]
  }
];

// 5 Curated Seeded Projects for forming student teams
export const SEEDED_PROJECTS = MOCK_PROJECTS.slice(0, 5);

// Top builder spotlights for the community showcase
export const TOP_BUILDERS = [
  {
    id: 'b-1',
    name: 'Satya Prasad',
    college: 'NIT Trichy',
    course: 'B.Tech CS (4th Yr)',
    reliabilityScore: 5.0,
    projectsCompleted: 3,
    topSkills: ['React', 'Node.js', 'PostgreSQL'],
    workStyle: 'Async & Sync'
  },
  {
    id: 'b-2',
    name: 'Priya Patel',
    college: 'BITS Pilani',
    course: 'B.E. ECE (4th Yr)',
    reliabilityScore: 4.8,
    projectsCompleted: 2,
    topSkills: ['Python', 'TensorFlow', 'Data Analytics'],
    workStyle: 'Async'
  },
  {
    id: 'b-3',
    name: 'Aarav Sharma',
    college: 'IIT Bombay',
    course: 'B.Tech CS (3rd Yr)',
    reliabilityScore: 4.9,
    projectsCompleted: 4,
    topSkills: ['React', 'Tailwind CSS', 'WebSockets'],
    workStyle: 'Sync'
  },
  {
    id: 'b-4',
    name: 'Meera Nair',
    college: 'VIT Vellore',
    course: 'B.Tech SE (3rd Yr)',
    reliabilityScore: 4.8,
    projectsCompleted: 3,
    topSkills: ['Figma', 'UI/UX', 'Spline 3D'],
    workStyle: 'Async & Sync'
  }
];

// High demand skills & hot vacancies summary
export const HOT_SKILLS = [
  { skill: 'React', vacancies: 12, category: 'Frontend' },
  { skill: 'Python', vacancies: 10, category: 'AI/Data' },
  { skill: 'Node.js', vacancies: 9, category: 'Backend' },
  { skill: 'Figma', vacancies: 7, category: 'Design' },
  { skill: 'TensorFlow', vacancies: 6, category: 'AI/ML' },
  { skill: 'Docker', vacancies: 5, category: 'DevOps' },
  { skill: 'PostgreSQL', vacancies: 5, category: 'Database' },
  { skill: 'Solidity', vacancies: 4, category: 'Web3' }
];
