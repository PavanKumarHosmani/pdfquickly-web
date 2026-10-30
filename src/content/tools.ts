import type { EngineId, ToolOptions } from "@/lib/engines";

export type Category = "pdf" | "image";

export type ToolPage = {
  slug: string;
  engine: EngineId;
  category: Category;
  /** Core tools appear in menus and on the home page; keyword pages are linked from their core tool. */
  primary: boolean;
  /** Short name for menus and links. */
  name: string;
  /** One line for tool lists. */
  blurb: string;
  /** <title>, under 60 characters. */
  title: string;
  /** Meta description, under 160 characters. */
  description: string;
  h1: string;
  lead: string;
  pickLabel: string;
  presets?: Partial<ToolOptions>;
  stepsHeading: string;
  steps: string[];
  aboutHeading: string;
  about: string[];
  faqs: { q: string; a: string }[];
  related: string[];
  /** ISO date-time this page's content last changed. Defaults to site.contentUpdated. */
  updated?: string;
};

const PRIVACY_FAQ = {
  q: "Are my files safe?",
  a: "Files travel over an encrypted HTTPS connection and go to private storage that only this service can read. Nobody looks at them, and they're deleted automatically within 24 hours.",
};

const KB_SIZES = [20, 50, 100, 200];

function kbPage(p: {
  kb: number;
  blurb: string;
  description: string;
  lead: string;
  aboutHeading: string;
  about: string[];
  faqs: { q: string; a: string }[];
}): ToolPage {
  return {
    slug: `compress-image-to-${p.kb}kb`,
    engine: "compressImage",
    category: "image",
    primary: false,
    name: `Compress to ${p.kb} KB`,
    blurb: p.blurb,
    title: `Compress Image to ${p.kb} KB Online Free | PDF Quickly`,
    description: p.description,
    h1: `Compress image to ${p.kb} KB`,
    lead: p.lead,
    pickLabel: "Choose an image",
    presets: { targetKb: String(p.kb) },
    stepsHeading: `How to reduce a photo to ${p.kb} KB`,
    steps: [
      "Choose the photo you need to shrink.",
      `The target is already set to ${p.kb} KB. Change it if your form asks for something else.`,
      "Select Compress image, check the preview, then download.",
    ],
    aboutHeading: p.aboutHeading,
    about: p.about,
    faqs: [...p.faqs, PRIVACY_FAQ],
    related: [...KB_SIZES.filter((k) => k !== p.kb).map((k) => `compress-image-to-${k}kb`), "compress-image", "jpg-to-pdf"],
  };
}

const CONVERTER_FAQ: Record<string, { q: string; a: string }> = {
  "jpg-to-png": { q: "Why is my PNG bigger than the JPG?", a: "PNG stores every pixel without lossy compression, so photos come out several times larger. That's expected. If size matters more than editing, keep the JPG." },
  "png-to-jpg": { q: "How much smaller will my file get?", a: "For photos and screenshots with lots of colour, often 70 to 90 percent smaller. Simple graphics with flat colours shrink less, and may look better kept as PNG." },
  "webp-to-jpg": { q: "Why do saved images from websites come out as WebP?", a: "Websites use WebP because it loads faster. Your browser saves the file in the format the site sent, even though many other apps can't open it." },
  "webp-to-png": { q: "Should I pick PNG or JPG for a WebP file?", a: "PNG for logos, icons and anything with a transparent background. JPG for photos, where it gives a much smaller file." },
};

const CONVERTER_FAQ_2: Record<string, { q: string; a: string }> = {
  "jpg-to-png": { q: "Will converting to PNG make the background transparent?", a: "No. A JPG has no transparency to keep, so the background stays as it is. Removing a background needs an editing app." },
  "png-to-jpg": { q: "Will a screenshot of text still look sharp?", a: "At 90 percent quality or higher, yes. Below that, small text can pick up faint blur around the letters, so keep the quality high for screenshots." },
  "webp-to-jpg": { q: "Will I lose quality converting WebP to JPG?", a: "Very little at the default 85 percent. Both formats compress photos in a similar way, so the result looks the same at normal size." },
  "webp-to-png": { q: "Will the PNG keep the WebP transparency?", a: "Yes. Transparent and semi-transparent areas come through exactly, which is why PNG is the right choice for logos and icons." },
};

export const tools: ToolPage[] = [
  // -------------------------------------------------------------------------
  // PDF tools
  // -------------------------------------------------------------------------
  {
    slug: "jpg-to-pdf",
    engine: "imageToPdf",
    category: "pdf",
    primary: true,
    name: "JPG to PDF",
    blurb: "Turn photos and scans into one PDF",
    title: "JPG to PDF Converter – Free, No Watermark | PDF Quickly",
    description:
      "Convert JPG, PNG and other images to a single PDF in seconds. Put up to 20 photos in any order. Free, no sign-up and no watermark.",
    h1: "JPG to PDF",
    lead: "Put up to 20 photos, scans or screenshots into one PDF, in the order you choose.",
    pickLabel: "Choose images",
    stepsHeading: "How to convert JPG to PDF",
    steps: [
      "Choose your images, or drop them onto the box above. JPG, PNG, WebP, GIF, BMP and TIFF all work.",
      "Drag the files, or use the arrows, to put the pages in the right order.",
      "Select Convert to PDF and download your file.",
    ],
    aboutHeading: "One page per image, sized for A4",
    about: [
      "Each image becomes its own A4 page, centred and scaled to fit without cropping or stretching. Portrait and landscape photos keep their shape.",
      "Very large photos are scaled to 2,600 pixels on the long side, which still prints sharply on a full A4 page while keeping the PDF a sensible size to email. Transparent areas in PNG files turn white.",
      "This is the quickest way to turn phone photos of receipts, ID documents, homework or signed forms into a single file that any office or upload portal will accept.",
    ],
    faqs: [
      { q: "How many images can I convert at once?", a: "Up to 20 images per PDF, each up to 25 MB. For more pages, make two PDFs and join them with Merge PDF." },
      { q: "Will the image quality drop?", a: "Photos are saved at high JPEG quality and up to 2,600 pixels on the long side, which is sharper than an A4 page can print. Smaller images keep their original pixels and are stretched to fill the page, so a very small image can look soft." },
      { q: "Can I convert iPhone photos?", a: "Yes. When you pick photos on an iPhone, Safari hands them over as JPG, so they convert like any other image." },
      PRIVACY_FAQ,
    ],
    related: ["merge-pdf", "compress-pdf", "png-to-pdf", "pdf-to-jpg"],
  },
  {
    slug: "merge-pdf",
    engine: "mergePdf",
    category: "pdf",
    primary: true,
    name: "Merge PDF",
    blurb: "Combine several PDFs into one file",
    title: "Merge PDF Files Online for Free | PDF Quickly",
    description: "Combine up to 20 PDF files into one document, in the order you choose. Free, works in any browser, no sign-up and no watermark.",
    h1: "Merge PDF",
    lead: "Join up to 20 PDFs into a single file. Set the order, then download.",
    pickLabel: "Choose PDF files",
    stepsHeading: "How to merge PDF files",
    steps: [
      "Choose two or more PDFs, or drop them onto the box above.",
      "Put them in order. The first file in the list becomes the first pages of the result.",
      "Select Merge PDF and download the combined file.",
    ],
    aboutHeading: "Pages stay exactly as they were",
    about: [
      "Merging copies every page across as it is. Text stays selectable, links keep working and nothing is re-compressed, so there's no loss in quality.",
      "It's the usual way to send one tidy attachment instead of several: a job application with a CV and certificates, a loan file with statements and ID, or monthly invoices for an accountant.",
    ],
    faqs: [
      { q: "How many PDFs can I merge?", a: "Between 2 and 20 files at a time, each up to 50 MB. To combine more, merge in batches and then merge the results." },
      { q: "Can I change the order of the files?", a: "Yes. Drag files in the list, or use the up and down arrows, before you select Merge PDF." },
      { q: "Can I merge password-protected PDFs?", a: "Remove the password first with Unlock PDF, then merge the unlocked file." },
      { q: "Can I merge images with PDFs?", a: "Convert the images with JPG to PDF first, then merge that PDF with the others." },
      PRIVACY_FAQ,
    ],
    related: ["compress-pdf", "jpg-to-pdf", "unlock-pdf", "pdf-to-jpg"],
  },
  {
    slug: "compress-pdf",
    engine: "compressPdf",
    category: "pdf",
    primary: true,
    name: "Compress PDF",
    blurb: "Shrink a PDF to email or upload it",
    title: "Compress PDF – Reduce PDF File Size Free | PDF Quickly",
    description:
      "Make a PDF smaller for email, WhatsApp or upload limits. Choose smallest size, balanced or high quality. Free, no sign-up and no watermark.",
    h1: "Compress PDF",
    lead: "Reduce a PDF's file size so it fits email, WhatsApp and upload limits.",
    pickLabel: "Choose a PDF",
    stepsHeading: "How to compress a PDF",
    steps: [
      "Choose the PDF you want to make smaller.",
      "Pick a level: Smallest file, Balanced or High quality.",
      "Select Compress PDF. You'll see how much smaller it got before you download.",
    ],
    aboutHeading: "What makes a PDF large, and what this changes",
    about: [
      "Almost all of a large PDF's size comes from the pictures inside it: scans, photos and screenshots. Compression re-saves those images at a lower resolution and quality. Text, fonts and links are left alone, so they stay crisp.",
      "Smallest file limits images to 1,000 pixels on the long side, which reads fine on a phone. Balanced allows 1,600 pixels and suits most documents. High quality keeps 2,400 pixels, enough to print.",
      "A PDF that is mostly typed text with no images is already small, so it may barely shrink. That's expected.",
    ],
    faqs: [
      { q: "How much smaller will my PDF get?", a: "Scanned documents and PDFs full of photos often shrink by 60 to 90 percent. Text-only PDFs change very little because there's nothing heavy to compress." },
      { q: "Which level should I choose?", a: "Start with Balanced. If the file is still too big for your upload limit, try Smallest file. Use High quality when the document will be printed." },
      { q: "Will text become blurry?", a: "No. Only images are compressed. Real text in the PDF stays sharp at any zoom." },
      { q: "What's the maximum file size?", a: "You can compress PDFs up to 50 MB." },
      PRIVACY_FAQ,
    ],
    related: ["merge-pdf", "compress-image", "jpg-to-pdf"],
  },
  {
    slug: "pdf-to-jpg",
    engine: "pdfToJpg",
    category: "pdf",
    primary: true,
    name: "PDF to JPG",
    blurb: "Save every page as a JPG image",
    title: "PDF to JPG – Convert PDF Pages to Images | PDF Quickly",
    description: "Turn every page of a PDF into a sharp 300 DPI JPG image, downloaded together in one ZIP file. Free, no sign-up and no watermark.",
    h1: "PDF to JPG",
    lead: "Save every page of a PDF as a high-resolution JPG image.",
    pickLabel: "Choose a PDF",
    stepsHeading: "How to convert PDF to JPG",
    steps: [
      "Choose the PDF you want to convert.",
      "Select Convert to JPG.",
      "Download the ZIP file and open it to find one JPG per page.",
    ],
    aboutHeading: "Print-quality images of every page",
    about: [
      "Each page is rendered at 300 DPI, the standard for print. That's sharp enough to zoom into small text, post on social media or drop into a presentation.",
      "Use it when a website only accepts images, to share a single page in a chat app, or to put a PDF page into a document editor that can't open PDFs.",
    ],
    faqs: [
      { q: "Why do I get a ZIP file?", a: "A PDF usually has several pages, and each becomes its own image. The ZIP keeps them together and in order in a single download." },
      { q: "What resolution are the images?", a: "300 DPI. An A4 page comes out at about 2,480 × 3,508 pixels." },
      { q: "How do I get just one page as a JPG?", a: "Convert the PDF, open the ZIP and keep the page you need. The images are named page1.jpg, page2.jpg and so on, in page order." },
      PRIVACY_FAQ,
    ],
    related: ["jpg-to-pdf", "merge-pdf", "compress-image"],
  },
  {
    slug: "unlock-pdf",
    engine: "unlockPdf",
    category: "pdf",
    primary: true,
    name: "Unlock PDF",
    blurb: "Remove a password you already know",
    title: "Unlock PDF – Remove PDF Password Online | PDF Quickly",
    description:
      "Remove the password from a PDF you can already open, so it opens without asking every time. Free, no sign-up. You need the current password.",
    h1: "Unlock PDF",
    lead: "Remove the password from a PDF so it opens without asking every time.",
    pickLabel: "Choose a PDF",
    stepsHeading: "How to remove a PDF password",
    steps: [
      "Choose the password-protected PDF.",
      "Type the password you use to open it now.",
      "Select Unlock PDF and download the copy without the password.",
    ],
    aboutHeading: "For files you're allowed to open",
    about: [
      "Banks, payroll systems and government portals often lock statements and certificates with a password, usually a date of birth or part of an ID number. Typing it in every time gets tedious, and some upload forms reject protected files altogether.",
      "This tool makes an unlocked copy using the password you enter. It doesn't guess or crack passwords, so you need to know the current one. Only unlock files that belong to you or that you have permission to change.",
    ],
    faqs: [
      { q: "Can you unlock a PDF if I forgot the password?", a: "No. This tool needs the current password. It doesn't break or guess passwords." },
      { q: "What if the password is wrong?", a: "You'll see an error and nothing is changed. Check capital letters and the format the sender used, such as DDMMYYYY for dates." },
      { q: "Is the original file changed?", a: "No. You download a new copy without the password. Your original stays as it was on your device." },
      PRIVACY_FAQ,
    ],
    related: ["merge-pdf", "compress-pdf", "pdf-to-jpg"],
  },

  // -------------------------------------------------------------------------
  // Image tools
  // -------------------------------------------------------------------------
  {
    slug: "compress-image",
    engine: "compressImage",
    category: "image",
    primary: true,
    name: "Compress Image",
    blurb: "Shrink a photo to an exact size in KB",
    title: "Compress Image to KB – Reduce Photo Size | PDF Quickly",
    description:
      "Reduce a JPG, PNG or WebP image to the exact size you need, like 20 KB, 50 KB or 100 KB, for forms and uploads. Free, no sign-up.",
    h1: "Compress Image",
    lead: "Shrink a photo to the size in KB that a form or upload asks for.",
    pickLabel: "Choose an image",
    stepsHeading: "How to compress an image to a specific size",
    steps: [
      "Choose the photo you want to shrink.",
      "Pick a target size such as 50 KB, or type your own.",
      "Select Compress image, check the preview, then download.",
    ],
    aboutHeading: "Hits the size, keeps it looking right",
    about: [
      "Application forms, exam portals and job sites often insist on a photo or signature below a set size. This tool keeps the result under your target while keeping as much detail as it can.",
      "It first lowers JPEG quality a step at a time. If that isn't enough, it reduces the pixel dimensions and tries again, so even very small targets are reachable without the picture falling apart.",
      "The result is always a JPG, the format nearly every upload form accepts. Transparent backgrounds in PNG files become white.",
    ],
    faqs: [
      { q: "What's the smallest size I can set?", a: "5 KB. Passport-style photos usually look fine at 20 KB or more. Detailed photos need a larger target to stay sharp." },
      { q: "Will the image dimensions change?", a: "Only if quality alone can't reach your target. Then the image is scaled down just enough to fit." },
      { q: "Why is my PNG now a JPG?", a: "JPG compresses photos far better than PNG, which is what makes small targets possible. Most forms that ask for a size limit expect JPG anyway." },
      PRIVACY_FAQ,
    ],
    related: ["compress-image-to-20kb", "compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-200kb", "image-converter"],
  },
  {
    slug: "image-converter",
    engine: "convertImage",
    category: "image",
    primary: true,
    name: "Image Converter",
    blurb: "Change an image to JPG or PNG",
    title: "Image Converter – Convert to JPG or PNG Free | PDF Quickly",
    description: "Convert WebP, PNG, GIF, BMP and TIFF images to JPG or PNG online. Choose the quality for JPG. Free, no sign-up and no watermark.",
    h1: "Image Converter",
    lead: "Change an image to JPG or PNG, the formats every app and form accepts.",
    pickLabel: "Choose an image",
    stepsHeading: "How to convert an image",
    steps: [
      "Choose the image you want to convert. WebP, PNG, JPG, GIF, BMP and TIFF all work.",
      "Pick JPG or PNG. For JPG, set the quality.",
      "Select Convert image and download it.",
    ],
    aboutHeading: "JPG or PNG: which to pick",
    about: [
      "JPG is best for photos. It makes much smaller files and opens everywhere, but has no transparency, so transparent areas become white.",
      "PNG is lossless and keeps transparent backgrounds, so it suits logos, screenshots and graphics with sharp edges. Photos saved as PNG are much larger.",
      "WebP images saved from websites often won't open in older apps or upload forms. Converting them to JPG or PNG fixes that.",
    ],
    faqs: [
      { q: "Can I convert to WebP?", a: "Not yet. You can convert from WebP to JPG or PNG." },
      { q: "What JPG quality should I use?", a: "85% looks the same as the original to most people at a much smaller size. Go lower for the smallest file." },
      { q: "Does converting to PNG improve quality?", a: "No. PNG won't add detail that a JPG has already lost, but it won't lose any more either." },
      PRIVACY_FAQ,
    ],
    related: ["webp-to-jpg", "png-to-jpg", "jpg-to-png", "compress-image"],
  },

  // -------------------------------------------------------------------------
  // Keyword pages: the same engines with presets and their own copy
  // -------------------------------------------------------------------------
  {
    slug: "png-to-pdf",
    engine: "imageToPdf",
    category: "pdf",
    primary: false,
    name: "PNG to PDF",
    blurb: "Turn PNG screenshots and graphics into a PDF",
    title: "PNG to PDF Converter – Free, No Watermark | PDF Quickly",
    description: "Convert PNG screenshots, charts and scans to one PDF. Up to 20 images in the order you choose. Free, no sign-up and no watermark.",
    h1: "PNG to PDF",
    lead: "Combine PNG screenshots, charts or scans into a single PDF.",
    pickLabel: "Choose PNG images",
    stepsHeading: "How to convert PNG to PDF",
    steps: [
      "Choose your PNG files, or drop them onto the box above.",
      "Arrange them in the order the pages should appear.",
      "Select Convert to PDF and download it.",
    ],
    aboutHeading: "Screenshots into a document you can send",
    about: [
      "PNG is the format for screenshots, and a stack of screenshots is awkward to send. Turning them into one PDF gives the reader a single file to scroll through, in your order.",
      "Each PNG becomes an A4 page, scaled to fit. Transparent areas turn white so they print cleanly. You can mix in JPG or WebP images too.",
    ],
    faqs: [
      { q: "Will transparent PNGs look right?", a: "Yes. Transparent areas are filled with white, which is how they'd look printed on paper." },
      { q: "Can I mix PNG and JPG files?", a: "Yes. Any mix of PNG, JPG, WebP, GIF, BMP and TIFF works in one PDF." },
      { q: "Will text in my screenshots stay sharp?", a: "Yes. Screenshots are kept at full resolution up to 2,600 pixels on the long side, so text reads clearly when the PDF is zoomed or printed." },
      PRIVACY_FAQ,
    ],
    related: ["jpg-to-pdf", "webp-to-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "webp-to-pdf",
    engine: "imageToPdf",
    category: "pdf",
    primary: false,
    name: "WebP to PDF",
    blurb: "Save WebP images from the web as a PDF",
    title: "WebP to PDF Converter – Free Online | PDF Quickly",
    description: "Convert WebP images saved from websites into one PDF that opens anywhere. Up to 20 images, any order. Free, no sign-up, no watermark.",
    h1: "WebP to PDF",
    lead: "Turn WebP images saved from websites into a PDF that opens anywhere.",
    pickLabel: "Choose WebP images",
    stepsHeading: "How to convert WebP to PDF",
    steps: [
      "Choose your WebP images, or drop them onto the box above.",
      "Put them in order.",
      "Select Convert to PDF and download the file.",
    ],
    aboutHeading: "When a WebP won't open or upload",
    about: [
      "Many websites now serve images as WebP, so that's what you get when you save a picture. Plenty of forms, printers and older apps still don't accept it.",
      "A PDF opens on every phone and computer and is accepted almost everywhere. Each WebP becomes its own A4 page, scaled to fit.",
    ],
    faqs: [
      { q: "Do animated WebP images work?", a: "The first frame is used, as a still image." },
      { q: "Can I convert WebP to JPG instead?", a: "Yes, use WebP to JPG to get an image file rather than a PDF." },
      { q: "Do I need to convert my WebP files to JPG first?", a: "No. Add the WebP files directly; they're converted as part of making the PDF." },
      PRIVACY_FAQ,
    ],
    related: ["webp-to-jpg", "jpg-to-pdf", "png-to-pdf"],
  },
  // Each size has its own page because each is a different, common job with its own advice.
  // Keep them genuinely distinct: near-copies would count as doorway pages to Google.
  kbPage({
    kb: 20,
    blurb: "Shrink a signature or small photo under 20 KB",
    description: "Reduce a signature scan or small photo to under 20 KB for online application forms. Free, no sign-up, no watermark.",
    lead: "Get a scanned signature or a small photo under 20 KB for an online form.",
    aboutHeading: "Signatures and thumbnail photos",
    about: [
      "A 20 KB limit usually appears on application forms that ask for a scanned signature or a very small photo. A phone camera picture is typically 2 to 5 MB, about a hundred times too large.",
      "For a signature, sign in dark ink on plain white paper, take the photo in good light, then crop tightly around the signature in your phone's photo editor before compressing. White space costs bytes, and removing it leaves more of the 20 KB for the ink itself.",
      "The tool lowers JPEG quality step by step and, if that isn't enough, reduces the pixel dimensions until the file fits. The result is always a JPG, which these forms expect.",
    ],
    faqs: [
      { q: "My signature looks faint after compressing. What can I do?", a: "Re-take the photo with darker ink and brighter light, and crop closely around the signature. High contrast survives compression far better than pale pen on grey paper." },
      { q: "The form also gives exact pixel dimensions. Which do I do first?", a: "Resize it to those dimensions in your phone's photo editor first, then compress here. Compressing first and resizing afterwards can push the size back over the limit." },
      { q: "Can I go below 20 KB?", a: "Yes. Type any target from 5 KB in the size box." },
    ],
  }),
  kbPage({
    kb: 50,
    blurb: "Get a passport-style photo under 50 KB",
    description: "Reduce a passport-style photo to under 50 KB for exam, job and ID applications. Keeps faces clear. Free, no sign-up, no watermark.",
    lead: "Get a passport-style photo under 50 KB with your face still clear.",
    aboutHeading: "Application photos that stay recognisable",
    about: [
      "Many exam, job and ID applications ask for a recent photo between about 20 KB and 50 KB. At that size there's room for a clear face, as long as the picture isn't mostly background.",
      "Crop to your head and shoulders first, using your phone's photo editor. A plain, light background and even lighting also help, because flat areas compress very efficiently and leave more detail for your face.",
      "If quality alone can't reach 50 KB, the photo is scaled down just enough to fit, which forms that check the file size accept. The result is a JPG.",
    ],
    faqs: [
      { q: "The form says the photo must be between 20 KB and 50 KB. Will this work?", a: "Yes. The result lands just under 50 KB, which is inside that range. If your original is already under 50 KB, you'll see a message that it fits." },
      { q: "Should I resize before compressing?", a: "Only if the form gives exact pixel dimensions. Resize to those first, then compress to 50 KB here." },
      { q: "Why does my photo look soft?", a: "The background is probably taking up most of the picture. Crop closer to your face so the size budget goes where it matters." },
    ],
  }),
  kbPage({
    kb: 100,
    blurb: "Profile and ID photos under 100 KB",
    description: "Compress a photo to under 100 KB for profile pictures, ID cards and job portals, with no visible loss at screen size. Free, no sign-up.",
    lead: "Make a photo small enough for profile and ID uploads, without visible loss.",
    aboutHeading: "Full detail at screen size",
    about: [
      "100 KB is a common cap for profile pictures, staff ID cards, membership forms and job portals. It's large enough that a typical photo looks the same as the original when viewed on a screen.",
      "Most phone photos reach 100 KB by lowering JPEG quality alone, so the pixel dimensions usually stay as they are. Only very large or detailed photos are scaled down a little.",
      "It's also a sensible size for photos on a web page or in an email, where a 4 MB original would load slowly.",
    ],
    faqs: [
      { q: "Will people notice the photo has been compressed?", a: "Usually not at 100 KB. Differences tend to show only when you zoom in a long way." },
      { q: "Can I compress several photos to 100 KB at once?", a: "One at a time for now. Each takes a few seconds." },
      { q: "My ID card portal asks for a square photo. Can I do that here?", a: "Crop it to a square in your phone's photo editor first, then compress it here." },
    ],
  }),
  kbPage({
    kb: 200,
    blurb: "Photos of documents under 200 KB, still readable",
    description: "Compress a phone photo of a certificate, receipt or document to under 200 KB while keeping the text readable. Free, no sign-up.",
    lead: "Shrink a phone photo of a document to under 200 KB and keep the text readable.",
    aboutHeading: "Document photos where the text must stay sharp",
    about: [
      "When a portal asks you to upload a certificate, mark sheet, receipt or ID card as an image, 200 KB is a common limit. Unlike a face, small print needs enough pixels to stay readable.",
      "At 200 KB the tool can usually keep the full resolution and only lower the JPEG quality, so letters keep their edges. Photograph the document flat, square-on and in good light for the best result.",
      "If the portal accepts PDF, JPG to PDF followed by Compress PDF is often the better route for multi-page documents.",
    ],
    faqs: [
      { q: "How do I check the text is still readable?", a: "Open the preview after compressing and zoom in on the smallest print. If it's blurry, try a slightly larger target or photograph the document closer." },
      { q: "I have several pages. What should I do?", a: "Turn them into one PDF with JPG to PDF, then use Compress PDF if the PDF is over the limit." },
      { q: "Can I remove the background around the document?", a: "Yes. Crop to the edges of the paper in your phone's photo editor before compressing. It also makes the file smaller." },
    ],
  }),
  ...(
    [
      ["jpg-to-png", "JPG", "PNG", "png", "Change a JPG photo into a PNG file", [
        "PNG is lossless, so the image won't lose any more detail if you edit and save it again. That's handy before adding text, arrows or annotations.",
        "Converting a JPG to PNG doesn't restore detail the JPG already lost, and the PNG will usually be larger. Pick PNG when an app or upload form specifically asks for it.",
      
        "A common reason is a design or school tool that only accepts PNG uploads, or a template that expects PNG layers. Screenshots taken as JPG also keep their remaining sharpness once they're PNG.",
      ]],
      ["png-to-jpg", "PNG", "JPG", "jpg", "Make big PNG files small enough to share", [
        "Photos saved as PNG are often several times larger than they need to be. Converting to JPG typically cuts the size dramatically with no difference you'd notice.",
        "JPG has no transparency, so transparent areas are filled with white. For logos that need a clear background, keep PNG.",
      
        "This is the usual fix when an upload form rejects a screenshot for being too large, or when a gallery app shows a PNG photo as several megabytes. Set quality around 80 to 90 percent for the best balance.",
      ]],
      ["webp-to-jpg", "WebP", "JPG", "jpg", "Turn WebP images from the web into JPG", [
        "Many sites serve images as WebP, so that's what you get when you save one. Plenty of apps, printers and upload forms still won't take WebP.",
        "JPG opens everywhere. Set the quality to balance size and sharpness; 85% looks the same as the original to most people.",
      
        "Typical cases are product photos saved from shopping sites, pictures saved from social media, and images that a print shop, government form or older version of Windows won't open.",
      ]],
      ["webp-to-png", "WebP", "PNG", "png", "Turn WebP images into lossless PNG", [
        "Saved a WebP logo or graphic from a website? Converting to PNG keeps transparent backgrounds and sharp edges, and opens in every design tool.",
        "For photos, WebP to JPG gives a much smaller file.",
      
        "PNG is also the safer format for screenshots of text and diagrams saved as WebP, because JPG would add soft halos around the letters.",
      ]],
    ] as const
  ).map(
    ([slug, from, to, format, blurb, about]): ToolPage => ({
      slug,
      engine: "convertImage",
      category: "image",
      primary: false,
      name: `${from} to ${to}`,
      blurb,
      title: `${from} to ${to} Converter – Free Online | PDF Quickly`,
      description: `Convert ${from} images to ${to} online in seconds.${format === "jpg" ? " Choose the quality." : " Lossless, keeps transparency."} Free, no sign-up and no watermark.`,
      h1: `${from} to ${to}`,
      lead: `Convert a ${from} image to ${to} in a few seconds.`,
      pickLabel: `Choose a ${from} image`,
      presets: { format },
      stepsHeading: `How to convert ${from} to ${to}`,
      steps: [
        `Choose the ${from} image you want to convert.`,
        format === "jpg" ? `${to} is already selected. Adjust the quality if you want a smaller file.` : `${to} is already selected.`,
        "Select Convert image and download it.",
      ],
      aboutHeading: `Why convert ${from} to ${to}`,
      about: [...about],
      faqs: [
        CONVERTER_FAQ[slug],
        CONVERTER_FAQ_2[slug],
        format === "jpg"
          ? { q: "What happens to transparent areas?", a: "JPG can't store transparency, so they're filled with white." }
          : { q: "Will transparency be kept?", a: "Yes. PNG keeps transparent backgrounds exactly." },
        PRIVACY_FAQ,
      ],
      related: ["image-converter", "compress-image", "jpg-to-pdf"],
    }),
  ),
];

export const toolBySlug = new Map(tools.map((t) => [t.slug, t]));
export const primaryTools = tools.filter((t) => t.primary);
export const keywordPagesFor = (engine: EngineId) => tools.filter((t) => !t.primary && t.engine === engine);
