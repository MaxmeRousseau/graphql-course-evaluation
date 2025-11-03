// TODO 3.2 - Queries et Mutations (10 points)
// Ce qu'il faut faire :
// - Définir la query ME : id, name, email
// - Définir la query BOARD : board avec colonnes et users
// - Définir la mutation CREATE_TASK avec CreateTaskInput
// - Utiliser refetchQueries après les mutations

import React, { useState } from 'react'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import Column from '../components/Column'
import useAuth from '../store'
import useToast from '../toastStore'
import useTheme from '../themeStore'

const ME = gql`
  query Me {
    # TODO
  }
`

const BOARD = gql`
  query Board {
    # TODO
  }
`

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    # TODO
  }
`

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <button 
      className="btn-icon theme-toggle" 
      onClick={toggleTheme}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

// TODO 3.3 - Subscriptions temps réel (10 points)
// Ce qu'il faut faire :
// - Définir TASK_CREATED, TASK_UPDATED, TASK_MOVED avec boardId
// - Utiliser useSubscription avec onData
// - Afficher un toast pour chaque événement

const TASK_CREATED = gql`
  subscription OnTaskCreated($boardId: ID!) {
    # TODO
  }
`

const TASK_UPDATED = gql`
  subscription OnTaskUpdated($boardId: ID!) {
    # TODO
  }
`

const TASK_MOVED = gql`
  subscription OnTaskMoved($boardId: ID!) {
    # TODO
  }
`

export default function Board() {
  const { data: userData } = useQuery(ME)
  const { data, loading, error } = useQuery(BOARD)
  const addToast = useToast(s => s.addToast)
  
  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, { 
    refetchQueries: ['TasksForColumn', 'Board'],
    onCompleted: () => {
      addToast('Tâche créée avec succès', 'success')
    }
  })
  
  const boardId = data?.board?.id
  const currentUserId = userData?.me?.id

  // TODO : Implémenter les 3 subscriptions avec useSubscription

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [columnId, setColumnId] = useState('')
  const [assigneeIds, setAssigneeIds] = useState([])
  const [showForm, setShowForm] = useState(false)

  const logout = useAuth(s => s.logout)

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div>
            <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 4 }}></div>
            <p style={{ marginTop: '1rem' }}>Chargement du tableau...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-message">
          ❌ Une erreur est survenue : {error.message}
        </div>
      </div>
    )
  }

  async function onCreate(e) {
    e.preventDefault()
    if (!title.trim() || !columnId) return
    
    try {
      await createTask({ 
        variables: { 
          input: { 
            title: title.trim(), 
            description: description.trim() || null,
            columnId, 
            assigneeIds: assigneeIds.length > 0 ? assigneeIds : null
          } 
        } 
      })
      setTitle('')
      setDescription('')
      setColumnId('')
      setAssigneeIds([])
      setShowForm(false)
    } catch (err) {
      console.error('Erreur création:', err)
      addToast('Erreur lors de la création : ' + err.message, 'error')
    }
  }

  function toggleAssignee(userId) {
    setAssigneeIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const currentUser = userData?.me

  return (
    <div className="app-container">
      <div className="board-container">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-left">
            <div className="nav-logo">
              <span className="nav-logo-icon">📋</span>
              <span>TaskBoard</span>
            </div>
            <div className="nav-divider"></div>
            <div className="board-title">
              <span>{data.board.name}</span>
            </div>
          </div>
          
          <div className="nav-right">
            <div className="nav-actions">
              {!showForm ? (
                <button 
                  className="btn btn-primary btn-small" 
                  onClick={() => setShowForm(true)}
                >
                  ➕ Nouvelle tâche
                </button>
              ) : (
                <button 
                  className="btn btn-secondary btn-small" 
                  onClick={() => {
                    setShowForm(false)
                    setTitle('')
                    setDescription('')
                    setColumnId('')
                    setAssigneeIds([])
                  }}
                >
                  ✕ Annuler
                </button>
              )}
              <ThemeToggle />
              {currentUser && (
                <div className="assignee-badge">
                  <div className="assignee-avatar">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  {currentUser.name}
                </div>
              )}
              <button className="btn btn-secondary btn-small" onClick={logout}>
                Déconnexion
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="board-content">
          {showForm && (
            <form onSubmit={onCreate} className="task-form">
              <div className="task-form-grid">
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="task-title">Titre de la tâche *</label>
                  <input 
                    id="task-title"
                    placeholder="Ex : Implémenter la pagination"
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="task-column">Colonne *</label>
                  <select 
                    id="task-column"
                    value={columnId} 
                    onChange={e => setColumnId(e.target.value)}
                    required
                  >
                    <option value="">Sélectionnez une colonne...</option>
                    {data.board.columns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Assigner à (sélection multiple)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {data.users.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        className={assigneeIds.includes(u.id) ? 'btn btn-primary btn-small' : 'btn btn-secondary btn-small'}
                        onClick={() => toggleAssignee(u.id)}
                        style={{ minWidth: 'auto' }}
                      >
                        {assigneeIds.includes(u.id) ? '✓ ' : ''}{u.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
                  <button 
                    className="btn btn-primary btn-small" 
                    type="submit"
                    disabled={creating}
                  >
                    {creating ? <span className="loading-spinner" style={{ width: 16, height: 16 }}></span> : '✓ Créer'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
                <label htmlFor="task-description">Description (optionnelle)</label>
                <input 
                  id="task-description"
                  placeholder="Ajoutez des détails..."
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </form>
          )}

          <div className="columns-grid">
            {data.board.columns.map(col => (
              <Column 
                key={col.id} 
                column={col} 
                users={data.users}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
