const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
        HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1d4ed8" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2a9d5c" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({ children: [new TextRun({ text: "Multi-PC Study Dashboard Integration", bold: true, size: 48, font: "Arial" })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "Complete Design Document", size: 28, font: "Arial", color: "666666" })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      new Paragraph({ children: [new TextRun({ text: "Paul & Khailer Workspace Automation", size: 24, font: "Arial", italics: true })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: "June 2026", size: 22, font: "Arial", color: "999999" })], alignment: AlignmentType.CENTER, spacing: { after: 600 } }),
      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({ children: [new TextRun("This document describes a fully automated workflow for Paul and Khailer working on different PCs. Khailer creates chapter study materials, pushes to GitHub, and Claude automatically integrates them into Paul's dashboard.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Zero manual updates to any tracking files")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Everything stored in Git repositories")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Claude polls and auto-links chapters to dashboard")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("No external services (Google Sheets, API, etc.)")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Architecture Overview")] }),
      new Paragraph({ children: [new TextRun("Paul and Khailer work on separate PCs with two independent GitHub repositories that communicate through Git-based metadata.")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("High-Level Flow")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Khailer finishes chapter → Git push to study-chapters")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude detects new chapter via webhook or Paul's scheduled check")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude auto-creates chapter-metadata.json in chapter folder")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Paul runs /check-chapters command")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude reads metadata from both repos, links chapters to study-dashboard")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude commits and pushes to study-dashboard")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Dashboard goes live on GitHub Pages")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Metadata Schema")] }),
      new Paragraph({ children: [new TextRun("Each chapter folder contains chapter-metadata.json with:")] }),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun("{ \"status\": \"ready\", \"subject\": \"Maths\", \"chapter\": 1, \"title\": \"Functions & Graphs\", \"url\": \"https://khailer.github.io/study-chapters/maths/chapter1/\", \"ready_date\": \"2026-06-11T10:30:00Z\" }")], indent: { left: 720 } }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Khailer's Workflow")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Create chapter folder: maths/chapter1/")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Add files: index.html, styles.css, script.js")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Test locally: npx serve .")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Commit and push: git push origin")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude auto-creates chapter-metadata.json (detected via webhook or polling)")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Paul's Workflow")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Run /check-chapters command")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude scans both repositories for new chapters")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude displays list of ready chapters")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Paul approves: \"yes, link all\"")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude updates js/subject.js with resourceUrl fields")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude updates sw.js with asset paths")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Claude validates, commits, and pushes")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Dashboard updates on GitHub Pages")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Implementation Phases")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 1: Manual Metadata (Week 1)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Khailer manually creates chapter-metadata.json after pushing")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Paul manually runs /check-chapters")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Claude reads metadata and links chapters")] }),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 2: Auto-Metadata (Week 2)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Claude auto-creates chapter-metadata.json on push")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Paul still manually runs /check-chapters")] }),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 3: Fully Automated (Week 3+)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Claude runs /check-chapters on a schedule")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Zero manual intervention required")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Key Files")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("New Files")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("chapter-metadata.json in each chapter folder (study-chapters)")] }),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Modified Files")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("js/subject.js – add resourceUrl fields")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("sw.js – add paths to STATIC_ASSETS")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("subjects/*.html – add chapter resource links")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Advantages Over Alternatives")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("No external services (Google Sheets, APIs, etc.)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Everything auditable in Git history")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Works offline (once cloned)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Simple setup – no credentials, no webhooks required")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Fully automated after Phase 1")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. Next Steps")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Review this design")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Approve metadata schema")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Implement Phase 1: Manual metadata + Claude linking")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Test with 5 chapters")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Implement Phase 2: Auto-metadata detection")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("MULTI_PC_DESIGN.docx", buffer);
  console.log("Document created!");
});
