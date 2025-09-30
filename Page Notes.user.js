// ==UserScript==
// @name         Page Notes
// @namespace    https://github.com/j01t3d/page-notes
// @version      0.1
// @description  Extracts keywords (nouns/verbs approx) and makes a dark-theme notes-style summary of a page
// @author       j01t3d
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Stopwords list
    const stopwords = new Set([
        "the","and","a","an","of","in","to","for","on","with","at","by","from",
        "up","about","into","over","after","is","are","was","were","be","been",
        "this","that","these","those","as","it","its","or","but","so","if","then",
        "out","not","no","can","will","just","than","like","also", "would", "said"
    ]);

    // Extract words
    let text = document.body.innerText.toLowerCase();
    let words = text.match(/\b[a-z]{3,}\b/g) || []; // words 3+ letters

    // Count frequencies
    let freq = {};
    for (let w of words) {
        if (!stopwords.has(w)) {
            freq[w] = (freq[w] || 0) + 1;
        }
    }

    // Sort and take top results
    let sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    let top = sorted.slice(0, 15);

    // Format as notes
    let notes = "Frequent Terms:\n";
    top.forEach(([word, count]) => {
        notes += `- ${word} (${count})\n`;
    });

    // Create floating panel
    let panel = document.createElement("div");
    panel.id = "notesPanel";
    panel.innerHTML = `
        <h3 style="margin:0;font-size:14px;color:#f0f0f0;">Page Notes</h3>
        <pre style="white-space:pre-wrap;font-size:12px;color:#f0f0f0;">${notes}</pre>
        <button id="copyNotes">Copy Notes</button>
    `;
    document.body.appendChild(panel);

    // Styling for dark theme
    GM_addStyle(`
        #notesPanel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 250px;
            max-height: 300px;
            overflow:auto;
            background: #1e1e1e;
            border: 1px solid #444;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 99999;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            color: #f0f0f0;
        }
        #copyNotes {
            margin-top: 5px;
            font-size: 12px;
            background: #333;
            color: #f0f0f0;
            border: 1px solid #555;
            cursor: pointer;
        }
        #copyNotes:hover {
            background: #444;
        }
    `);

    // Copy button handler
    document.getElementById("copyNotes").addEventListener("click", () => {
        navigator.clipboard.writeText(notes).then(() => {
            alert("Notes copied to clipboard!");
        });
    });
})();
