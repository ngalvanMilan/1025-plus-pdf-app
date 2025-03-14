import Image from 'next/image';
import styles from '../styles/pdf.module.css';
import config from '../config';
import { useState } from 'react';
import PdfQA from './pdf-qa';
import Modal from './modal';

export default function PDFComponent(props) {
  const { pdf, onChange, onDelete } = props;
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);

  const openQAModal = () => {
    setIsQAModalOpen(true);
  };

  const closeQAModal = () => {
    setIsQAModalOpen(false);
  };

  return (
    <div className={styles.pdfContainer}>
      <div className={styles.pdfRow}>
        <input
          className={styles.pdfCheckbox}
          name="selected"
          type="checkbox"
          checked={pdf.selected}
          onChange={(e) => onChange(e, pdf.id)}
        />
        <input
          className={styles.pdfInput}
          autoComplete="off"
          name="name"
          type="text"
          value={pdf.name}
          onChange={(e) => onChange(e, pdf.id)}
        />
        <a
          href={`${config.apiUrl}/pdfs/download/${pdf.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewPdfLink}
        >
          <Image src="/document-view.svg" width="22" height="22" alt="View PDF" />
        </a>
        <button
          className={styles.qaBtn}
          onClick={openQAModal}
          title="Ask questions about this PDF"
        >
          <Image src="/question.svg" width="22" height="22" alt="Ask questions" />
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(pdf.id)}
        >
          <Image src="/delete-outline.svg" width="24" height="24" alt="Delete" />
        </button>
      </div>
      
      <Modal 
        isOpen={isQAModalOpen} 
        onClose={closeQAModal}
        title={`Ask questions about "${pdf.name}"`}
      >
        <PdfQA pdfId={pdf.id} pdfName={pdf.name} />
      </Modal>
    </div>
  );
}
