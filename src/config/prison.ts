/**
 * PRISON STREAM — single source of truth.
 *
 * Everything the project has not officially announced lives here as a
 * placeholder. Update this file as information is revealed; the whole site
 * re-renders around it. No component hard-codes an assumption.
 */

/** ---------------------------------------------------------------------
 * TERMINOLOGY
 * What the participants are officially called is NOT confirmed.
 * Change these strings once it is; they are used site-wide.
 * ------------------------------------------------------------------- */
export const terms = {
  /** singular, neutral */
  person: "Creator",
  /** plural, neutral */
  people: "Creators",
  /** collective noun for the group */
  group: "The Roster",
  /** what a profile page is called */
  profile: "File",
} as const;

/** ---------------------------------------------------------------------
 * LAUNCH
 * When the exact date is announced: set `exactDateAnnounced: true` and
 * fill `targetIso`. The Lockdown section swaps the placeholder for a real
 * countdown automatically. Do NOT guess a date.
 * ------------------------------------------------------------------- */
export const launch = {
  window: "23 OCTOBER",
  year: "2026",
  exactDateAnnounced: true,
  /** Confirmed launch: 23 October 2026, 20:00 UK */
  targetIso: "2026-10-23T19:00:00Z" as string | null,
  dateLabel: "23 OCTOBER 2026",
  timeLabel: "20:00 UK",
  status: "CONFIRMED — GATES OPEN SOON",
} as const;

/** Atmospheric readouts. Visual only — never fake statistics. */
export const systemReadout = [
  { label: "SYSTEM STATUS", value: "ACTIVE", tone: "ok" as const },
  { label: "TRANSMISSIONS", value: "STANDBY", tone: "warn" as const },
  { label: "ROSTER", value: "CLASSIFIED", tone: "muted" as const },
  { label: "NEXT REVEAL", value: "UNKNOWN", tone: "muted" as const },
  { label: "LAUNCH", value: "23 OCTOBER 2026", tone: "ok" as const },
  { label: "SECURITY LEVEL", value: "[CLASSIFIED]", tone: "muted" as const },
];

export const projectFile = [
  { label: "PROJECT", value: "PRISON STREAM" },
  { label: "STATUS", value: "ACTIVE" },
  { label: "LAUNCH", value: "23 OCTOBER 2026" },
  { label: "DATE", value: "23 OCTOBER 2026" },
  { label: "PARTICIPANTS", value: "CLASSIFIED" },
  { label: "LOCATION", value: "CLASSIFIED" },
  { label: "FORMAT", value: "CLASSIFIED" },
];

/** ---------------------------------------------------------------------
 * ROSTER
 * Nobody has been officially revealed. Add entries as announcements happen;
 * `placeholderFiles` only controls how many empty files are displayed and
 * does NOT imply a participant count.
 * ------------------------------------------------------------------- */
import xkeonteAsset from "@/assets/xkeonte-portrait.jpg";
import hassynainAsset from "@/assets/hassynain.png";
import xandeptAsset from "@/assets/xandept.png";
import sebzAsset from "@/assets/sebzonair.jpg";
import amiriAsset from "@/assets/4didit-group.png";
import primeAsset from "@/assets/primedehaney.png";
import mrwrldAsset from "@/assets/upload-image-2.png";
import samhamAsset from "@/assets/upload-image-3.png";
import angelAsset from "@/assets/angelmurray.jpg";
import mr100Asset from "@/assets/upload-image-5.png";
import noisebykjAsset from "@/assets/upload-image-6.png";
import lbmmAsset from "@/assets/lbmm.jpg";
import r3dAsset from "@/assets/upload-image-8.png";
import tyroneAsset from "@/assets/tyrone1mc.jpg";
import kingsleyAsset from "@/assets/upload-image-10.png";
import remyb0ysAsset from "@/assets/remyb0ys.png";
import britishboycamAsset from "@/assets/britishboycam.png";
import mallyclipzAsset from "@/assets/mallyclipz.png";
import sammyamzAsset from "@/assets/sammyamz.png";
import jmarnzAsset from "@/assets/jmarnz.png";
import mastiempoAsset from "@/assets/mastiempo01.png";
import j1ggzzAsset from "@/assets/j1ggzz365.png";
import j4dentvAsset from "@/assets/j4dentv.jpg";
import ysabellaAsset from "@/assets/ysabellagrace.png";
import smoothboimoAsset from "@/assets/smoothboimo.png";
import goobAsset from "@/assets/goob.png";
import starTejalAsset from "@/assets/star_tejal.png";
import yodeangeloAsset from "@/assets/yodeangelo.png";
import gracieAsset from "@/assets/gracie.png";
import lunamichelle2Asset from "@/assets/lunamichelle2.png";
import moalshemeriAsset from "@/assets/moalshemeri.png";
import tigzAsset from "@/assets/tigz.png";
import queentayxAsset from "@/assets/queentayx.png";
import lilaAsset from "@/assets/lila.png";

export type SocialLink = { platform: string; url: string };

/**
 * Database clearance for a creator.
 * CLASSIFIED — in the database, not cleared for release (search returns classified).
 * CONFIRMED  — cleared: search runs the full scan and unseals the file.
 * REVEALED   — already unsealed publicly; search still runs the scan.
 */
export type Clearance = "CLASSIFIED" | "CONFIRMED" | "REVEALED";

export type RosterEntry = {
  /** file number, e.g. "001" */
  file: string;
  revealed: boolean;
  /** database clearance — drives the reveals search terminal */
  clearance?: Clearance;
  name?: string;
  /** extra spellings the search should recognise */
  aliases?: string[];
  username?: string;
  platform?: string;
  bio?: string;
  image?: string;
  socials?: SocialLink[];
  streamUrl?: string;
  announcedOn?: string;
  status?: string;
  /** position within the organisation, if revealed */
  role?: string;
};


export const placeholderFiles = 6;

export const roster: RosterEntry[] = [
  {
    file: "001",
    revealed: true,
    clearance: "REVEALED",
    name: "XKEONTE",
    aliases: ["XKEONTE", "X KEONTE", "KEONTE"],
    platform: "TWITCH",
    role: "INMATE",
    image: xkeonteAsset,
    bio: "xKeonte is a Birmingham-based streamer known for his laid-back personality and variety of content. He regularly does Just Chatting, reaction and VALORANT streams, bringing plenty of energy and personality to his broadcasts. He has also collaborated with 4didit, including an outdoor stream with the group, showing his variety in his streams. He orchestrated the Prison Stream which is an outstanding act to do at such a small creator. He put time and effort into making this stream happen!",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@xkeonte_plug" },
      { platform: "Instagram", url: "https://www.instagram.com/x.keonte/" },
      { platform: "YouTube", url: "https://www.youtube.com/@xKeonte" },
      { platform: "Twitch", url: "https://www.twitch.tv/xkeonte/" },
      { platform: "X", url: "https://x.com/Keont333" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "002",
    revealed: true,
    clearance: "REVEALED",
    name: "SEBZONAIR",
    aliases: ["SEBZ", "SEBZ ON AIR", "SEBZONAIRLIVE"],
    platform: "TWITCH",
    role: "INMATE",
    image: sebzAsset,
    bio: "SebzOnAir is a Manchester-based streamer and content creator known for his energetic personality and variety of livestream content. He creates IRL streams, Fortnite content and different challenges, often bringing a spontaneous and entertaining style to his broadcasts. He also spent two months in London, where he linked up with different streamers and stayed consistent with his content, making the most of the opportunities to collaborate and meet new people. SebzOnAir also hosted a streamer sleepover with six other streamers, creating a unique group stream filled with challenges, conversations and entertainment.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@sebzonairlive" },
      { platform: "Instagram", url: "https://www.instagram.com/sebzonair/" },
      { platform: "YouTube", url: "https://www.youtube.com/@SebzOnAir" },
      { platform: "Twitch", url: "https://www.twitch.tv/sebzonair" },
      { platform: "X", url: "https://x.com/sebzonair41659" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "003",
    revealed: true,
    clearance: "REVEALED",
    name: "4DIDIT",
    aliases: ["4 DID IT", "AMIRIDIDIT", "AMIRI DID IT", "AMIRI", "DIDITCLIPS"],
    platform: "TWITCH",
    role: "INMATE",
    image: amiriAsset,
    bio: "4didit is a Birmingham-based content group made up of Amiri, Jalarq, Twigz and Boogz. The group is known for creating entertaining and unpredictable content together, with each member bringing their own personality and style to their streams. Their content includes IRL and gaming streams, challenges and group entertainment. They have also taken their content outside the usual streaming setup, creating an outdoor stream, a camping stream and a boxing stream, giving their audience a variety of different experiences to watch!",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@diditclips" },
      { platform: "Instagram", url: "https://www.instagram.com/diditclips/" },
      { platform: "Twitch", url: "https://www.twitch.tv/4didit" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "005",
    revealed: true,
    clearance: "CONFIRMED",
    name: "PRIMEDEHANEY",
    aliases: ["PRIME DEHANEY", "PRIME", "DEHANEY", "DEHANEYRYAN"],
    role: "INMATE",
    image: primeAsset,
    bio: "PrimeDehaney is a Birmingham-based streamer and content creator known for his IRL streams, Just Chatting content and TikTok videos. He is mainly focused on the IRL side of streaming, often taking his content outside and creating entertaining moments with the people around him. Alongside his livestreams, he regularly posts on TikTok, helping him reach a wider audience and grow his presence online.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@primedehaney" },
      { platform: "Instagram", url: "https://www.instagram.com/primedehaney/" },
      { platform: "YouTube", url: "https://www.youtube.com/@primedehaney" },
      { platform: "Twitch", url: "https://www.twitch.tv/primedehaney" },
      { platform: "X", url: "https://x.com/DehaneyRyan" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "006",
    revealed: true,
    clearance: "CONFIRMED",
    name: "MRWRLD",
    aliases: ["MR WRLD", "MRWORLD", "MRWRLDD", "ITSMRWRLD"],
    role: "INMATE",
    image: mrwrldAsset,
    bio: "MrWrld is a South London YouTuber, streamer and content creator known for his presence across the UK creator and music scene. He began streaming in 2025, while also building his YouTube channel and growing a community around his personality and content. He has appeared in FourNine's music videos and has also worked on music of his own, giving him a presence beyond streaming and YouTube. Through his different projects and collaborations, MrWrld continues to build his name and community online.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@mrwrldd" },
      { platform: "Instagram", url: "https://www.instagram.com/mrwrldd" },
      { platform: "YouTube", url: "https://www.youtube.com/@ItsMrWrld" },
      { platform: "Twitch", url: "https://www.twitch.tv/itsmrwrld" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@tcmmr.wrld" },
      { platform: "X", url: "https://x.com/MrWrldd" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "007",
    revealed: true,
    clearance: "CONFIRMED",
    name: "SAMHAM",
    aliases: ["SAM HAM", "SAM"],
    role: "INMATE",
    image: samhamAsset,
    bio: "SamHam is a London-based streamer and content creator known for his Just Chatting, gaming and IRL content. He has built a strong community around his personality and collaborations with other creators, becoming one of the top five UK streamers. SamHam has also grown his presence across Twitch, YouTube and TikTok, regularly creating entertaining streams and content that have helped him become a recognised name in the UK streaming scene.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@samham" },
      { platform: "Instagram", url: "https://www.instagram.com/samham/" },
      { platform: "YouTube", url: "https://www.youtube.com/@samham" },
      { platform: "Twitch", url: "https://www.twitch.tv/samham" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@samham" },
      { platform: "X", url: "https://x.com/Samham__" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "008",
    revealed: true,
    clearance: "CONFIRMED",
    name: "ANGELMURRAY",
    aliases: ["ANGEL MURRAY", "ANGEL", "ANGELMURRAYYY"],
    role: "INMATE",
    image: angelAsset,
    bio: "AngelMurray is a London-based streamer and content creator who originally started out in music, releasing her own songs and building an audience around her work. She later moved into streaming and online content, where she has continued growing her community through Twitch and TikTok. She has also taken part in Q&A and media appearances, giving her audience a chance to see more of her personality outside of music.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@angelmurrayyy" },
      { platform: "Instagram", url: "https://www.instagram.com/angelmurrayyy/" },
      { platform: "YouTube", url: "https://www.youtube.com/@Angelmurraymusic" },
      { platform: "Twitch", url: "https://www.twitch.tv/angelmurrayyy" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@angelmurrayyy" },
      { platform: "X", url: "https://x.com/angelmurrayyy" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "009",
    revealed: true,
    clearance: "CONFIRMED",
    name: "MR£100",
    aliases: ["MR100", "MR 100", "MR100PAND", "MR £100", "MR100PAND"],
    role: "INMATE",
    image: mr100Asset,
    bio: "Mr100Pand is a UK-based streetball and basketball content creator known for his 1v1s, basketball challenges and entertaining on-court personality. He has built a following by taking on players across different locations and creating competitive basketball content for social media. His videos often mix skill, trash talk and entertainment, with his content appearing across platforms including Instagram and Snapchat.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@mr100pand" },
      { platform: "Instagram", url: "https://www.instagram.com/mr100pand" },
      { platform: "YouTube", url: "https://www.youtube.com/@mr100pand" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "010",
    revealed: true,
    clearance: "CONFIRMED",
    name: "NOISEBYKJ",
    aliases: ["NOISE BY KJ", "NOISEBY KJ", "KJ", "NOISEFROMKJ"],
    role: "INMATE",
    image: noisebykjAsset,
    bio: "NoiseByKJ is a Birmingham-based artist making a name for himself with his distinctive sound and natural presence. Known for bringing energy and personality to his music, KJ has continued to build momentum through his own releases and collaborations. He also caught attention after appearing in a freestyle with BrumTownUK, putting his talent and confidence on display. With his consistency and growing presence, NoiseByKJ is quickly becoming an artist to watch from Birmingham's next generation.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@noisebykj" },
      { platform: "Instagram", url: "https://www.instagram.com/noisefromkj/" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "011",
    revealed: true,
    clearance: "CONFIRMED",
    name: "LBMM",
    aliases: ["LBM", "L B M M", "LBMM100"],
    role: "INMATE",
    image: lbmmAsset,
    bio: "LBM is a UK-based streamer and content creator known for his diverse range of content and love for gaming. He streams everything from GTA RP and reaction content to testing out the latest games, always keeping his streams fresh and unpredictable. His willingness to try new games and different types of content has helped him build a strong community, while his personality keeps viewers coming back for more.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@lbmm100" },
      { platform: "Instagram", url: "https://www.instagram.com/lbmms_/" },
      { platform: "YouTube", url: "https://www.youtube.com/@LBMMLIVE" },
      { platform: "Twitch", url: "https://www.twitch.tv/lbmm" },
      { platform: "X", url: "https://x.com/LBMM100" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "012",
    revealed: true,
    clearance: "CONFIRMED",
    name: "R3DEMPTIONTJ",
    aliases: ["R3DEMPTION", "REDEMPTION", "REDEMPTIONTJ", "R3D"],
    role: "INMATE",
    image: r3dAsset,
    bio: "R3demptionTJ is a North London-based streamer and content creator known for his entertaining personality and variety of content. He mainly focuses on Just Chatting and IRL streams, while also jumping into gaming from time to time. Outside of streaming, he creates TikTok skits and posts across YouTube, Snapchat and TikTok. He is also the creator of Prospect House, a creator project bringing together streamers and personalities to make content, collaborate and build something bigger as a community.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@r3demptiontj" },
      { platform: "Instagram", url: "https://www.instagram.com/r3demptiontj/" },
      { platform: "YouTube", url: "https://www.youtube.com/@r3demption" },
      { platform: "Twitch", url: "https://www.twitch.tv/r3demptiontj" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@r3demption_tj" },
      { platform: "X", url: "https://x.com/R3demptionTJ" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "013",
    revealed: true,
    clearance: "CONFIRMED",
    name: "TYRONE1MC",
    aliases: ["TYRONE", "TYRONE 1MC", "TYRONE1"],
    role: "INMATE",
    image: tyroneAsset,
    bio: "Tyrone1mc is a British streamer, content creator and musician who has become one of the top five UK streamers, building a huge following of more than 2.5 million people across his social platforms. He is best known for his GTA RP streams, reactions, gaming and IRL content, bringing a big personality and plenty of energy to everything he does.\nTyrone has played on major GTA RP servers including NoPixel, District 10 and Unique RP, while his success on Twitch has seen him become a Twitch Partner and surpass 5 million watch hours. Away from streaming, he is also a musician and part of the dance music group FooR, performing at major UK festivals and working with artists including Nathan Dawe and Anne-Marie.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@tyrone" },
      { platform: "Instagram", url: "https://www.instagram.com/tyrone1mc/" },
      { platform: "YouTube", url: "https://www.youtube.com/@tyrone1mc" },
      { platform: "Twitch", url: "https://www.twitch.tv/tyrone" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@tyrone1mc" },
      { platform: "X", url: "https://x.com/tyrone1mc" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "014",
    revealed: true,
    clearance: "CONFIRMED",
    name: "KINGSLEYCMA",
    aliases: ["KINGSLEY", "KINGSLEY CMA", "CMA WAY", "CMAWAY"],
    role: "INMATE",
    image: kingsleyAsset,
    bio: "KingsleyCMA is a UK-based content creator and streamer known for his incredible consistency and wide range of content. He originally started out on YouTube before expanding to Twitch and TikTok, where he now regularly multi-streams across platforms. Kingsley is known for going live almost every day and keeping things fresh with gaming, Just Chatting, IRL and a variety of different streams. His dedication and consistency have helped him build a loyal community known as the CMA Way, which continues to grow alongside his content.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@kingsleycma" },
      { platform: "Instagram", url: "https://www.instagram.com/kingsleycma" },
      { platform: "YouTube", url: "https://www.youtube.com/@kingsleycma" },
      { platform: "Twitch", url: "https://www.twitch.tv/kingsleycma" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@cmawayttv" },
      { platform: "X", url: "https://x.com/kingsleycma" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "021",
    revealed: true,
    clearance: "CONFIRMED",
    name: "REMYB0YS",
    aliases: ["REMY", "REMYB0YS", "REMY BOYS", "REMYBOYS", "REMYBOY", "REMYB0Y", "R.BOYSZ", "RBOYSZ"],
    role: "INMATE",
    image: remyb0ysAsset,
    bio: "Remyb0ys is a UK content creator who first became known for his funny and viral dancing videos, often doing dances to songs and music videos featuring UK rappers. As his audience grew, he slowly moved into TikTok LIVE, before eventually making the jump to Twitch. He's since built his own community through Just Chatting and FIFA streams, bringing the same personality and humour that made his dance videos so popular.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@r.boysz" },
      { platform: "Twitch", url: "https://www.twitch.tv/remyb0ys" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "022",
    revealed: true,
    clearance: "CONFIRMED",
    name: "BRITISHBOYCAM",
    aliases: ["BRITISH BOY CAM", "CAM", "BBC", "BOYCAM"],
    role: "INMATE",
    image: britishboycamAsset,
    bio: "BritishBoyCam is a South London streamer and content creator who has been steadily making a name for himself in the streaming scene. Having started out as a viewer and moderator, he eventually stepped in front of the camera and began building his own audience through Just Chatting content and collaborations with other streamers. His journey from supporting creators to becoming one himself makes his growth especially standout, and he continues to build his community with every stream.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@britishboycam" },
      { platform: "Instagram", url: "https://www.instagram.com/britishboycam/" },
      { platform: "Twitch", url: "https://www.twitch.tv/britishboycam" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "023",
    revealed: true,
    clearance: "CONFIRMED",
    name: "LILA",
    aliases: ["LILA SENAINI", "LILASENAINI", "LILA.SENAINI"],
    role: "INMATE",
    image: lilaAsset,
    bio: "Lila is a creator who keeps her content focused on Instagram, where she shares pictures, moments from her life and her personal style. Her page gives followers a simple look into her life and personality through the content she posts.",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/lila.senaini/" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "024",
    revealed: true,
    clearance: "CONFIRMED",
    name: "MALLYCLIPZ",
    aliases: ["MALLY", "MALLY CLIPZ", "MALLYCLIPS", "MALLY CLIPS", "MALLY_CLIPS"],
    role: "INMATE",
    image: mallyclipzAsset,
    bio: "Mally Clips is a growing streamer and content creator known for his funny skits and hilarious prank videos, especially the moments he creates with his African mum. His content has built him an audience through relatable humour and entertaining family moments, before he began taking his personality into streaming. Mally continues to grow as a creator, bringing the same comedy and energy from his videos into his streams.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@mally_clips" },
      { platform: "Instagram", url: "https://www.instagram.com/mally_clips/" },
      { platform: "YouTube", url: "https://www.youtube.com/@Mallyclips7" },
      { platform: "Twitch", url: "https://www.twitch.tv/mallyclips" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "025",
    revealed: true,
    clearance: "CONFIRMED",
    name: "SAMMYAMZ",
    aliases: ["SAMMY", "SAMMY AMZ", "SAMMYAMZZ"],
    role: "INMATE",
    image: sammyamzAsset,
    bio: "SammyAmz is a creator who first built his name through funny and viral TikTok skits before making the switch to Twitch. He's carried that same humour into his streams while still creating skits on the side, as well as prank content on YouTube. SammyAmz was also part of the FaZe Subathon, adding to his growing presence in the creator scene. His consistency, comedy and ability to keep his content fresh have helped him continue building a strong audience.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@sammyamz" },
      { platform: "Instagram", url: "https://www.instagram.com/sammyamzz/" },
      { platform: "YouTube", url: "https://www.youtube.com/@SammyAmz" },
      { platform: "Twitch", url: "https://www.twitch.tv/sammyamz" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@sammyamz0" },
      { platform: "X", url: "https://x.com/sammyamzz" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "026",
    revealed: true,
    clearance: "CONFIRMED",
    name: "JMARNZ",
    aliases: ["J MARNZ", "JMARNZ", "REALJMARNZ", "REAL JMARNZ", "MARNZ", "OFFICIALJMARNZ"],
    role: "INMATE",
    image: jmarnzAsset,
    bio: "JMarnz is a Milton Keynes-based creator who first grew his audience through relatable videos and funny skits, reaching around 170K followers before his account was banned. He's since started again and has been growing quickly, creating content across TikTok, YouTube and Twitch. Whether he's going live, making funny moments with guests or creating videos for YouTube, JMarnz has stayed consistent and is quickly rebuilding the audience he had before.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@officialjmarnz" },
      { platform: "Instagram", url: "https://www.instagram.com/realjmarnz/" },
      { platform: "YouTube", url: "https://www.youtube.com/@RealJmarnz" },
      { platform: "Twitch", url: "https://www.twitch.tv/realjmarnz" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@therealjmarnz" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "027",
    revealed: true,
    clearance: "CONFIRMED",
    name: "MASTIEMPO01",
    aliases: ["MASTIEMPO", "TIEMPO", "MAS TIEMPO", "MASTIEMPO 01"],
    role: "INMATE",
    image: mastiempoAsset,
    bio: "Mastiempo01 is a UK creator who is just getting started in the streaming scene. Before becoming a creator himself, he spent time modding for other UK streamers, getting to know the community and seeing the streaming world from behind the scenes. Eventually, he decided it was time to give it a go himself, and he's now growing his own audience and building his name as a creator.",
    socials: [
      { platform: "Twitch", url: "https://www.twitch.tv/mastiempo01" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "028",
    revealed: true,
    clearance: "CONFIRMED",
    name: "J1GGZZ365",
    aliases: ["J1GGZZ", "JIGGZZ", "365", "JIGGZ", "JIGGZ365", "JIGGZZ365", "J1GGZ", "J1GGZ365"],
    role: "INMATE",
    image: j1ggzzAsset,
    bio: "J1ggzz365 is a South London creator focused on building something bigger than just streaming. He creates skits across different locations, putting real effort into the production and professionalism of his content, while also staying consistent with Twitch and YouTube. With his own community page and a growing audience behind him, J1ggzz365 is working towards turning his community into a recognisable brand of its own.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@j1ggzz365" },
      { platform: "Instagram", url: "https://www.instagram.com/j1ggzz365" },
      { platform: "YouTube", url: "https://www.youtube.com/@j1ggzz365" },
      { platform: "Twitch", url: "https://www.twitch.tv/j1ggzz365" },
      { platform: "X", url: "https://x.com/j1ggzz365" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "029",
    revealed: true,
    clearance: "CONFIRMED",
    name: "J4DENTV",
    aliases: ["J4DEN", "JADEN", "4TV", "JADENTV", "J4DEN TV"],
    role: "INMATE",
    image: j4dentvAsset,
    bio: "J4denTV is a growing Nottingham creator and streamer known for his high-energy streams, funny moments and personality-driven content. He stays consistent across Twitch, TikTok and YouTube Shorts, regularly turning his streams into entertaining short-form content. With his community 4TV behind him, J4denTV continues to grow and build his name in the UK streaming scene.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@j4dentv_" },
      { platform: "Instagram", url: "https://www.instagram.com/j4denTV" },
      { platform: "YouTube", url: "https://www.youtube.com/@j4denlive" },
      { platform: "Twitch", url: "https://www.twitch.tv/j4denTV" },
      { platform: "X", url: "https://x.com/j4denTV" },
      { platform: "Linktree", url: "https://linktr.ee/j4dentv" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "030",
    revealed: true,
    clearance: "CONFIRMED",
    name: "YSABELLAGRACE",
    aliases: ["YSABELLA", "YSABELLA GRACE", "ISABELLA", "ISABELLAGRACE", "GRACE"],
    role: "GUIDANCE COUNSELOR",
    image: ysabellaAsset,
    bio: "Ysabella Grace is a London-based gamer, streamer and content creator who has built her name through her love for gaming and streaming, particularly Call of Duty. She became known for interviewing some of the biggest names in the scene, including Kai Cenat, before making history as the first UK woman to attend Kai's Streamer University in 2026. She continues to grow her presence in the gaming and streaming world while representing the UK on a bigger stage.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@ysabellagrace_" },
      { platform: "Instagram", url: "https://www.instagram.com/ysabellagrace_/" },
      { platform: "YouTube", url: "https://www.youtube.com/@ysabellagrace" },
      { platform: "Twitch", url: "https://www.twitch.tv/ysabellagrace" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@ysabellagrace" },
      { platform: "X", url: "https://x.com/YsabellaGrace_" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "031",
    revealed: true,
    clearance: "CONFIRMED",
    name: "SMOOTHBOIMO",
    aliases: ["SMOOTHBOIMO_", "SMOOTHBOYMO", "SMOOTH BOI MO", "MO"],
    role: "INMATE",
    image: smoothboimoAsset,
    bio: "Smoothboimo is a South London creator known for his funny skits, Twitch streams and entertaining videos across TikTok, Instagram Reels, YouTube and Snapchat. He's also started branching into vlogs and YouTube challenges, often bringing moments from his Twitch streams into his videos. With his natural humour, personality and growing consistency, Smoothboimo is quickly building his own name across the UK creator scene.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@smoothboimoplugpage" },
      { platform: "Instagram", url: "https://www.instagram.com/smoothboimo/" },
      { platform: "YouTube", url: "https://www.youtube.com/@Smoothboimo" },
      { platform: "Twitch", url: "https://www.twitch.tv/smoothboimo_" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@smoothboimo" },
      { platform: "X", url: "https://x.com/smoothboimo" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "033",
    revealed: true,
    clearance: "CONFIRMED",
    name: "GOOB",
    aliases: ["NOSTYLISTJETLGGD", "JETLGGD", "GOOBY"],
    role: "INMATE",
    image: goobAsset,
    bio: "Goob is a UK content creator known for her relatable TikToks and Instagram posts. Her content is all about those everyday moments that people can instantly relate to, while her Instagram gives her audience more of a look into her life through her pictures. With her easygoing personality and consistent content, Goob is continuing to build a name for herself online.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@nostylistjetlggd" },
      { platform: "Instagram", url: "https://www.instagram.com/nostylistjetlggd/" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "034",
    revealed: true,
    clearance: "CONFIRMED",
    name: "STAR_TEJAL",
    aliases: ["STAR TEJAL", "STARTEJAL", "TEJAL", "STAR_TEJALXX", "STARTEJALXX"],
    role: "INMATE",
    image: starTejalAsset,
    bio: "Star Tejal is a UK creator who's built a growing audience through her relatable TikToks, streams and content across different platforms. Her videos are full of funny, everyday moments that her audience can easily see themselves in, while her streams give people a chance to see more of her personality. She's stayed active across social media and continues to grow her community.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@star_tejalxx" },
      { platform: "Instagram", url: "https://www.instagram.com/star_tejalxx/" },
      { platform: "YouTube", url: "https://www.youtube.com/channel/UCBFAeh6QubUVCNewlwQNH5w" },
      { platform: "Twitch", url: "https://www.twitch.tv/star_tejalxx" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@star_tejalxx" },
      { platform: "X", url: "https://x.com/star_tejalxx" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "035",
    revealed: true,
    clearance: "CONFIRMED",
    name: "YODEANGELO",
    aliases: ["YO DEANGELO", "DEANGELO", "IMDEANGELO", "YODEANGELO_"],
    role: "INMATE",
    image: yodeangeloAsset,
    bio: "YoDeangelo is a UK streamer and content creator known for his funny personality and entertaining content. He has built a growing audience through YouTube videos and livestreams, while also expanding across Twitch, Kick and YouTube. He gained even more attention after appearing in a Sidemen video, where his humour and natural personality stood out. With his consistency and ability to create funny moments wherever he goes, YoDeangelo is continuing to make a name for himself in the UK creator scene.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@yodeangelo" },
      { platform: "Instagram", url: "https://www.instagram.com/yodeangelo_" },
      { platform: "YouTube", url: "https://www.youtube.com/@YoDeangeloLIVE" },
      { platform: "Twitch", url: "https://www.twitch.tv/yodeangelo" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@yodeangelo" },
      { platform: "X", url: "https://x.com/yodeangelo" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "036",
    revealed: true,
    clearance: "CONFIRMED",
    name: "GRACIE",
    aliases: ["THYFAWN", "GRACIE"],
    role: "INMATE",
    image: gracieAsset,
    bio: "Gracie, also known as Thyfawn, is a creator who keeps things simple with her content on Instagram. She shares pictures, moments from her life and her own style, giving her followers a chance to see more of her personality through her page.",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/thyfawn/" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "016",
    revealed: true,
    clearance: "CONFIRMED",
    name: "LUNAMICHELLE",
    aliases: ["LUNA", "LUNAMICHELLE", "LUNAMICHELLEEEE", "ITSLUNAMICHELLE"],
    role: "INMATE",
    image: lunamichelle2Asset,
    bio: "LunaMichelle is a streamer and content creator best known for her IRL streams, where she shares different parts of her lifestyle and brings her audience along for the journey. Her content feels natural and personal, giving viewers a look into different experiences, places and moments from her life. She also creates content for TikTok and Instagram and continues to grow her community across her platforms, with plenty more to come from her.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@lunamichelleeee" },
      { platform: "Instagram", url: "https://www.instagram.com/lunamichelleeee/" },
      { platform: "Twitch", url: "https://www.twitch.tv/itslunamichelle" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "017",
    revealed: true,
    clearance: "CONFIRMED",
    name: "MOALSHEMERI",
    aliases: ["MO", "MOALSHEMERI", "MOALSHAMERI"],
    role: "INMATE",
    image: moalshemeriAsset,
    bio: "Moalshameri is a Birmingham-based content creator known for his funny and viral skits. His videos have a way of turning everyday situations into genuinely entertaining moments, with his personality and humour being a huge part of what makes his content stand out. He's built a growing audience through his skits and continues to put out content that gets people laughing, sharing and coming back for more.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@moalshameri" },
      { platform: "Instagram", url: "https://www.instagram.com/moalshameri/" },
      { platform: "YouTube", url: "https://www.youtube.com/@MoAlshameri" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "018",
    revealed: true,
    clearance: "CONFIRMED",
    name: "TIGZ",
    aliases: ["TIGS", "TIGZ", "TIGZINOO", "TIGZINOOO"],
    role: "INMATE",
    image: tigzAsset,
    bio: "Tigzinoo is a South London YouTuber, streamer and content creator known for his consistency, personality and versatility. From skits and YouTube videos to Brawlhalla, Sparking! ZERO, Just Chatting and IRL streams, he brings something different to everything he does. He also took part in the Prison Stream marathon with Jiggz, playing A Way Out together. With his growing community, The Cabin, Tigzinoo continues to build a strong presence across the creator scene.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@tigzinoo" },
      { platform: "Instagram", url: "https://www.instagram.com/tigzinoo" },
      { platform: "YouTube", url: "https://www.youtube.com/@tigztubee" },
      { platform: "Twitch", url: "https://www.twitch.tv/tigzinooo" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@tigzinoo" },
      { platform: "X", url: "https://x.com/tigzinoo" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "019",
    revealed: true,
    clearance: "CONFIRMED",
    name: "QUEENTAYX",
    aliases: ["QUEENTAY", "TAY", "QUEENTAYX", "QUEEN TAYX"],
    role: "INMATE",
    image: queentayxAsset,
    bio: "QueenTayX is a South London streamer and content creator known for her high-energy personality and consistent content. She switches between IRL and desktop streams, always bringing a lively atmosphere to her broadcasts. Outside of streaming, she creates relatable TikToks, Snapchat content and Reels, keeping her audience entertained across multiple platforms. Her consistency and personality have helped her build a growing community and a strong presence in the creator scene.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@queentayx.clips" },
      { platform: "Instagram", url: "https://www.instagram.com/queen.xtay/" },
      { platform: "YouTube", url: "https://www.youtube.com/@QueenTayx" },
      { platform: "Twitch", url: "https://www.twitch.tv/queentayx" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@tay.27x" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "037",
    revealed: true,
    clearance: "CONFIRMED",
    name: "XANDE",
    aliases: ["XANDE", "XANDEPT", "XANDE.PT", "XANDEPTT"],
    role: "INMATE",
    image: xandeptAsset,
    bio: "Xande.pt is a creator known for his storytimes and relatable TikToks, turning everyday situations into entertaining content that his audience can easily connect with. He's also taken his content further with YouTube vlogs and Twitch streams, giving people a chance to see more of his personality outside of his short-form videos. With his mix of content across platforms, Xande continues to build his audience and grow as a creator.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@xandeptt" },
      { platform: "Instagram", url: "https://www.instagram.com/xande_pt/" },
      { platform: "YouTube", url: "https://www.youtube.com/@xande_PT" },
      { platform: "Twitch", url: "https://www.twitch.tv/xandeptt" },
      { platform: "Website", url: "https://xande.pt" },
    ],
    status: "CONFIRMED — INSIDE",
  },
  {
    file: "038",
    revealed: true,
    clearance: "CONFIRMED",
    name: "HASSYNAIN",
    aliases: ["HASSY", "HASSYNAIN", "HASYNAIN"],
    role: "INMATE",
    image: hassynainAsset,
    bio: "Hassynain, better known as Hassy, is a London-born creator who has built his audience through his personality, humour and entertaining lifestyle content. He's active across TikTok, Instagram, Snapchat and Twitch, where he shares everything from funny moments and vlogs to more personal content that gives his audience a look into his life.\n\nHassy has also started pushing further into modelling and acting, attending major entertainment events and premieres as he continues to expand beyond social media. With his personality and ambition driving his content, he's steadily turning himself into a creator with a presence both online and in the wider entertainment world.",
    socials: [
      { platform: "TikTok", url: "https://www.tiktok.com/@hassynain" },
      { platform: "Instagram", url: "https://www.instagram.com/hassynain" },
      { platform: "YouTube", url: "https://www.youtube.com/@Hassynain" },
      { platform: "Twitch", url: "https://www.twitch.tv/hasynain" },
      { platform: "Snapchat", url: "https://www.snapchat.com/@hassynain" },
      { platform: "X", url: "https://x.com/hassynain" },
      { platform: "Discord", url: "https://discord.com/invite/2j3zM4KGv" },
    ],
    status: "CONFIRMED — INSIDE",
  },
];


/** ---------------------------------------------------------------------
 * LIVE TRANSMISSIONS — empty until streams actually exist.
 * ------------------------------------------------------------------- */
export type Stream = {
  id: string;
  creator: string;
  platform: string;
  title: string;
  viewers?: number;
  url: string;
};

export const liveStreams: Stream[] = [];

/** ---------------------------------------------------------------------
 * TRAILER — no trailer released yet.
 * ------------------------------------------------------------------- */
export const trailer = {
  released: true,
  label: "TRANSMISSION 001",
  /** Official trailer — YouTube */
  url: "https://www.youtube.com/watch?v=QrnMwZ_7gSU",
  runtime: "CLASSIFIED",
};

/** ---------------------------------------------------------------------
 * BULLETIN — official announcements only.
 * ------------------------------------------------------------------- */
export type Bulletin = {
  id: string;
  code: string;
  date: string;
  title: string;
  body: string;
  status: "VERIFIED" | "PENDING";
};

export const bulletins: Bulletin[] = [
  {
    id: "b-001",
    code: "BULLETIN 001",
    date: "CLASSIFIED",
    title: "THE FACILITY IS ONLINE",
    body: "Prison Stream exists. The launch window is Autumn 2026. Everything else remains behind locked doors.",
    status: "VERIFIED",
  },
  {
    id: "b-002",
    code: "BULLETIN 002",
    date: "2026",
    title: "FIRST FILES DECLASSIFIED",
    body: "The first names are out. XKeonte, SebzOnAir and 4DidIt are confirmed inside. Transmission 001 is live. Every other file remains sealed until searched.",
    status: "VERIFIED",
  },
  {
    id: "b-003",
    code: "BULLETIN 003",
    date: "19 SEPTEMBER 2026",
    title: "THE WEBSITE HAS OFFICIALLY LAUNCHED",
    body: "Prison Stream is officially live. The roster, the files and every official channel are now open to the public. Search the clearance database, pull up a file and see who's inside.",
    status: "VERIFIED",
  },
  {
    id: "b-004",
    code: "BULLETIN 004",
    date: "PENDING",
    title: "[REDACTED]",
    body: "[COMING SOON]",
    status: "PENDING",
  },
];


/** ---------------------------------------------------------------------
 * WHAT'S NEXT — nothing cleared for release yet.
 * ------------------------------------------------------------------- */
export type UpcomingItem = { id: string; label: string; when: string; kind: string };

export const upcoming: UpcomingItem[] = [];

/** ---------------------------------------------------------------------
 * SOCIALS — only real, official accounts. Empty until confirmed.
 * ------------------------------------------------------------------- */
export const officialSocials: SocialLink[] = [];
