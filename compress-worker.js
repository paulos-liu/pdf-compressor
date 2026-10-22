let settled = false;
let logs = [];

function fail(message) {
  if (settled) return;
  settled = true;
  self.postMessage({
    ok: false,
    error: message,
    detail: logs.join("\n").slice(-1500),
  });
}

self.onmessage = async (event) => {
  const { bytes, args, wasm } = event.data;
  settled = false;
  logs = [];
  try {
    if (!wasm) {
      fail("The compression library could not be loaded. Reload the page and try again.");
      return;
    }
    self.Module = {
      wasmBinary: wasm,
      noExitRuntime: 1,
      arguments: args,
      print(text) { logs.push(String(text)); },
      printErr(text) { logs.push(String(text)); },
      onAbort(reason) {
        logs.push(String(reason));
        fail("Compression failed. Try another PDF.");
      },
      preRun: [() => {
        self.Module.FS.writeFile("input.pdf", new Uint8Array(bytes));
      }],
      postRun: [() => {
        if (settled) return;
        try {
          const out = self.Module.FS.readFile("output.pdf");
          if (out.length < 5 || String.fromCharCode(out[0], out[1], out[2], out[3]) !== "%PDF") {
            fail("Compression failed. Try another PDF.");
            return;
          }
          settled = true;
          const copy = out.slice();
          self.postMessage({ ok: true, pdf: copy.buffer }, [copy.buffer]);
        } catch (err) {
          fail("Compression failed. Try another PDF.");
        }
      }],
    };
    await import("./gs-worker.js");
  } catch (err) {
    logs.push(String(err && err.message ? err.message : err));
    fail("Compression failed. Try another PDF.");
  }
};
