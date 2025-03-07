import { useState } from 'react';
import styles from '../styles/pdf-qa.module.css';
import config from '../config';

export default function PdfQA({ pdfId, pdfName }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');
    
    try {
      const response = await fetch(`${config.apiUrl}/pdfs/qa-pdf/${pdfId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.text();
      setAnswer(data);
    } catch (err) {
      console.error('Error asking question:', err);
      setError('Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.qaContainer}>
      <form onSubmit={handleSubmit} className={styles.qaForm}>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask a question about this PDF..."
          className={styles.questionInput}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.askButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.loadingSpinner}></span>
              Thinking...
            </>
          ) : 'Ask Question'}
        </button>
      </form>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      {answer && (
        <div className={styles.answerContainer}>
          <h4>Answer</h4>
          <p className={styles.answerText}>{answer}</p>
        </div>
      )}
    </div>
  );
} 