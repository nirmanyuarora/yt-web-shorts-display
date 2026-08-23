/**
 * YouTube Shorts Title Display - Content Script
 * Extracts aria-label attribute content from h3.shortsLockupViewModelHostMetadataTitle
 * elements and renders it as visible text inside the h3 element on youtube.com.
 */

(function () {
  'use strict';

  /**
   * Extract title text from aria-label attribute.
   * Removes trailing ", X views - play Short" or "- play Short" suffix if present.
   */
  function extractTitleText(ariaLabel) {
    if (!ariaLabel) return '';
    let text = ariaLabel.trim();

    // Remove trailing view counts & "- play Short" suffix
    text = text.replace(/,?\s*[\d\.\,\sKMBkmb]+(?:\s+thousand|\s+million|\s+billion|\s+hundred)?\s+views?\s*-\s*play\s+Short$/i, '');
    text = text.replace(/\s*-\s*play\s+Short$/i, '');

    return text.trim();
  }

  /**
   * Process a single h3 element.
   */
  function processH3Element(h3) {
    // Get aria-label attribute from h3 tag or parent anchor element if missing on h3
    let ariaLabel = h3.getAttribute('aria-label');
    if (!ariaLabel) {
      const parentLink = h3.closest('a');
      if (parentLink) {
        ariaLabel = parentLink.getAttribute('aria-label');
      }
    }

    if (!ariaLabel) return;

    const extractedTitle = extractTitleText(ariaLabel);
    if (!extractedTitle) return;

    const isProcessed = h3.getAttribute('data-yt-shorts-title-processed') === 'true';
    const currentText = h3.textContent ? h3.textContent.trim() : '';

    // Process if not processed yet or if content was cleared by YouTube internal re-render
    if (!isProcessed || currentText === '') {
      h3.textContent = extractedTitle;
      h3.setAttribute('title', extractedTitle);
      h3.setAttribute('data-yt-shorts-title-processed', 'true');
    }
  }

  /**
   * Scan document for target h3 elements inside Shorts lockups.
   */
  function processAllShortsTitles() {
    const selector = 'h3.shortsLockupViewModelHostMetadataTitle, ytm-shorts-lockup-view-model h3, ytm-shorts-lockup-view-model-v2 h3';
    const targetElements = document.querySelectorAll(selector);

    targetElements.forEach((h3) => processH3Element(h3));
  }

  // Throttled processing for high-frequency DOM mutations
  let animationFrameId = null;
  function scheduleProcessing() {
    if (animationFrameId !== null) return;
    animationFrameId = requestAnimationFrame(() => {
      animationFrameId = null;
      processAllShortsTitles();
    });
  }

  // MutationObserver to detect newly loaded HTML elements dynamically
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes && mutations[i].addedNodes.length > 0) {
        shouldProcess = true;
        break;
      }
    }

    if (shouldProcess) {
      scheduleProcessing();
    }
  });

  // Start observing DOM changes once ready
  function startObserver() {
    processAllShortsTitles();

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }
  }

  // Initial page load trigger
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  // Handle SPA navigation events on YouTube
  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(processAllShortsTitles, 300);
  });
  window.addEventListener('spfdone', () => {
    setTimeout(processAllShortsTitles, 300);
  });
})();
