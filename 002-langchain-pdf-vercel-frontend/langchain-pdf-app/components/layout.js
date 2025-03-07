import styles from '../styles/layout.module.css'

export default function Layout(props) {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h1 className={styles.title}>PDF Assistant</h1>
        <p className={styles.subtitle}>
          Upload, manage and ask questions about your PDF documents
        </p>
        <div className={styles.credits}>
          By <a href="https://aiaccelera.com/" target="_blank" rel="noopener noreferrer">AI Accelera</a> and <a href="https://aceleradoraai.com/" target="_blank" rel="noopener noreferrer">Aceleradora AI</a>
        </div>
      </div>
      <main className={styles.main}>
        {props.children}
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} - PDF Assistant with LangChain</p>
      </footer>
    </div>
  )
}