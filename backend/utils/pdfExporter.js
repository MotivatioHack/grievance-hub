import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this import style works for adding autoTable method

// Define the shape of the data items expected
/**
 * @typedef {Object} ReportItem
 * @property {number|string} id
 * @property {string|null} title
 * @property {string|null} description
 * @property {string|null} status
 * @property {string|Date|null} created_at
 * @property {{name?: string|null}|null} [User]
 */


export const generatePDF = (data) => { // plain JS: no type annotations
    if (!data || data.length === 0) {
        throw new Error("No data provided for PDF generation.");
    }
    console.log(`🧾 Generating PDF for ${data.length} records...`);

    try {
        const doc = new jsPDF();
        const tableColumn = ["ID", "Title", "Status", "Submitted By", "Created At"]; // Adjusted columns
        const tableRows = [];

        data.forEach(item => {
            const itemData = [
                item.id,
                item.title || 'N/A',
                item.status || 'N/A',
                (item.User && item.User.name) || 'Anonymous', // Use User.name if available
                item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A' // Format date simply
                // Removed description for brevity in PDF table, add back if needed
            ];
            // Ensure all elements are strings or numbers for jspdf-autotable
            tableRows.push(itemData.map(d => String(d ?? 'N/A')));
        });

        // Add Title and Timestamp
        doc.setFontSize(18);
        doc.text("Complaints Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

        // Add table using jspdf-autotable
        // Call autoTable directly (no TypeScript assertion in JS)
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] }, // Example header color
             styles: { fontSize: 8 }, // Smaller font for potentially long content
             columnStyles: { // Adjust column widths if needed
                // 0: { cellWidth: 10 }, // ID column width
                // 1: { cellWidth: 40 }, // Title column width etc.
             }
        });

        console.log("✅ PDF document generated successfully.");
        // Return the PDF output as a Buffer for sending
        return Buffer.from(doc.output('arraybuffer'));

    } catch (err) { // plain JS: no type annotations
        console.error('❌ Error generating PDF:', err);
        // Rethrow a more specific error or handle it
        throw new Error(`Failed to generate PDF document: ${err && err.message ? err.message : String(err)}`);
    }
};
