/**
 * Services — the counter work.
 *
 * The rest of the site sells boxes. This is the half of the trade that brings
 * people back: repairs, upgrades, recovery, installation and maintenance. The
 * brand's own social card has advertised "Desktop & Laptop Spares · Networking
 * · CCTV" the whole time, so none of this is new business — it just had no
 * page.
 *
 * No prices and no turnaround promises. Both depend entirely on the fault and
 * on what is in stock, and a page that guarantees "24-hour repair" writes a
 * cheque the counter has to honour. What is stated instead is the *process*,
 * which is true every time: look first, quote second, work third.
 *
 * `symptoms` is the important field. People do not search for "motherboard
 * diagnostics", they search for "laptop not turning on" — so each service
 * leads with the words someone would actually use to describe their problem.
 */

export const SERVICE_GROUPS = [
  {
    id: 'repair',
    label: 'Repair & recovery',
    blurb: 'Something has stopped working. We find out why before anything is replaced.',
  },
  {
    id: 'upgrade',
    label: 'Upgrades & builds',
    blurb: 'The machine works — it is just not enough machine any more.',
  },
  {
    id: 'install',
    label: 'Installation',
    blurb: 'Work that happens at your premises rather than at our counter.',
  },
  {
    id: 'care',
    label: 'Ongoing care',
    blurb: 'Contracts for offices that cannot afford to wait for a failure.',
  },
];

export const services = [
  /* ── Repair & recovery ─────────────────────────────────────────────── */
  {
    id: 'desktop-repair',
    group: 'repair',
    name: 'Desktop repair',
    lead: 'Dead machines, restarts, blue screens and boards that no longer post.',
    symptoms: [
      'Will not power on at all',
      'Restarts or freezes under load',
      'Blue screen after Windows loads',
      'No display, fans spinning',
    ],
    covers: [
      'Bench diagnosis before any part is ordered',
      'Power supply, board and memory fault isolation',
      'Thermal paste, cooler and fan replacement',
      'Windows repair and driver rebuild',
    ],
    note: 'A large share of "dead" desktops are a failed PSU or a dislodged stick of memory. That is found on the bench in minutes, not guessed at.',
  },
  {
    id: 'laptop-repair',
    group: 'repair',
    name: 'Laptop repair',
    lead: 'Screens, hinges, keyboards, charging ports and the heat that kills batteries.',
    symptoms: [
      'Cracked or flickering screen',
      'Will not charge, or charges only at an angle',
      'Keys not registering',
      'Runs hot and shuts down',
    ],
    covers: [
      'Screen and panel replacement',
      'Charging port and DC jack repair',
      'Keyboard and palmrest replacement',
      'Full teardown clean and repaste',
    ],
    note: 'Charging faults are usually the port, not the battery. Worth checking before buying a battery you may not need.',
  },
  {
    id: 'data-recovery',
    group: 'repair',
    name: 'Data recovery',
    lead: 'When the drive is the problem and the files matter more than the machine.',
    symptoms: [
      'Drive not detected in BIOS',
      'Clicking or grinding hard disk',
      'Accidentally formatted or deleted',
      'Windows will not boot but files are needed',
    ],
    covers: [
      'Logical recovery from healthy but unreadable drives',
      'Recovery from formatted and corrupted partitions',
      'File transfer to a new drive or external',
      'Assessment before any recovery attempt',
    ],
    note: 'Keep using a failing drive and you reduce what can be recovered. Power it down and bring it in — that alone is often the difference.',
    caution: true,
  },

  /* ── Upgrades & builds ─────────────────────────────────────────────── */
  {
    id: 'upgrades',
    group: 'upgrade',
    name: 'Hardware upgrades',
    lead: 'Memory, storage, graphics and power — fitted and tested at the counter.',
    symptoms: [
      'Everything is slow with a few tabs open',
      'Out of disk space',
      'New games or software will not run',
      'Still on a mechanical hard disk',
    ],
    covers: [
      'SSD upgrade with Windows migrated across',
      'Memory capacity and dual-channel fixes',
      'Graphics card and power supply matching',
      'Compatibility checked against your board first',
    ],
    note: 'On an older machine an SSD is felt more than any other upgrade. We will say so rather than sell you a processor.',
  },
  {
    id: 'custom-build',
    group: 'upgrade',
    name: 'Custom PC assembly',
    lead: 'A machine specified around your work or your games, built and stress-tested here.',
    symptoms: [
      'Want a build, not a box off a shelf',
      'Have a budget and need it spent well',
      'Need a specific card or quiet operation',
      'Upgrading in stages over time',
    ],
    covers: [
      'Specification against the actual workload',
      'Assembly, cable management and BIOS setup',
      'Stress and thermal testing before handover',
      'An upgrade path noted for later',
    ],
    note: 'The spec is a conversation, not a form. Tell us what it has to run and the budget, and we will tell you honestly where the money should go.',
  },

  /* ── Installation ──────────────────────────────────────────────────── */
  {
    id: 'networking',
    group: 'install',
    name: 'Networking & Wi-Fi',
    lead: 'Cabling, switches, routers and access points for offices and shops.',
    symptoms: [
      'Wi-Fi does not reach the whole floor',
      'Wired points needed at new desks',
      'Shared printer or drive keeps dropping',
      'Adding desks to an existing network',
    ],
    covers: [
      'Structured cabling and points',
      'Router, switch and access point setup',
      'Shared storage and printer configuration',
      'Fault-finding on an existing network',
    ],
    note: 'Most "slow internet" in a small office is a switch or an access point in the wrong place, not the connection.',
  },
  {
    id: 'cctv',
    group: 'install',
    name: 'CCTV installation',
    lead: 'Cameras, recorders and remote viewing for shops, offices and homes.',
    symptoms: [
      'Need cameras at a shop or godown',
      'Existing system no longer recording',
      'Want to view the feed from a phone',
      'Adding cameras to what is already there',
    ],
    covers: [
      'Site survey and camera positioning',
      'Recorder, storage and cabling',
      'Remote and mobile viewing setup',
      'Service on existing installations',
    ],
    note: 'Camera count matters less than where they point. The survey is what decides whether the footage is usable.',
  },
  {
    id: 'server-setup',
    group: 'install',
    name: 'Server & workstation setup',
    lead: 'Shared storage, backups and fleet machines configured for a team.',
    symptoms: [
      'Files live on one person’s desktop',
      'No backup anywhere',
      'New office needs machines imaged',
      'Growing past a shared folder',
    ],
    covers: [
      'Server and NAS installation',
      'Backup schedule and restore testing',
      'Fleet imaging so every desk matches',
      'User accounts and shared permissions',
    ],
    note: 'A backup nobody has tested restoring is not a backup. We test the restore, not just the schedule.',
  },

  /* ── Ongoing care ──────────────────────────────────────────────────── */
  {
    id: 'amc',
    group: 'care',
    name: 'Annual maintenance (AMC)',
    lead: 'A contract for offices where a dead machine stops the day.',
    symptoms: [
      'Ten or more machines to keep running',
      'No in-house IT person',
      'Downtime costs real money',
      'Want predictable maintenance cost',
    ],
    covers: [
      'Scheduled preventive servicing',
      'Priority response on breakdowns',
      'Cleaning, repaste and health checks',
      'Spares held for the machines you run',
    ],
    note: 'Priced per fleet after we see what you are running. Ask for a site visit and a written scope.',
  },
];

/** The process, stated once. It is the same for every job on this page. */
export const SERVICE_PROCESS = [
  {
    step: '01',
    title: 'Bring it in, or call us out',
    body: 'Counter work happens at the shop. Networking, CCTV and server work happens at your premises.',
  },
  {
    step: '02',
    title: 'We look before we quote',
    body: 'Diagnosis first. You get told what is actually wrong, including when the honest answer is that it is not worth repairing.',
  },
  {
    step: '03',
    title: 'You approve the estimate',
    body: 'No work starts until the cost is agreed. If the fault turns out to be something else, you hear about it before we continue.',
  },
  {
    step: '04',
    title: 'Tested before handover',
    body: 'Repairs are run and checked, not handed back the moment they power on.',
  },
];

export function servicesIn(group) {
  return group === 'all' ? services : services.filter((s) => s.group === group);
}
