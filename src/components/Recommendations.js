import React from 'react'
import { useQuery } from '@apollo/client'
import { USER, ALL_BOOKS_BY_GENRE } from '../queries'

const FilteredBooks = ({genre}) => {
    const result = useQuery(ALL_BOOKS_BY_GENRE,{ variables: { genre }})
    if(result.loading) {
        return <div>loading ...</div>
    }
    return(
        <div>
            <h2>Recommendations</h2>
            <p>books in your favorite genre <strong>{genre}</strong></p>
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
                    {
                        result.data.allBooks.map(b => <tr key ={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>)
                    }
                    
                    
                </tbody>
            </table>
        </div>
    )
}

const Recommendations =  (props) => {

    const resultUser = useQuery(USER)
    
    if(!props.show) {
        return null
    }
    if(resultUser.loading) {  
        return <div>loading ...</div>
    }
    return (
        <div>
            {resultUser.data.me.favoriteGenre && <FilteredBooks genre ={resultUser.data.me.favoriteGenre} />}
        </div>
    )
}

export default Recommendations