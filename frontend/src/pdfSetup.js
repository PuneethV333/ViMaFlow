import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";  // 👈 Vite-friendly import

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default pdfjsLib;
