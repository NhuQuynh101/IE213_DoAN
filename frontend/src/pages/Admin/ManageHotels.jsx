import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { IoMdAddCircleOutline, IoMdRefresh } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ManageHotels = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const fetchData = (value) => {
        fetch("http://localhost:3000/api/hotel/")
            .then((response) => response.json())
            .then((json) => {
                const results = json.filter((hotel) =>
                    value && hotel?.name?.includes(value)
                );
                setResults(results);
                setSearched(true);
            });
    };

    const handleSearch = () => {
        if (search.trim() === "") {
            setSearched(false);
            setResults([]);
            return;
        }
        fetchData(search);
    };

    return (
        <div className='bg-softBlue min-h-screen p-4 md:p-8'>
            <p className='font-semibold text-[20px] md:text-[24px]'>Tất cả khách sạn</p>
            <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6'>
                {/* Search Bar */}
                <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                    <span className='text-[16px] font-medium text-gray-500'>Tìm kiếm</span>
                    <div className='flex items-center border border-gray-300 rounded-lg p-2 focus-within:border-gray-600'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='text-[14px] outline-none flex-1'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                if (e.target.value.trim() === "") {
                                    setSearched(false);
                                    setResults([]);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button onClick={handleSearch} className='p-1 hover:bg-gray-100 rounded-full'>
                            <IoSearch className='text-gray-500 text-[20px]' />
                        </button>
                    </div>

                    <div className='ml-auto flex items-center'>
                        <button className='hover:bg-gray-100 p-2 rounded-full' onClick={() => navigate('/admin/manage-hotels/create-hotel')}>
                            <IoMdAddCircleOutline className='text-[28px] text-green-400' />
                        </button>
                        <button className='hover:bg-gray-100 p-2 rounded-full'>
                            <IoMdRefresh className='text-[28px] text-gray-400' />
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className='mt-4 p-4'>
                    {searched ? (
                        results.length > 0 ? (
                            <>
                                <p className='font-semibold text-[16px]'>Kết quả tìm kiếm</p>
                                <ul className='mt-2 space-y-2'>
                                    {results.map((user) => (
                                        <li key={user.id} className='border-b border-gray-300 pb-2'>
                                            <p className='text-[14px] font-medium'>{user.name}</p>
                                            <p className='text-[12px] text-gray-500'>{user.email}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className='text-[14px] font-medium text-gray-500'>Không tìm thấy</p>
                        )
                    ) : (
                        <p className='text-[14px] font-medium text-gray-500'>Danh sách tất cả khách sạn</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageHotels;