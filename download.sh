#!/bin/bash

# Download Bootstrap CSS
curl -o bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css

# Download Bootstrap Bundle JS (includes Popper.js)
curl -o bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

# Download PDF.js
curl -o pdf.min.js https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/build/pdf.min.js

# Download PDF.js Worker
curl -o pdf.worker.min.js https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/build/pdf.worker.min.js

# Download the generative AI script from esm.run
curl -o google-generative-ai.js https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm

# Download the docx script from jsdelivr
curl -o docx.min.js https://cdn.jsdelivr.net/npm/docx@8.2.2/build/index.min.js


chmod +x download.sh
