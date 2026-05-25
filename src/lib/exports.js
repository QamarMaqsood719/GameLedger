// PDF Export
export async function exportToPDF(records, players) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  // Header
  doc.setFillColor(10, 76, 42);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("♠ Bhabhi Thula - Game Records ♠", 105, 18, { align: "center" });

  // Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleDateString()} | Total Records: ${records.length}`,
    105,
    26,
    { align: "center" }
  );

  // Player summary table
  doc.setTextColor(10, 76, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Player Summary", 14, 45);

  const playerRows = players
    .sort((a, b) => b.losses - a.losses)
    .map((p, i) => [
      `#${i + 1}`,
      p.name,
      p.mobile || "-",
      p.losses,
      p.losses > 0
        ? `${((p.losses / records.length) * 100).toFixed(1)}%`
        : "0%",
    ]);

  autoTable(doc, {
    startY: 50,
    head: [["Rank", "Player", "Mobile", "Losses", "Loss %"]],
    body: playerRows,
    headStyles: {
      fillColor: [10, 76, 42],
      textColor: [212, 175, 55],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [240, 248, 240] },
    styles: { fontSize: 10 },
  });

  // Records table
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 76, 42);
  doc.text("All Game Records", 14, finalY);

  const recordRows = [...records]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((r, i) => {
      const player = players.find((p) => p.id === r.playerId);
      const date = new Date(r.createdAt);
      return [
        i + 1,
        player?.name || "Unknown",
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        r.note || "-",
      ];
    });

  autoTable(doc, {
    startY: finalY + 5,
    head: [["#", "Loser", "Date", "Time", "Note"]],
    body: recordRows,
    headStyles: {
      fillColor: [10, 76, 42],
      textColor: [212, 175, 55],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [240, 248, 240] },
    styles: { fontSize: 9 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | Bhabhi Thula Tracker`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  doc.save(`bhabhi-thula-records-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// Excel Export
export async function exportToExcel(records, players) {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ["Bhabhi Thula - Game Records"],
    [`Generated: ${new Date().toLocaleDateString()}`],
    [`Total Games: ${records.length}`],
    [],
    ["PLAYER SUMMARY"],
    ["Rank", "Player Name", "Mobile", "Total Losses", "Loss %"],
    ...players
      .sort((a, b) => b.losses - a.losses)
      .map((p, i) => [
        i + 1,
        p.name,
        p.mobile || "-",
        p.losses,
        records.length > 0
          ? `${((p.losses / records.length) * 100).toFixed(1)}%`
          : "0%",
      ]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // Records sheet
  const recordsData = [
    ["#", "Loser", "Date", "Time", "Note", "Player ID"],
    ...[...records]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((r, i) => {
        const player = players.find((p) => p.id === r.playerId);
        const date = new Date(r.createdAt);
        return [
          i + 1,
          player?.name || "Unknown",
          date.toLocaleDateString(),
          date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          r.note || "",
          r.playerId,
        ];
      }),
  ];

  const recordsSheet = XLSX.utils.aoa_to_sheet(recordsData);
  recordsSheet["!cols"] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 15 },
    { wch: 10 },
    { wch: 30 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, recordsSheet, "All Records");

  XLSX.writeFile(
    wb,
    `bhabhi-thula-records-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

// WhatsApp share
export function shareOnWhatsApp(players, records) {
  const topLoser = [...players].sort((a, b) => b.losses - a.losses)[0];
  const funnyMessages = [
    `♠️ Bhabhi Thula Leaderboard ♠️\n\n🏆 Biggest Loser: ${topLoser?.name || "TBD"} with ${topLoser?.losses || 0} losses! 😂\n\n📊 Total Games: ${records.length}\n👥 Players: ${players.length}\n\nWho's next? 😈 #BhabhiThula`,
    `🃏 Aaj ki Bhabhi Thula report! 🃏\n\n😭 ${topLoser?.name || "Someone"} ne ${topLoser?.losses || 0} baar haara!\n🎯 Total games played: ${records.length}\n\nAb koi bachao isko! 😂 #CardGame #BhabhiThula`,
    `🎴 BHABHI THULA HALL OF SHAME 🎴\n\n🥇 Champion Loser: ${topLoser?.name || "N/A"} (${topLoser?.losses || 0} losses)\n📅 Total Sessions: ${records.length}\n\n${players
      .sort((a, b) => b.losses - a.losses)
      .slice(0, 3)
      .map((p, i) => `${i + 1}. ${p.name}: ${p.losses} losses`)
      .join("\n")}\n\nNext game kab? 😏`,
  ];

  const message =
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
