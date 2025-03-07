import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/modal.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Verificar que estamos en el navegador
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen && isBrowser) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevenir scroll cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (isBrowser) {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose, isBrowser]);
  
  // Si el modal no está abierto o no estamos en el navegador, no renderizamos nada
  if (!isOpen || !isBrowser) return null;
  
  // Función para cerrar el modal cuando se hace clic en el overlay
  const handleOverlayClick = (e) => {
    // Solo cerramos si el clic fue directamente en el overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // El contenido del modal
  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
  
  // Usamos createPortal para renderizar el modal fuera del árbol DOM normal
  return createPortal(
    modalContent,
    document.body // Renderizamos el modal directamente en el body
  );
} 