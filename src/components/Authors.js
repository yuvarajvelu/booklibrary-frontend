import { useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  
  const result = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, { refetchQueries: [ { query: ALL_AUTHORS } ]})
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  if (!props.show) {
    return null
  }
  if (result.loading)  {
    return <div>loading...</div>
  }
  const born = Number(year)
  const handleEdit = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, born }})
    setYear('')
  }
 
  const authors = result.data.allAuthors
  if(name === '') {
    setName(authors[0].name)
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <form onSubmit = {handleEdit}>
        <h2>Set Birthyear</h2>
        <label>
          name <select onChange = {({target}) => setName(target.value)}>
            {authors.map(a => <option key = {a.name} value = {a.name}>{a.name}</option>)}
          </select>
        </label>
        <div>
          born <input type = 'number' value = {year} onChange = {({target}) => setYear(target.value)} />
        </div>
        <button type ="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
