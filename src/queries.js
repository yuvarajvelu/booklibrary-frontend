import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author {
            name
            born
            bookCount
        }
        genres
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born 
            bookCount
        }
    } 
`

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            published
            genres
            author {
                name
                born
            }
        }
    }
`

export const ADD_BOOK = gql`
    mutation createBook( $title: String!, $name: String!, $published: Int!, $genres: [String!] ){
        addBook(
            title: $title
            published: $published
            name: $name
            genres: $genres
        ){
            title
            author {
                name
                born
                bookCount
            }
            published
            genres
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthorBorn( $name: String!, $born: Int!) {
        editAuthor(
            name: $name
            born: $born
        ){
            name
            born
            bookCount
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`

export const USER = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`

export const ALL_BOOKS_BY_GENRE = gql`
    query allBooks($genre: String!) {
        allBooks(genre: $genre) {
            title
            published
            author {
                name
            }
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`