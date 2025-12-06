import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- GLOBAL ERROR HANDLING ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#FEF2F2', color: '#991B1B', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ops! Algo deu errado.</h1>
          <p>Por favor, envie um print desta tela para o suporte.</p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: '0.5rem', overflow: 'auto' }}>
            <p style={{ fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
            <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

// Global listener for non-React errors (syntax, fetch, etc)
window.onerror = function (message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') { // Only if white screen
    root.innerHTML = `
      <div style="padding: 2rem; background-color: #FEF2F2; color: #991B1B; font-family: monospace;">
        <h1>Erro Crítico de Carregamento</h1>
        <p><strong>Mensagem:</strong> ${message}</p>
        <p><strong>Fonte:</strong> ${source}:${lineno}</p>
      </div>
    `;
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
