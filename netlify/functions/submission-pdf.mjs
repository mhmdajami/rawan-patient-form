const PATIENT_FIELDS = new Set(["full_name", "form_date", "birth_date_age", "phone", "email"]);

function pdfText(value) {
  return String(value)
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00a0/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?");
}

function displayValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  if (value === true) return "Yes";
  if (value === false) return "No";
  const text = String(value ?? "").trim();
  return text || "Not provided";
}

function wrap(text, font, size, maxWidth) {
  const words = pdfText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (font.widthOfTextAtSize(word, size) > maxWidth) {
      if (line) lines.push(line);
      line = "";
      let fragment = "";
      for (const char of word) {
        if (font.widthOfTextAtSize(fragment + char, size) > maxWidth && fragment) {
          lines.push(fragment);
          fragment = char;
        } else fragment += char;
      }
      line = fragment;
    } else {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
      else { lines.push(line); line = word; }
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export async function createSubmissionPdf({ PDFDocument, StandardFonts, rgb, clinicName, labels, submissionId, submittedAt, answers }) {
  const pdf = await PDFDocument.create();
  pdf.setTitle("New Patient Form Submission");
  pdf.setAuthor(clinicName);
  pdf.setSubject(`Submission reference ${submissionId}`);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const purple = rgb(0.376, 0.259, 0.498);
  const ink = rgb(0.16, 0.14, 0.20);
  const muted = rgb(0.42, 0.39, 0.47);
  const rule = rgb(0.88, 0.86, 0.90);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const left = 48;
  const right = pageWidth - 48;
  const labelWidth = 166;
  const valueX = left + labelWidth + 14;
  const valueWidth = right - valueX;
  const footerTop = 44;
  const lineHeight = 13;
  let page;
  let y;

  function addPage() {
    page = pdf.addPage([pageWidth, pageHeight]);
    page.drawText(pdfText(clinicName), { x: left, y: pageHeight - 48, size: 10, font: bold, color: muted });
    page.drawText("New Patient Form Submission", { x: left, y: pageHeight - 76, size: 18, font: bold, color: purple });
    const submittedDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(submittedAt));
    page.drawText(`Submission date/time: ${pdfText(submittedDate)} UTC`, { x: left, y: pageHeight - 98, size: 9, font: regular, color: muted });
    page.drawLine({ start: { x: left, y: pageHeight - 111 }, end: { x: right, y: pageHeight - 111 }, thickness: 1, color: rule });
    y = pageHeight - 132;
  }

  function ensureSpace(height) {
    if (!page || y - height < footerTop + 18) addPage();
  }

  function section(title) {
    ensureSpace(36);
    y -= 6;
    page.drawText(pdfText(title), { x: left, y, size: 12, font: bold, color: purple });
    y -= 12;
    page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.7, color: rule });
    y -= 8;
  }

  function row(key, value) {
    const label = labels[key] || key;
    const answer = displayValue(value);
    const labelLines = wrap(label, bold, 9, labelWidth);
    const valueLines = wrap(answer, regular, 9.5, valueWidth);
    const lineCount = Math.max(labelLines.length, valueLines.length);
    let offset = 0;
    while (offset < lineCount) {
      ensureSpace(lineHeight + 8);
      const availableLines = Math.max(1, Math.floor((y - footerTop - 10) / lineHeight));
      const chunk = Math.min(lineCount - offset, availableLines);
      for (let i = 0; i < chunk; i++) {
        const currentY = y - i * lineHeight;
        if (offset + i < labelLines.length) page.drawText(labelLines[offset + i], { x: left, y: currentY, size: 9, font: bold, color: ink });
        if (offset + i < valueLines.length) page.drawText(valueLines[offset + i], { x: valueX, y: currentY, size: 9.5, font: regular, color: ink });
      }
      y -= chunk * lineHeight;
      page.drawLine({ start: { x: left, y: y + 4 }, end: { x: right, y: y + 4 }, thickness: 0.35, color: rule });
      y -= 8;
      offset += chunk;
    }
  }

  addPage();
  section("Patient Information");
  for (const [key, value] of Object.entries(answers).filter(([key]) => PATIENT_FIELDS.has(key))) row(key, value);
  section("Form Responses");
  for (const [key, value] of Object.entries(answers).filter(([key]) => !PATIENT_FIELDS.has(key))) row(key, value);

  const pages = pdf.getPages();
  pages.forEach((current, index) => {
    current.drawText(`Submission reference: ${pdfText(submissionId)}`, { x: left, y: 27, size: 8, font: regular, color: muted });
    current.drawText(`Confidential  |  Page ${index + 1} of ${pages.length}`, { x: right - 160, y: 27, size: 8, font: regular, color: muted });
  });
  return pdf.save();
}
