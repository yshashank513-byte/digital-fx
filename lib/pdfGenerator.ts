/**
 * Pure-JS zero-dependency single-page PDF generator embedding JPEG image bytes.
 * Produces crisp, valid PDF-1.4 documents ready for printing.
 */
export function createPdfBlobFromJpeg(jpegBytes: Uint8Array, width: number, height: number): Blob {
  const enc = new TextEncoder();
  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const imgHeader = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  const imgFooter = "\nendstream\nendobj\n";
  const contentStream = `q ${width} 0 0 ${height} 0 0 cm /Im1 Do Q`;
  const obj5 = `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`;

  const header = "%PDF-1.4\n";
  const offsets: number[] = [];
  offsets[1] = header.length;
  offsets[2] = offsets[1] + obj1.length;
  offsets[3] = offsets[2] + obj2.length;
  offsets[4] = offsets[3] + obj3.length;
  const part1Bytes = enc.encode(header + obj1 + obj2 + obj3 + imgHeader);
  const part2Bytes = jpegBytes;
  const part3Text = imgFooter + obj5;
  const part3Bytes = enc.encode(part3Text);
  offsets[5] = part1Bytes.length + part2Bytes.length + enc.encode(imgFooter).length;

  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  const startxref = part1Bytes.length + part2Bytes.length + part3Bytes.length;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  const trailerBytes = enc.encode(xref + trailer);

  return new Blob([part1Bytes, part2Bytes.buffer as ArrayBuffer, part3Bytes, trailerBytes], { type: "application/pdf" });
}
