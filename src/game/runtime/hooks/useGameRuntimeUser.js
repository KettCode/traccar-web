import { useSelector } from 'react-redux';

const useGameRuntimeUser = () =>
  useSelector((state) => {
    const user = state.session.user;
    return Boolean(user?.readonly && !user?.administrator);
  });

export default useGameRuntimeUser;
