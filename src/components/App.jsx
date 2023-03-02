import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Loader } from 'components/Loader';
import LoadMoreBtn from 'components/Button/Button';
import { StyledApp } from './App.styled'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getImages } from './services/Api';
import PropTypes from 'prop-types'

export const PER_PAGE = 12

const App = () => {
  const [query, setQuery] = useState('');
  const [queryHits, setQueryHits] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)

      try {
        const { hits, totalHits } = await getImages(query, page)

        if (totalHits === 0) {
          toast.error(`Oops... We can't find ${query}`)
          setStatus('idle')
          setTotalHits(0)
          setPage(1)
          return;
        }

        setTotalHits(totalHits)
        setQueryHits((prevState) => [...prevState, ...hits])


      } catch (error) {
        toast.error(`Something went wrong..${error?.message}`)
        setError('rejected')
      } finally {
        setIsLoading(false)
      }
    }

    if (query === '' && page === 1) return;
    fetchImages();
  }, [query, page]);



  const onSubmitForm = (value) => {
    setQuery(value)
    setQueryHits([])
    setTotalHits(0)
    setPage(1)
    setError(null)
  }

  const handleMoreBtnClick = () => {
    setPage((prevState => prevState + 1))
  }



  const isLoadMoreVisible = queryHits.length < totalHits && (page < Math.ceil(totalHits / PER_PAGE));

  return (
    <StyledApp >
      <Searchbar
        query={query}
        onSubmitForm={onSubmitForm}

      />
      <ImageGallery
        queryHits={queryHits}
      >
      </ImageGallery>
      {isLoading && <Loader />}
      {isLoadMoreVisible && <LoadMoreBtn onClick={handleMoreBtnClick} />}
      <ToastContainer autoClose={2000} />
      {status === 'rejected' &&
        <div>{error?.message}</div>}

    </StyledApp >
  );

};

App.propTypes = {
  query: PropTypes.string,
}

export { App };


