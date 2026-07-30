(function () {
  "use strict";

  const loader = document.getElementById("ppmPageLoader");
  const message = document.getElementById("ppmPageLoaderMessage");

  if (!loader) {
    return;
  }

  let hideTimer = 0;

  function show(label) {
    window.clearTimeout(hideTimer);
    loader.hidden = false;
    loader.classList.remove("is-hidden");
    loader.setAttribute("aria-hidden", "false");
    document.documentElement.setAttribute("aria-busy", "true");

    if (message && label) {
      message.textContent = label;
    }
  }

  function hide() {
    window.clearTimeout(hideTimer);
    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");
    document.documentElement.removeAttribute("aria-busy");
  }

  function hideSoon(delay = 0) {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, delay);
  }

  window.PPMPageLoader = { show, hide, hideSoon };

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) {
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return;
    }

    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    if (destination.origin !== window.location.origin) {
      return;
    }

    const currentWithoutHash = `${window.location.pathname}${window.location.search}`;
    const destinationWithoutHash = `${destination.pathname}${destination.search}`;
    if (currentWithoutHash === destinationWithoutHash) {
      return;
    }

    show("Loading page…");
  }, true);

  window.addEventListener("pageshow", function () {
    hideSoon();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hideSoon();
    }, { once: true });
  } else {
    hideSoon();
  }
})();
