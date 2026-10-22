# Compress a PDF

Compress a PDF in the browser. The file stays on your computer.

Live page: https://paulos-liu.github.io/pdf-compressor/

The compression runs in [pdf-squeeze](https://github.com/paulos-liu/pdf-squeeze), which packages GhostPDL (Ghostscript's pdfwrite) as WebAssembly in `lib/pdf-squeeze/`. This project is AGPL-3.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

Opening `index.html` directly will not work. Serve this folder over HTTP.
