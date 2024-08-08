import React, { useState } from "react";
import BookSeachBox from "../../components/BookSearchBox";  
import BookTable from "../../components/BookTable";   



function Books() {
    const [query , setQuery] = useState({page: 1 , searchType: 'title' , searchValue: '' , subject: ''});
    const [loading , setLoading] = useState(true);
    return (
        <React.Fragment>
            <BookSeachBox query = {query} setQuery={setQuery} loading = {loading} setLoading = {setLoading}/>
            <BookTable query = {query} setQuery={setQuery} loading = {loading} setLoading = {setLoading}/>
        </React.Fragment>
    );
}

export default Books;