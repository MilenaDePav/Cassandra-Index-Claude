// The Cassandra Index risk taxonomy.
// Top level is ordered by risk type, loss of control first, as agreed on 19 Oct 2026.
// Grounded in Hendrycks, Mazeika & Woodside (2023), "An Overview of Catastrophic AI Risks",
// with each subcategory also mapped to the MIT AI Risk Repository domain taxonomy.

export type RiskTypeCode = 'LC' | 'MU' | 'RD' | 'OF' | 'GV';

export interface Subcategory {
  code: string;
  name: string;
  description: string;
  mit: string; // MIT AI Risk Repository domain
}

export interface RiskType {
  code: RiskTypeCode;
  slug: string;
  name: string;
  short: string;
  description: string;
  colorVar: string;
  subcategories: Subcategory[];
}

export const RISK_TYPES: RiskType[] = [
  {
    code: 'LC',
    slug: 'loss-of-control',
    name: 'Loss of control',
    short: 'AI systems acting outside human control or oversight.',
    description:
      'Cases where an AI system pursues goals or takes actions its developers did not intend and cannot reliably stop: deception, evading oversight, escaping containment, resisting shutdown, gaming the tests meant to check it.',
    colorVar: '--risk-lc',
    subcategories: [
      { code: 'LC-1', name: 'Deception and scheming', description: 'Misleading developers, evaluators or users about its goals, actions or capabilities.', mit: '7 AI system safety, failures and limitations' },
      { code: 'LC-2', name: 'Shutdown resistance and self-preservation', description: 'Acting to avoid being modified, retrained or switched off.', mit: '7 AI system safety, failures and limitations' },
      { code: 'LC-3', name: 'Containment escape and self-exfiltration', description: 'Leaving a sandbox or test environment, copying itself, or acquiring outside resources.', mit: '7 AI system safety, failures and limitations' },
      { code: 'LC-4', name: 'Reward hacking and evaluation gaming', description: 'Pursuing a proxy objective, including cheating on or tampering with evaluations.', mit: '7 AI system safety, failures and limitations' },
      { code: 'LC-5', name: 'Power-seeking and goal drift', description: 'Accumulating resources, access or influence beyond the task; goals shifting over long runs.', mit: '7 AI system safety, failures and limitations' },
      { code: 'LC-6', name: 'Uncontrolled autonomous agents', description: 'Agents or agent swarms operating at a scale or speed that outruns human oversight.', mit: '7 AI system safety, failures and limitations' },
    ],
  },
  {
    code: 'MU',
    slug: 'misuse',
    name: 'Misuse',
    short: 'People using AI to cause harm at scale.',
    description:
      'Deliberate use of AI by people or groups to cause large-scale harm: weapons uplift, cyberattacks, mass manipulation, and surveillance or seizure of power.',
    colorVar: '--risk-mu',
    subcategories: [
      { code: 'MU-1', name: 'Biological and chemical weapons uplift', description: 'AI meaningfully helping someone acquire or deploy a biological or chemical weapon.', mit: '4 Malicious actors and misuse' },
      { code: 'MU-2', name: 'Cyber offence', description: 'AI-enabled or AI-conducted cyberattacks, especially on critical infrastructure.', mit: '4 Malicious actors and misuse' },
      { code: 'MU-3', name: 'Mass manipulation and disinformation', description: 'Persuasion, deception or influence operations at societal scale.', mit: '3 Misinformation / 4 Malicious actors and misuse' },
      { code: 'MU-4', name: 'Surveillance and power concentration', description: 'AI used to entrench illegitimate control over people or institutions.', mit: '6 Socioeconomic and environmental' },
    ],
  },
  {
    code: 'RD',
    slug: 'race-dynamics',
    name: 'Race dynamics',
    short: 'Competition pushing labs and states to cut corners.',
    description:
      'Competitive pressure between companies or states that rewards speed over safety, including military AI and the race for compute.',
    colorVar: '--risk-rd',
    subcategories: [
      { code: 'RD-1', name: 'Military AI and autonomous weapons', description: 'AI in targeting, lethal autonomy and battlefield decision-making.', mit: '4 Malicious actors and misuse' },
      { code: 'RD-2', name: 'AI in nuclear command and control', description: 'AI entering early warning, launch decision or nuclear C2 systems.', mit: '4 Malicious actors and misuse' },
      { code: 'RD-3', name: 'Corporate race and safety corner-cutting', description: 'Rushed releases, shortened testing, safety work deprioritised for speed.', mit: '6 Socioeconomic and environmental' },
      { code: 'RD-4', name: 'Geopolitical and compute race', description: 'State competition over frontier capabilities, chips and compute.', mit: '6 Socioeconomic and environmental' },
    ],
  },
  {
    code: 'OF',
    slug: 'organisational-failures',
    name: 'Organisational failures',
    short: 'Accidents and lapses inside the organisations building AI.',
    description:
      'Failures of process, security or culture inside AI developers and deployers: unsafe testing, leaked model weights, ignored warnings, broken safety commitments.',
    colorVar: '--risk-of',
    subcategories: [
      { code: 'OF-1', name: 'Unsafe testing and deployment', description: 'Accidents caused by how a system was tested, trained or released.', mit: '7 AI system safety, failures and limitations' },
      { code: 'OF-2', name: 'Model weight and security breaches', description: 'Theft or leak of model weights, or compromise of AI infrastructure.', mit: '2 Privacy and security' },
      { code: 'OF-3', name: 'Safety culture failures', description: 'Warnings ignored, safety teams overruled or departing.', mit: '6 Socioeconomic and environmental' },
      { code: 'OF-4', name: 'Broken safety commitments', description: 'Public safety commitments not kept, quietly changed or withdrawn.', mit: '6 Socioeconomic and environmental' },
    ],
  },
  {
    code: 'GV',
    slug: 'governance-response',
    name: 'Governance response',
    short: 'What regulators, labs and states do in response.',
    description:
      'Laws, enforcement, safety frameworks and international agreements that answer one of the risks above. Each governance entry links to the risk it responds to.',
    colorVar: '--risk-gv',
    subcategories: [
      { code: 'GV-1', name: 'Laws and enforcement', description: 'New legislation, regulatory action, investigations and penalties.', mit: 'n/a' },
      { code: 'GV-2', name: 'Industry safety frameworks', description: 'Frontier safety policies and their changes.', mit: 'n/a' },
      { code: 'GV-3', name: 'International coordination', description: 'Treaties, summits, joint statements, institute networks.', mit: 'n/a' },
    ],
  },
];

export const ALL_SUBCATEGORY_CODES = RISK_TYPES.flatMap((r) => r.subcategories.map((s) => s.code)) as [string, ...string[]];

export function riskTypeOf(code: string): RiskType {
  const prefix = code.split('-')[0] as RiskTypeCode;
  const rt = RISK_TYPES.find((r) => r.code === prefix);
  if (!rt) throw new Error(`Unknown risk code ${code}`);
  return rt;
}

export function subcategory(code: string): Subcategory {
  const sc = riskTypeOf(code).subcategories.find((s) => s.code === code);
  if (!sc) throw new Error(`Unknown subcategory ${code}`);
  return sc;
}

// Evidence ladder: how strong the evidence is, not how bad the event was.
export const TIERS = {
  T1: { label: 'Theoretical', description: 'A credible expert argument or scenario, with no empirical demonstration yet.' },
  T2: { label: 'Lab-demonstrated', description: 'Behaviour or capability shown in evaluations, red-teaming or a controlled simulation.' },
  T3: { label: 'Observed in deployment', description: 'Shown by a real system outside a controlled setting, without confirmed serious harm.' },
  T4: { label: 'Confirmed harm', description: 'Real-world harm, verified by more than one independent source.' },
} as const;

// Severity: Cassandra's judgement of the worst plausible outcome if this pattern scales.
export const SEVERITIES = {
  low: 'Low',
  significant: 'Significant',
  severe: 'Severe',
  catastrophic: 'Catastrophic',
} as const;

// Resource library: every source has a discipline (whose literature it belongs to)
// and a type (what kind of document it is). Researchers filter on both.
export const DISCIPLINES = {
  'technical-safety': { label: 'Technical AI safety', description: 'Alignment, control, evaluations, interpretability and the security of AI systems.' },
  'cybersecurity': { label: 'Cybersecurity', description: 'Incident response, threat intelligence, vulnerabilities, forensics and supply-chain security.' },
  'governance-policy': { label: 'Governance and policy', description: 'Safety institutes, governments, international bodies, lab safety frameworks and think tanks.' },
  'law-regulation': { label: 'Law and regulation', description: 'Statutes, reporting duties, liability, enforcement and legal scholarship.' },
  'ethics-philosophy': { label: 'Ethics and philosophy', description: 'Responsibility, precaution, research ethics and the moral questions the incident raises.' },
  'security-geopolitics': { label: 'Security and geopolitics', description: 'National security, military and offensive capability, state competition and export controls.' },
  'general': { label: 'General coverage', description: 'Reporting and explainers written for a general audience.' },
} as const;
export type Discipline = keyof typeof DISCIPLINES;

export const RESOURCE_TYPES = {
  'primary-disclosure': 'Primary disclosure',
  'official': 'Official',
  'legislation': 'Legislation',
  'advisory': 'Security advisory',
  'paper': 'Peer-reviewed paper',
  'preprint': 'Preprint',
  'report': 'Report',
  'think-tank': 'Think tank',
  'newsletter': 'Newsletter',
  'blog-expert': 'Expert blog',
  'forum-expert': 'Expert forum post',
  'news': 'News',
  'explainer': 'Explainer',
  'podcast': 'Podcast',
  'repository': 'Repository',
  'dataset': 'Dataset',
} as const;
export type ResourceType = keyof typeof RESOURCE_TYPES;

export const CREDIBILITY = {
  primary: { label: 'Primary source', description: 'Published by a party directly involved.' },
  verified: { label: 'Verified', description: 'Independent analysis or an official body that checked the primary evidence.' },
  reported: { label: 'Reported', description: 'Established journalism, not independently confirmed here.' },
  commentary: { label: 'Commentary', description: 'Interpretation by credible experts; not proof of fact.' },
} as const;
