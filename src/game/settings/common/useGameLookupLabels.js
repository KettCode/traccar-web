import { useState } from 'react';
import { useAsyncTask } from '../../../reactHelper';
import fetchOrThrow from '../../../common/util/fetchOrThrow';

const useGameLookupLabels = (lookup) => {
  const [labels, setLabels] = useState({});

  useAsyncTask(
    async ({ signal }) => {
      const response = await fetchOrThrow(`/api/games/lookups/${lookup}`, { signal });
      const data = await response.json();
      setLabels(Object.fromEntries(data.map((option) => [option.value, option.label])));
    },
    [lookup],
  );

  return labels;
};

export default useGameLookupLabels;
