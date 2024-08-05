import React from 'react';
import { useForm } from 'react-hook-form';

function BookSearchBox({ query, setQuery }) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        setQuery({...data , page: 1});
    };

    return (
        <div className="shadow-md m-3 border h-auto p-4 rounded-lg bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row items-center justify-center w-full flex-wrap">
                {console.log(query.searchType)}
                <select {...register("searchType")} value={query.searchType ? String(query.searchType) : 'title'} className="mx-2 border-2 p-2 shadow-sm rounded-md">
                    <option value="title" name="title">Title</option>
                    <option value="author" name="author">Author</option>
                    <option value="ISBN" name="ISBN">ISBN</option>
                </select>
            <input
                placeholder='Subject'
                {...register("subject")}
                className="mx-2 border-2 p-2 shadow-sm rounded-md"
                defaultValue={query.subject || ''}
            />
            <input
                placeholder='Search Value'
                {...register("searchValue")}
                className="mx-2 border-2 p-2 shadow-sm rounded-md"
                defaultValue={query.searchValue || ''}
            />
            <button
                className="search-button mx-2 border-2 p-2 shadow-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                type="submit"
            >
                Search
            </button>
            <button
                className="search-button mx-2 border-2 p-2 shadow-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setQuery({page: 1, searchType: 'title', searchValue: '', subject: ''})}
            >
                Reset
            </button>
            </form>
        </div>
    );
}

export default BookSearchBox;