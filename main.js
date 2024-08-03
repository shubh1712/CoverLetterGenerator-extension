import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import * as docx from "https://cdn.jsdelivr.net/npm/docx@8.2.2/build/index.min.js";
import { API_KEY } from "./config.js";

const genAI = new GoogleGenerativeAI(API_KEY);

document.getElementById("upload").addEventListener("change", () => {
  const fileInput = document.getElementById("upload");
  const fileNameDisplay = document.getElementById("file-name");
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = `Selected file: ${fileInput.files[0].name}`;
  } else {
    fileNameDisplay.textContent = '';
  }
});

document.getElementById("generate").addEventListener("click", async () => {
  const loader = document.getElementById("loader");
  loader.style.display = 'inline-block';

  try {
    const jd = document.getElementById("jd").value;
    const resume = document.getElementById("resume").value;
    const Yof = document.getElementById("experience").value;
    const expertise = document.getElementById("expertise").value;

    const resumeFile = document.getElementById("upload").files[0];
    let resumeContent = resume;

    if (resumeFile) {
      const fileReader = new FileReader();
      fileReader.onload = async function() {
        const pdfText = await pdfToText(fileReader.result);
        resumeContent = pdfText;
        await generateCoverLetter(jd, Yof, expertise, resumeContent);
        loader.style.display = 'none';
      };
      fileReader.readAsArrayBuffer(resumeFile);
    } else {
      await generateCoverLetter(jd, Yof, expertise, resumeContent);
      loader.style.display = 'none';
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    loader.style.display = 'none';
  }
});

async function pdfToText(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ');
  }
  return text;
}

async function generateCoverLetter(jd, Yof, expertise, resumeContent) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Write a cover letter explaining why you are the best fit for the given job role based on the given job description: ${jd},
  years of experience: ${Yof},
  expertise: ${expertise}, and
  resume: ${resumeContent}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  // Clean the text by removing asterisks and similar formatting characters
  const cleanedText = text.replace(/^##\s.*$/gm, '').replace(/[*•-]/g, '').trim();

  document.getElementById("output").value = cleanedText;
}

document.getElementById("download").addEventListener("click", () => {
  const content = document.getElementById("output").value;

  // Split content into paragraphs
  const paragraphs = content.split('\n').filter(paragraph => paragraph.trim() !== '').map(paragraph => new docx.Paragraph(paragraph));

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  docx.Packer.toBlob(doc).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
