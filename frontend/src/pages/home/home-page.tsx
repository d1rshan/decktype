import GameSelector from '../../features/game-selector/game-selector'

type HomePageProps = {
  onSelectGame: (slug: string) => void
  onNavigate: (path: string) => void
}

function HomePage(props: HomePageProps) {
  return (
    <div class="flex flex-col items-center justify-center flex-1">
      <GameSelector onSelectGame={props.onSelectGame} />
    </div>
  )
}

export default HomePage
