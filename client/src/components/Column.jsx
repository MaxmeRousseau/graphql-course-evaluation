// TODO 3.2 (suite) - Query paginée
// Ce qu'il faut faire :
// - TASKS_FOR_COLUMN : board avec columns.tasks (pagination)
// - MOVE_TASK : déplacer une tâche vers une autre colonne
// - Gérer le drag & drop et le bouton "Charger plus"

import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import useToast from '../toastStore'

const TASKS_FOR_COLUMN = gql`
query TasksForColumn($first: Int = 10, $after: String) {
  board {
    id
    columns {
      id
      name
      tasks(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            description
            assignees { id name }
            comments { id content author { id name } createdAt }
            column { id }
          }
        }
        pageInfo { endCursor hasNextPage }
      }
    }
  }
}
`

const MOVE_TASK = gql`
mutation MoveTask($id: ID!, $to: ID!) {
  # TODO
  board {
    id
    columns {
      id
      name
      tasks(first: 100) {
        edges { 
          cursor 
          node { 
            id 
            title 
            description 
            assignees { id name }
            comments { id content author { id name } createdAt }
            column { id } 
          } 
        }
        pageInfo { endCursor hasNextPage }
      }
    }
  }
}
`

// const MOVE_TASK = gql`
// mutation MoveTask($id: ID!, $to: ID!) {
//   moveTask(id: $id, toColumnId: $to) { id column { id name } }
// }
// `

const COLUMN_ICONS = {
  'Todo': '📋',
  'Doing': '⚡',
  'Done': '✅'
}

export default function Column({ column, users }) {
  const { data, loading, error, fetchMore } = useQuery(TASKS_FOR_COLUMN)
  const addToast = useToast(s => s.addToast)
  
  const [moveTask, { loading: moving }] = useMutation(MOVE_TASK, { 
    refetchQueries: ['TasksForColumn', 'Board'],
    onCompleted: (data) => {
      const task = data?.moveTask
      if (task) {
        addToast(`Déplacé vers ${task.column.name}`, 'success')
      }
    }
  })

  const [isDragOver, setIsDragOver] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  if (loading) {
    return (
      <div className="column">
        <div className="column-header">
          <h3>{COLUMN_ICONS[column.name] || '📌'} {column.name}</h3>
          <div className="column-badge">...</div>
        </div>
        <div className="tasks-list">
          <div className="skeleton" style={{ height: 100 }}></div>
          <div className="skeleton" style={{ height: 120 }}></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="column">
        <div className="column-header">
          <h3>{column.name}</h3>
        </div>
        <div className="error-message">❌ {error.message}</div>
      </div>
    )
  }

  const board = data.board
  const col = board.columns.find(c => c.id === column.id)
  const tasks = col?.tasks?.edges ?? []
  const pageInfo = col?.tasks?.pageInfo ?? { hasNextPage: false }

  async function move(id, toColumnId) {
    try {
      await moveTask({ variables: { id, to: toColumnId } })
    } catch (err) {
      console.error('Erreur déplacement:', err)
      addToast('Erreur lors du déplacement', 'error')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const taskId = e.dataTransfer.getData('taskId')
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId')
    
    if (taskId && sourceColumnId !== column.id) {
      await move(taskId, column.id)
    }
  }

  return (
    <>
      <div 
        className={`column ${isDragOver ? 'column-drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="column-header">
          <h3>{COLUMN_ICONS[column.name] || '📌'} {column.name}</h3>
          <div className="column-badge">{tasks.length}</div>
        </div>
        
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">
                {isDragOver ? 'Déposer ici' : 'Aucune tâche'}
              </div>
            </div>
          ) : (
            tasks.map(({ node }) => (
              <TaskCard 
                key={node.id} 
                task={node} 
                users={users} 
                columns={board.columns} 
                onMove={move}
                onEdit={setEditingTask}
                isMoving={moving}
              />
            ))
          )}
        </div>
        
        {pageInfo.hasNextPage && (
          <button
            className="load-more-btn"
            onClick={() => fetchMore({ variables: { after: col.tasks.pageInfo.endCursor } })}
          >
            ⬇️ Charger plus de tâches
          </button>
        )}
      </div>

      {editingTask && (
        <TaskModal
          task={editingTask}
          users={users}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  )
}
