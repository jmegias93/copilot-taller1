import { useEffect, useState } from 'react'
import './App.css'

const CERTIFICATIONS_2026 = [
  {
    id: 'sc-500',
    exam: 'SC-500',
    name: 'Cloud and AI Security Engineer Associate',
    level: 'Associate',
    levelColor: 'level-associate',
    description:
      'Nueva certificación que reemplaza a AZ-500 (disponible desde 2026). Valida habilidades para proteger entornos cloud e IA, incluyendo identidad, red, almacenamiento, cómputo y modelos de IA.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/exams/sc-500',
    icon: '🔒',
  },
  {
    id: 'ai-901',
    exam: 'AI-901',
    name: 'Azure AI Fundamentals',
    level: 'Principiante',
    levelColor: 'level-beginner',
    description:
      'Examen actualizado en abril 2026. Cubre conceptos de IA responsable e implementación de soluciones de IA con Microsoft Azure AI Foundry.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-ai-fundamentals/',
    icon: '🤖',
  },
  {
    id: 'gh-300',
    exam: 'GH-300',
    name: 'GitHub Copilot',
    level: 'Intermedio',
    levelColor: 'level-intermediate',
    description:
      'Certificación actualizada en enero 2026. Evalúa el uso de GitHub Copilot para mejorar la productividad, calidad y seguridad del desarrollo de software.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/github-copilot/',
    icon: '🚀',
  },
  {
    id: 'gh-advanced-security',
    exam: 'GH-AS',
    name: 'GitHub Advanced Security',
    level: 'Associate',
    levelColor: 'level-associate',
    description:
      'Incorporada en 2026 como opción de formación avanzada para la designación Digital & App Innovation Solutions Partner. Valida habilidades en seguridad avanzada de código.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/github-advanced-security/',
    icon: '🛡️',
  },
  {
    id: 'm365-collab',
    exam: 'MS-721',
    name: 'M365 Collaboration Communications Systems Engineer Associate',
    level: 'Associate',
    levelColor: 'level-associate',
    description:
      'Añadida en 2026 como opción de formación para la especialización Microsoft Teams. Cubre llamadas, reuniones y sistemas de comunicación corporativa.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/m365-collaboration-communications-systems-engineer/',
    icon: '💬',
  },
  {
    id: 'az-305',
    exam: 'AZ-305',
    name: 'Azure Solutions Architect Expert',
    level: 'Experto',
    levelColor: 'level-expert',
    description:
      'Certificación de nivel experto vigente en 2026. Valida habilidades para diseñar soluciones de infraestructura, datos, aplicaciones e IA en Azure.',
    url: 'https://learn.microsoft.com/es-es/credentials/certifications/azure-solutions-architect/',
    icon: '☁️',
  },
]

const LOGIN_PATH = '/'
const WELCOME_PATH = '/welcome'
const SESSION_TOKEN_KEY = 'session_access_token'

const getSessionToken = () => window.sessionStorage.getItem(SESSION_TOKEN_KEY)

const navigateTo = (path) => {
  if (window.location.pathname === path) {
    return
  }

  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [token, setToken] = useState(getSessionToken)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (path === WELCOME_PATH && !token) {
      navigateTo(LOGIN_PATH)
      return
    }

    if (path !== LOGIN_PATH && path !== WELCOME_PATH) {
      navigateTo(token ? WELCOME_PATH : LOGIN_PATH)
    }
  }, [path, token])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.detail ?? 'No se pudo iniciar sesión.')
        return
      }

      window.sessionStorage.setItem(SESSION_TOKEN_KEY, data.access_token)
      setToken(data.access_token)
      setPassword('')
      navigateTo(WELCOME_PATH)
    } catch {
      setError('No se pudo conectar al backend.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY)
    setToken(null)
    navigateTo(LOGIN_PATH)
  }

  return (
    <div className="app-shell">
      <header>
        <nav className="global-nav">
          <span>JWT Demo</span>
          <span>Frontend</span>
        </nav>
        <div className="sub-nav-frosted">
          <strong>Autenticación</strong>
          {token ? (
            <button className="button-secondary-pill" onClick={handleLogout} type="button">
              Cerrar sesión
            </button>
          ) : null}
        </div>
      </header>

      <main className="content">
        {path === WELCOME_PATH ? (
          <div className="welcome-wrapper">
            <section className="card">
              <h1>Bienvenido</h1>
              <p>Has iniciado sesión correctamente.</p>
            </section>

            <section className="certifications-section">
              <h2 className="certifications-title">Certificaciones Microsoft 2026</h2>
              <p className="certifications-subtitle">
                Últimas certificaciones y novedades de Microsoft para impulsar tu carrera en tecnología.
              </p>
              <div className="certifications-grid">
                {CERTIFICATIONS_2026.map((cert) => (
                  <article key={cert.id} className="cert-card">
                    <div className="cert-card-header">
                      <span className="cert-icon" aria-hidden="true">{cert.icon}</span>
                      <span className={`cert-level ${cert.levelColor}`}>{cert.level}</span>
                    </div>
                    <p className="cert-exam">{cert.exam}</p>
                    <h3 className="cert-name">{cert.name}</h3>
                    <p className="cert-description">{cert.description}</p>
                    <a
                      className="cert-link"
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Más información →
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <section className="card">
            <h1>Iniciar sesión</h1>
            <p className="subtitle">Usa las credenciales del backend para obtener un token JWT.</p>
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />

              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              {error ? <p className="error-message">{error}</p> : null}

              <button className="button-primary" disabled={isLoading} type="submit">
                {isLoading ? 'Validando...' : 'Ingresar'}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
