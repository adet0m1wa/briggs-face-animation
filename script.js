// ============================================================
// 1. Paste the public URL to your .riv file here.
//    Example (GitHub raw): https://raw.githubusercontent.com/USER/REPO/main/briggs_face_animations.riv
// ============================================================
const RIV_FILE_URL = "REPLACE_WITH_PUBLIC_URL_TO_BRIGGS_FACE_ANIMATIONS_RIV";

const ARTBOARD = "animation";
const STATE_MACHINE = "State Machine 1";

const canvas = document.getElementById("rive-canvas");
const statusEl = document.getElementById("status");
const buttons = document.querySelectorAll(".pill[data-trigger]");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
  statusEl.classList.remove("hidden");
}

function hideStatus() {
  statusEl.classList.add("hidden");
}

function setButtonsEnabled(enabled) {
  buttons.forEach((b) => (b.disabled = !enabled));
}

setButtonsEnabled(false);

const riveInstance = new rive.Rive({
  src: RIV_FILE_URL,
  canvas,
  artboard: ARTBOARD,
  stateMachines: [STATE_MACHINE],
  autoplay: true,
  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

    const inputs = riveInstance.stateMachineInputs(STATE_MACHINE);
    console.log("State machine inputs:", inputs.map((i) => i.name));

    const triggers = {};
    inputs.forEach((input) => {
      triggers[input.name] = input;
    });

    buttons.forEach((btn) => {
      const name = btn.dataset.trigger;
      const trigger = triggers[name];
      if (!trigger) {
        console.warn(`Trigger "${name}" not found on state machine`);
        btn.disabled = true;
        return;
      }
      btn.addEventListener("click", () => trigger.fire());
    });

    setButtonsEnabled(true);
    hideStatus();
  },
  onLoadError: (err) => {
    console.error("Rive load error:", err);
    setStatus(
      "Couldn't load the animation. Check the .riv URL is public and CORS-accessible.",
      true
    );
  },
});

// Keep the drawing surface sharp on resize / DPR changes.
window.addEventListener("resize", () => {
  if (riveInstance) riveInstance.resizeDrawingSurfaceToCanvas();
});
