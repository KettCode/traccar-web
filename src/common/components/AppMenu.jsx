import BottomMenu from './BottomMenu';
import GameRuntimeMenu from '../../game/runtime/GameRuntimeMenu';
import useGameRuntimeUser from '../../game/runtime/hooks/useGameRuntimeUser';
import useCurrentGame from '../../game/runtime/hooks/useCurrentGame';

const AppMenu = () => {
  const gameRuntimeUser = useGameRuntimeUser();
  const { currentGame } = useCurrentGame(gameRuntimeUser);

  return gameRuntimeUser ? <GameRuntimeMenu currentGame={currentGame} /> : <BottomMenu />;
};

export default AppMenu;
