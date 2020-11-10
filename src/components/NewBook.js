import React, { useState } from 'react'
import { ADD_BOOK } from '../queries'
import { useMutation } from '@apollo/client'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([]) 
  const [ createBook ] = useMutation(ADD_BOOK)
  if (!props.show) {
    return null
  }
  const publishedYear = Number(published)
  const submit = async (event) => {
    event.preventDefault() 
    if(genres.length === 0 && genre !== '') {
      genres.push(genre)
    }
    createBook({ variables: { title, name, published: publishedYear, genres }})
    setTitle('')
    setPublished('')
    setName('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(', ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook