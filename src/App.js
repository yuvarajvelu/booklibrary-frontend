
import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)
  const client = useApolloClient()
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map(p => p.title).includes(object.title)
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if(!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [ ...dataInStore.allBooks, addedBook]
        }
      })
    } 
    const authorData = client.readQuery({ query: ALL_AUTHORS })
    const included = authorData.allAuthors.filter(p => p.name === addedBook.author.name)
    
    if(included.length === 0) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: {
          ...authorData,
          allAuthors: [ ...authorData.allAuthors, addedBook.author]
        }
      })
    } else {
      const authorDetails = authorData.allAuthors.map(a => {
        const author = Object.assign({} , a)
        if(author.name === included[0].name) {
          author.bookCount = author.bookCount + 1
        }
        return author
      })
      client.writeQuery({
        query: ALL_AUTHORS,
        data: {
          allAuthors: authorDetails
        }
      })
    }
  }
  const notify = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    },5000)
  }
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({subscriptionData}) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} is added`)
      updateCacheWith(addedBook)
    }
  })
  
  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  useEffect(() => {
    const token = localStorage.getItem('libraryapp-user')
    if(token) {
      setToken(token)
    }
  },[])
  
  
  
  return (
    <div>
      <Notification message = {message} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <>
                    <button onClick={() => setPage('add')}>add book</button>
                    <button onClick={() => setPage('recommend')}>recommend</button>
                    <button onClick = {handleLogout}>logout</button>
                  </>
         }
        {!token && <button onClick ={() => setPage('login')}>login</button>}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'} updateCacheWith = {updateCacheWith}
      />

      <Recommendations
        show={page === 'recommend'}
      />
      
      <LoginForm
        show={page === 'login'} setToken = {setToken} 
      />
    </div>
  )
}

const Notification = ({message}) => {
  if(!message) {
    return null
  } 
  return(
    <div>
      <p style = { {color: "red"} }>{message}</p>
    </div>
  )
}

export default App