/***********************
 GLOBAL HELPERS
***********************/
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function copyText(id) {
  const el = document.getElementById(id);
  el.select();
  document.execCommand("copy");
  alert("Copied ✔");
}

/***********************
 1️⃣ BULK HYPERLINK (EXCEL / CSV)
***********************/
function generateFromExcel() {
  const fileInput = document.getElementById("excelFile");
  const type = document.getElementById("linkType").value;
  const output = document.getElementById("allLinks");

  if (!fileInput.files.length) {
    alert("Please upload Excel or CSV file");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let html = "";
    rows.forEach((row, i) => {
      if (i === 0) return; // skip header
      const url = row[0];
      const anchor = row[1] || row[0];
      if (url) {
        html += `<a href="${url}" ${
          type === "nofollow" ? 'rel="nofollow"' : ""
        }>${escapeHtml(anchor)}</a>\n`;
      }
    });

    output.value = html;
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
}

/***********************
 2️⃣ XML SITEMAP
***********************/
function generateSitemap() {
  const urls = document.getElementById("sitemapUrls").value.trim().split("\n");
  const output = document.getElementById("sitemapOutput");

  let xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach(url => {
    if (url.trim()) {
      xml += `  <url>\n    <loc>${url.trim()}</loc>\n  </url>\n`;
    }
  });

  xml += `</urlset>`;
  output.value = xml;
}

/***********************
 KEYWORD DENSITY (ADVANCED)
***********************/
function checkKeywordDensity() {

  const text = document.getElementById("articleText").value.toLowerCase();
  const output = document.getElementById("densityOutput");

  if (!text.trim()) {
    alert("Please paste article text");
    return;
  }

  const words = text.match(/\b\w+\b/g);
  const totalWords = words.length;

  let result = `Total Words: ${totalWords}\n\n`;

  const keywords = [
    document.getElementById("kw1").value,
    document.getElementById("kw2").value,
    document.getElementById("kw3").value,
    document.getElementById("kw4").value,
    document.getElementById("kw5").value
  ].filter(k => k.trim() !== "");

  if (keywords.length === 0) {
    alert("Please enter at least one keyword");
    return;
  }

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "g");
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    const density = ((count / totalWords) * 100).toFixed(2);

    result += `${keyword} → Count: ${count}, Density: ${density}%\n`;
  });

  output.value = result;
}


/***********************
 META TAG GENERATOR
***********************/
function generateMetaTags() {

  const title = document.getElementById("metaTitle").value.trim();
  const description = document.getElementById("metaDescription").value.trim();
  const keywords = document.getElementById("metaKeywords").value.trim();

  if (!title || !description) {
    alert("Title and Description are required");
    return;
  }

  let metaHTML = `<title>${title}</title>\n`;
  metaHTML += `<meta name="description" content="${description}">\n`;

  if (keywords) {
    metaHTML += `<meta name="keywords" content="${keywords}">\n`;
  }

  document.getElementById("metaOutput").value = metaHTML;
}


/***********************
 ROBOTS.TXT GENERATOR
***********************/
function generateRobots() {

  const allow = document.getElementById("robotsAllow").value;
  const paths = document.getElementById("robotsPaths").value.trim();
  const sitemap = document.getElementById("robotsSitemap").value.trim();

  let robots = "User-agent: *\n";

  if (allow === "disallow") {
    robots += "Disallow: /\n";
  } else {
    if (paths) {
      paths.split("\n").forEach(p => {
        robots += `Disallow: ${p.trim()}\n`;
      });
    } else {
      robots += "Disallow:\n";
    }
  }

  if (sitemap) {
    robots += `\nSitemap: ${sitemap}`;
  }

  document.getElementById("robotsOutput").value = robots;
}


/***********************
 SEO SLUG GENERATOR
***********************/
function generateSlug() {

  const input = document.getElementById("slugInput").value.trim();
  const output = document.getElementById("slugOutput");

  if (!input) {
    alert("Please enter text to generate slug");
    return;
  }

  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove symbols
    .replace(/\s+/g, "-")           // spaces to hyphen
    .replace(/-+/g, "-")            // remove double hyphen
    .replace(/^-|-$/g, "");         // trim hyphen

  output.value = slug;
}


/***********************
 SCHEMA GENERATOR
***********************/
function loadSchemaFields() {
  const type = document.getElementById("schemaType").value;
  const box = document.getElementById("schemaFields");

  if (!type) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = `
    <label>Name / Title</label>
    <input type="text" id="schemaName" placeholder="Enter name or title">

    <label>Description</label>
    <textarea id="schemaDesc" rows="3"
      placeholder="Enter description"></textarea>

    <label>URL</label>
    <input type="text" id="schemaUrl" placeholder="https://example.com">

    <label>Image URL (optional)</label>
    <input type="text" id="schemaImage" placeholder="https://example.com/image.jpg">
  `;
}

function generateSchema() {

  const type = document.getElementById("schemaType").value;
  if (!type) {
    alert("Please select schema type");
    return;
  }

  const name = document.getElementById("schemaName").value;
  const desc = document.getElementById("schemaDesc").value;
  const url = document.getElementById("schemaUrl").value;
  const image = document.getElementById("schemaImage").value;

  let schema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
    "description": desc,
    "url": url
  };

  if (image) {
    schema.image = image;
  }

  // Special schemas
  if (type === "Website") {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${url}/?s={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  }

  if (type === "Breadcrumb") {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": url
        }
      ]
    };
  }

  document.getElementById("schemaOutput").value =
    `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}


/***********************
 FREE BACKLINK CHECKER
***********************/
async function checkBacklinks() {

  const url = document.getElementById("backlinkUrl").value.trim();
  const output = document.getElementById("backlinkOutput");

  if (!url) {
    alert("Please enter a valid URL");
    return;
  }

  output.value = "Checking backlinks...\n\n";

  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const links = doc.querySelectorAll("a[href]");
    let result = "";
    let count = 0;

    links.forEach(link => {
      const href = link.getAttribute("href");

      if (href && href.startsWith("http")) {
        const rel = link.getAttribute("rel");
        const followType = rel && rel.includes("nofollow")
          ? "NoFollow"
          : "DoFollow";

        result += `${href}  →  ${followType}\n`;
        count++;
      }
    });

    output.value =
      `Total External Backlinks Found: ${count}\n\n` +
      (result || "No backlinks found.");

  } catch (error) {
    output.value =
      "❌ Unable to fetch backlinks.\n" +
      "Reason: Website blocks access (CORS policy).";
  }
}

/***********************
 BROKEN LINK CHECKER (FREE)
***********************/
async function checkBrokenLinks() {

  const pageUrl = document.getElementById("brokenUrl").value.trim();
  const output = document.getElementById("brokenOutput");

  if (!pageUrl) {
    alert("Please enter a valid URL");
    return;
  }

  output.value = "Scanning page for broken links...\n\n";

  try {
    const pageResponse = await fetch(pageUrl);
    const pageHTML = await pageResponse.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(pageHTML, "text/html");

    const links = doc.querySelectorAll("a[href]");
    let brokenCount = 0;
    let report = "";

    for (let link of links) {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("http")) continue;

      try {
        const res = await fetch(href, { method: "HEAD" });

        if (!res.ok) {
          brokenCount++;
          report += `❌ ${href} → Status: ${res.status}\n`;
        }
      } catch (err) {
        brokenCount++;
        report += `❌ ${href} → Unreachable\n`;
      }
    }

    output.value =
      `Total Broken Links Found: ${brokenCount}\n\n` +
      (report || "🎉 No broken links found!");

  } catch (error) {
    output.value =
      "❌ Unable to scan page.\n" +
      "Reason: Website blocks access (CORS policy).";
  }
}
/*************************
 AUTO KEYWORD LINK PRO
*************************/
function autoKeywordLinkPro() {

  let content = document.getElementById("akContent").value;
  const manual = document.getElementById("akKeywords").value;
  const file = document.getElementById("akExcel").files[0];
  const relType = document.getElementById("akRel").value;
  const rule = document.getElementById("akRule").value;
  const limit = parseInt(document.getElementById("akLimit").value) || 1;

  if (!content.trim()) {
    alert("Article content required");
    return;
  }

  // Protect existing links & headings
  const placeholders = [];
  content = content.replace(/<a[\s\S]*?<\/a>|<h[1-6][\s\S]*?<\/h[1-6]>/gi, m => {
    placeholders.push(m);
    return `%%PLACEHOLDER${placeholders.length - 1}%%`;
  });

  let keywordPairs = [];

  if (manual.trim()) {
    manual.split("\n").forEach(line => {
      if (line.includes("|")) {
        const [k, u] = line.split("|");
        keywordPairs.push({ key: k.trim(), url: u.trim() });
      }
    });
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
      sheet.forEach(r => {
        if (r[0] && r[1]) keywordPairs.push({ key: r[0], url: r[1] });
      });
      processLinks();
    };
    reader.readAsArrayBuffer(file);
  } else {
    processLinks();
  }

  function processLinks() {

    keywordPairs.forEach(pair => {

      let count = 0;
      const escaped = pair.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      const rel = relType ? ` rel="${relType}"` : "";
      const link = `<a href="${pair.url}"${rel}>${pair.key}</a>`;

      content = content.replace(regex, match => {
        if (rule === "first" && count >= 1) return match;
        if (count >= limit) return match;
        count++;
        return link;
      });
    });

    // Restore protected parts
    content = content.replace(/%%PLACEHOLDER(\d+)%%/g, (_, i) => placeholders[i]);

    document.getElementById("akOutput").value = content;
  }
}
/* ===== EXPORT AS TXT ===== */
function exportTXT(text, filename = "result.txt") {
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/* ===== EXPORT AS CSV ===== */
function exportCSV(rows, filename = "report.csv") {
  let csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/* ===== COPY ===== */
function copyText(id) {
  const el = document.getElementById(id);
  el.select();
  document.execCommand("copy");
  alert("Copied!");
}
