import { useEffect, useState } from 'react'
import './App.css'

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
          <section className="card">
            <h1>Bienvenido</h1>
            <p>Has iniciado sesión correctamente.</p>
          </section>
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
