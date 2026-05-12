const RIV_FILE_URL =
  "https://raw.githubusercontent.com/adet0m1wa/briggs-face-animation/main/briggs_face_animations.riv";

const ARTBOARD = "animation";
const STATE_MACHINE = "State Machine 1";

const TRIGGER_NAMES = [
  "toDefault",
  "toAgree",
  "toThinking",
  "toConfused",
  "toSad",
  "toListening",
];

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
  autoBind: true,
  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();

    const vmi = riveInstance.viewModelInstance;
    if (!vmi) {
      console.warn("View model instance not bound — check default VM in Rive.");
      return;
    }

    const triggers = {};
    TRIGGER_NAMES.forEach((name) => {
      const prop = vmi.trigger(name);
      if (prop) triggers[name] = prop;
    });

    console.log("View-model triggers bound:", Object.keys(triggers));

    buttons.forEach((btn) => {
      const name = btn.dataset.trigger;
      const prop = triggers[name];
      if (!prop) {
        btn.disabled = true;
        return;
      }
      btn.addEventListener("click", () => prop.trigger());
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

window.addEventListener("resize", () => {
  if (riveInstance) riveInstance.resizeDrawingSurfaceToCanvas();
});
