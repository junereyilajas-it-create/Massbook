import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function HeaderSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const trimmed = query.trim();

  const canSubmit = useMemo(() => {
    const currentQ = (searchParams.get('q') ?? '').trim();
    if (!trimmed) return false;
    return trimmed !== currentQ;
  }, [trimmed, searchParams]);

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    if (trimmed) {
      next.set('q', trimmed);
    } else {
      next.delete('q');
    }

    setSearchParams(next, { replace: true });

    // Search results are currently implemented on /mass-schedule
    navigate('/mass-schedule');
  };

  return (
    <form
      className="header-search-form"
      onSubmit={(e) => {
        e.preventDefault();
        // Allow Enter to trigger search if the input is non-empty
        if (trimmed) applySearch();
      }}
    >
      <label htmlFor="header-search" className="visually-hidden">
        Search parish records
      </label>
      <input
        id="header-search"
        type="search"
        placeholder="Search parish records..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search parish records"
      />
    </form>
  );
}

export default HeaderSearch;

