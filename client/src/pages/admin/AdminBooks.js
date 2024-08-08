import React, { useState } from "react";
import BookSeachBox from "../../components/BookSearchBox";  
import BookTable from "../../components/BookTable";   



function Books() {
    const [query , setQuery] = useState({page: 1 , searchType: 'title' , searchValue: '' , subject: ''});
    return (
        <React.Fragment>
            <BookSeachBox query = {query} setQuery={setQuery}/>
            <BookTable query = {query} setQuery={setQuery}/>
        </React.Fragment>
    );
}

export default Books;