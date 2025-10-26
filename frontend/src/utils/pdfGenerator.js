import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePatientReport = (patient, doctorName) => {
  const doc = new jsPDF();
  
  // Add medical symbol/logo header
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 25, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Frailty Detection Report', 105, 15, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Date and Patient ID
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Report Date: ${currentDate}`, 14, 35);
  doc.text(`Patient ID: ${patient.patientId}`, 14, 40);
  doc.text(`Attending Doctor: ${doctorName || 'N/A'}`, 14, 45);
  
  // Patient Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('Patient Information', 14, 57);
  
  // Patient Info Table
  autoTable(doc, {
    startY: 61,
    head: [['Field', 'Value']],
    body: [
      ['Name', patient.name || 'N/A'],
      ['Patient ID', patient.patientId || 'N/A'],
      ['Age', `${patient.age || 'N/A'} years`],
      ['Gender', patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'],
      ['Email', patient.email || 'N/A'],
      ['Phone', patient.phone || 'N/A'],
      ['Date Added', patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A']
    ],
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    margin: { left: 14, right: 14 }
  });
  
  // Clinical Information Section
  const clinicalStartY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('Clinical Information', 14, clinicalStartY);
  
  // Format values
  const formatLivingStatus = (status) => {
    const map = {
      'alone': 'Lives Alone',
      'with-family': 'Lives with Family',
      'with-others': 'Lives with Others',
      'care-facility': 'Care Facility'
    };
    return map[status] || status || 'N/A';
  };
  
  const formatCardiacFunction = (value) => {
    const map = {
      'I': 'Class I (No limitation)',
      'II': 'Class II (Slight limitation)',
      'III-IV': 'Class III-IV (Marked limitation)',
      'III': 'Class III',
      'IV': 'Class IV'
    };
    return map[value] || value || 'N/A';
  };
  
  const formatYesNo = (value) => {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A';
  };
  
  // Clinical Info Table
  autoTable(doc, {
    startY: clinicalStartY + 4,
    head: [['Parameter', 'Value']],
    body: [
      ['Living Status', formatLivingStatus(patient.livingStatus)],
      ['Depression', formatYesNo(patient.depression)],
      ['Cardiac Function', formatCardiacFunction(patient.cardiacFunction)],
      ['Cerebrovascular Disease', formatYesNo(patient.cerebrovascularDisease)],
      ['Diabetes', formatYesNo(patient.diabetes)],
      ['Total Cholesterol', patient.totalCholesterol ? `${patient.totalCholesterol} mmol/L` : 'N/A'],
      ['LDL Cholesterol', patient.ldlCholesterol ? `${patient.ldlCholesterol} mmol/L` : 'N/A'],
      ['Hemoglobin', patient.hemoglobin ? `${patient.hemoglobin} g/L` : 'N/A'],
      ['ADL Score', patient.adlScore ? `${patient.adlScore}/100` : 'N/A']
    ],
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    margin: { left: 14, right: 14 }
  });
  
  // Frailty Assessment Section
  if (patient.frailtyPrediction) {
    const assessmentStartY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('Frailty Assessment', 14, assessmentStartY);
    
    // Risk Level Box
    const riskLevel = patient.frailtyPrediction.riskLevel || 'Unknown';
    const confidence = patient.frailtyPrediction.confidence 
      ? (patient.frailtyPrediction.confidence * 100).toFixed(1) 
      : 'N/A';
    
    // Color based on risk level
    let riskColor;
    if (riskLevel === 'High') {
      riskColor = [220, 38, 38]; // Red
    } else if (riskLevel === 'Medium') {
      riskColor = [234, 179, 8]; // Yellow
    } else {
      riskColor = [34, 197, 94]; // Green
    }
    
    const boxY = assessmentStartY + 4;
    doc.setFillColor(...riskColor);
    doc.roundedRect(14, boxY, 182, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Risk Level: ${riskLevel}`, 105, boxY + 10, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence: ${confidence}%`, 105, boxY + 18, { align: 'center' });
    
    // Assessment Details
    doc.setTextColor(0, 0, 0);
    const detailsStartY = boxY + 32;
    
    autoTable(doc, {
      startY: detailsStartY,
      head: [['Assessment Details', 'Value']],
      body: [
        ['Model Version', patient.frailtyPrediction.modelVersion || 'N/A'],
        ['Assessment Date', patient.frailtyPrediction.predictedAt 
          ? new Date(patient.frailtyPrediction.predictedAt).toLocaleString() 
          : 'N/A'],
        ['Last Updated', patient.updatedAt 
          ? new Date(patient.updatedAt).toLocaleString() 
          : 'N/A']
      ],
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234] },
      margin: { left: 14, right: 14 }
    });
  }
  
  // Additional Notes Section
  if (patient.notes) {
    const notesStartY = doc.lastAutoTable.finalY + 10;
    
    // Check if we need a new page
    const pageHeight = doc.internal.pageSize.height;
    if (notesStartY > pageHeight - 40) {
      doc.addPage();
    }
    
    const actualStartY = notesStartY > pageHeight - 40 ? 20 : notesStartY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('Additional Notes', 14, actualStartY);
    
    // Use autoTable for notes to handle page breaks
    autoTable(doc, {
      startY: actualStartY + 4,
      body: [[patient.notes]],
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 182 }
      },
      margin: { left: 14, right: 14 }
    });
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      'Frailty Detection System - Confidential Medical Report',
      105,
      doc.internal.pageSize.height - 6,
      { align: 'center' }
    );
  }
  
  // Open in new tab
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
  
  // Clean up the URL after a short delay
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
};
