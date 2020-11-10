import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  
  const [ filter, setFilter ] = useState("all")
  
  if (!props.show) {
    return null
  }
  if(result.loading) {
    return(
      <div>loading ...</div>
    )
  }
  const allBooks = result.data.allBooks

  const genres = allBooks.reduce((totalGenres, book) => {
    book.genres.forEach(g => totalGenres.includes(g) ? null : totalGenres.push(g))
    return totalGenres
  },[])

  let filteredBooks = allBooks.filter(b => b.genres.includes(filter))
  if(filter === 'all') {
    filteredBooks = allBooks
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre <strong>{filter}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(g => <button key = {g} onClick = {() => setFilter(g)}>{g}</button>)}
      <button onClick = {() => setFilter('all')}>all genre</button>
    </div>
  )
}

export default Books