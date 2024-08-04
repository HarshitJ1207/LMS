import React from "react";
import NavigationBar from "../../components/NavigationBar";  

function BookSeachBox() {
    return (
        <div className="shadow-md m-3 border h-auto p-4 rounded-lg bg-white">
            <form action="/books" method="get" className="flex flex-row items-center justify-center w-full flex-wrap">
                <select name="searchType" className="mx-2 border-2 p-2 shadow-sm rounded-md">
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="ISBN">ISBN</option>
                </select>
                <input placeholder="Subject" name="subject" className="mx-2 border-2 p-2 shadow-sm rounded-md" />
                <input placeholder="Search" name="searchValue" className="mx-2 border-2 p-2 shadow-sm rounded-md" />
                <button className="search-button mx-2 border-2 p-2 shadow-sm rounded-md bg-blue-500 text-white hover:bg-blue-600" type="submit">Search</button>
            </form>
        </div>
    );
}   



function Books() {
    return (
        <React.Fragment>
            <NavigationBar />
            <BookSeachBox/>


        </React.Fragment>
    );
}

export default Books;