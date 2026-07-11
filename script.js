const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const toast = document.querySelector(".toast");
const contactForm = document.querySelector("#contactForm");
const copyPhoneButton = document.querySelector(".copy-phone");
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress span");

document.documentElement.classList.add("js");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(
    () => toast.classList.remove("show"),
    3200,
  );
}

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

mainNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));

copyPhoneButton.addEventListener("click", async () => {
  const phoneNumber = copyPhoneButton.dataset.phone;

  try {
    await navigator.clipboard.writeText(phoneNumber);
    showToast(`Phone number copied: ${phoneNumber}`);
  } catch {
    showToast(`Call us at: ${phoneNumber}`);
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const submitButton = contactForm.querySelector(".submit-button");
  const originalLabel = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Form submission failed");

    showToast(`Thanks, ${name}! We will contact you soon.`);
    contactForm.reset();
  } catch {
    showToast("Message could not be sent. Please call us directly.");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
  }
});

function updatePageChrome() {
  const scrollTop = window.scrollY;
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

  header.classList.toggle("is-scrolled", scrollTop > 12);
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updatePageChrome, { passive: true });
updatePageChrome();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...mainNav.querySelectorAll("a:not(.nav-contact)")];
const navObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries.find((entry) => entry.isIntersecting);
    if (!visibleSection) return;

    navigationLinks.forEach((link) =>
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visibleSection.target.id}`,
      ),
    );
  },
  { rootMargin: "-32% 0px -58% 0px", threshold: 0 },
);

sections.forEach((section) => navObserver.observe(section));

document.querySelector("#currentYear").textContent = new Date().getFullYear();
